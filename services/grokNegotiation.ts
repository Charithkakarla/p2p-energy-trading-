type NegotiationMessage = {
  sender: 'you' | 'seller';
  text: string;
};

export type NegotiationTurnRequest = {
  counterpartName: string;
  counterpartRole: 'seller' | 'buyer';
  askingPrice: string;
  energyAmount: string;
  marketPrice: string;
  history: NegotiationMessage[];
  userMessage: string;
};

export type NegotiationTurnResponse = {
  assistantReply: string;
  acceptDeal: boolean;
  acceptedPrice: string;
  source: 'xai' | 'fallback';
};

type XaiJsonReply = {
  assistantReply?: string;
  acceptDeal?: boolean;
  acceptedPrice?: string;
};

const DEFAULT_NEGOTIATION_PROMPT =
  'You are a P2P energy trade negotiation assistant on Yagami. Respond as the verified counterparty and keep messages concise. Goal: politely negotiate, then accept a deal when the user asks to confirm, lock, buy now, or explicitly agrees on price. Always return strict JSON only with keys: assistantReply (string), acceptDeal (boolean), acceptedPrice (string). When acceptDeal is true, acceptedPrice must be a concrete final price string (for example: Rs 4.22/kWh). Never include markdown.';

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed;
  }

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return '{}';
}

function parseJsonReply(text: string): XaiJsonReply {
  try {
    return JSON.parse(extractJson(text)) as XaiJsonReply;
  } catch {
    return {};
  }
}

function fallbackNegotiation(req: NegotiationTurnRequest): NegotiationTurnResponse {
  const lower = req.userMessage.toLowerCase();
  const asksToConfirm =
    lower.includes('accept') ||
    lower.includes('lock') ||
    lower.includes('done') ||
    lower.includes('confirm') ||
    lower.includes('buy now') ||
    lower.includes('deal');

  const requestsDiscount =
    lower.includes('lower') || lower.includes('reduce') || lower.includes('discount');

  if (asksToConfirm) {
    return {
      assistantReply: `Deal accepted. Locking ${req.askingPrice} for ${req.energyAmount}.`,
      acceptDeal: true,
      acceptedPrice: req.askingPrice,
      source: 'fallback',
    };
  }

  if (requestsDiscount) {
    return {
      assistantReply:
        'I can offer a small discount only for immediate on-chain settlement. If you want to close now, send your final rate and I will confirm.',
      acceptDeal: false,
      acceptedPrice: req.askingPrice,
      source: 'fallback',
    };
  }

  return {
    assistantReply: `I can proceed at ${req.askingPrice}, or discuss near ${req.marketPrice} for a fast close.`,
    acceptDeal: false,
    acceptedPrice: req.askingPrice,
    source: 'fallback',
  };
}

export async function requestNegotiationTurn(
  req: NegotiationTurnRequest
): Promise<NegotiationTurnResponse> {
  const key = process.env.EXPO_PUBLIC_GROK_API_KEY?.trim();
  const model = process.env.EXPO_PUBLIC_GROK_MODEL?.trim() || 'grok-2-latest';
  const prompt =
    process.env.EXPO_PUBLIC_GROK_NEGOTIATION_PROMPT?.trim() ||
    DEFAULT_NEGOTIATION_PROMPT;

  if (!key) {
    return fallbackNegotiation(req);
  }

  const transcript = req.history
    .map((entry) => `${entry.sender === 'you' ? 'User' : 'Counterparty'}: ${entry.text}`)
    .join('\n');

  const systemPrompt = [
    prompt,
    `Context: counterparty=${req.counterpartName} (${req.counterpartRole}), askingPrice=${req.askingPrice}, energy=${req.energyAmount}, marketPrice=${req.marketPrice}.`,
    'If the user clearly confirms the trade, set acceptDeal=true and provide acceptedPrice.',
  ].join(' ');

  const body = {
    model,
    temperature: 0.35,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Conversation so far:\n${transcript}\n\nLatest user message: ${req.userMessage}`,
      },
    ],
  };

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return fallbackNegotiation(req);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = payload.choices?.[0]?.message?.content || '{}';
    const parsed = parseJsonReply(content);

    return {
      assistantReply:
        typeof parsed.assistantReply === 'string' && parsed.assistantReply.trim()
          ? parsed.assistantReply.trim()
          : `I can proceed at ${req.askingPrice}.`,
      acceptDeal: Boolean(parsed.acceptDeal),
      acceptedPrice:
        typeof parsed.acceptedPrice === 'string' && parsed.acceptedPrice.trim()
          ? parsed.acceptedPrice.trim()
          : req.askingPrice,
      source: 'xai',
    };
  } catch {
    return fallbackNegotiation(req);
  }
}
