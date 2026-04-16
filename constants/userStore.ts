import { useSyncExternalStore } from 'react';

export type TradeStatus = 'completed' | 'cancelled' | 'pending';
export type TradeType = 'sold' | 'bought';
export type UserRole = 'buyer' | 'seller';

export type TradeChatEntry = {
  sender: 'you' | 'counterparty';
  text: string;
  at: string;
};

export type TradeItem = {
  id: string;
  date: string;
  status: TradeStatus;
  energy: string;
  price: string;
  type: TradeType;
  counterpart: string;
  settlementHash?: string;
  settlementNetwork?: string;
  paymentConfirmedAt?: string;
  dealLockedAt?: string;
  negotiationSource?: 'xai' | 'fallback' | 'manual';
  chatTranscript?: TradeChatEntry[];
};

export type UserState = {
  onboarding: {
    selectedRole: UserRole | null;
    credentialFileName: string | null;
    credentialUri: string | null;
    verificationState: 'not-started' | 'pending' | 'verified';
  };
  profile: {
    name: string;
    email: string;
    city: string;
    discomName: string;
    meterId: string;
    verified: boolean;
  };
  wallet: {
    balance: number;
    monthlySpend: number;
    monthlyEarnings: number;
    greenSavingsKg: number;
    autoTopUpEnabled: boolean;
    autoTopUpThreshold: number;
  };
  preferences: {
    autoSell: boolean;
    notifications: boolean;
    fastSettlement: boolean;
  };
  market: {
    livePricePerKwh: number;
    demandLevel: 'Low' | 'Normal' | 'High';
    solarForecast: 'Weak' | 'Moderate' | 'Strong';
  };
  trades: TradeItem[];
};

const initialState: UserState = {
  onboarding: {
    selectedRole: null,
    credentialFileName: null,
    credentialUri: null,
    verificationState: 'not-started',
  },
  profile: {
    name: 'Kakarla Charith',
    email: 'charith.k@yagami.energy',
    city: 'Hyderabad, TS',
    discomName: 'Tata Power Delhi Distribution Limited',
    meterId: 'MTR-121004523',
    verified: false,
  },
  wallet: {
    balance: 12450,
    monthlySpend: 2180,
    monthlyEarnings: 3470,
    greenSavingsKg: 128,
    autoTopUpEnabled: true,
    autoTopUpThreshold: 1000,
  },
  preferences: {
    autoSell: true,
    notifications: true,
    fastSettlement: false,
  },
  market: {
    livePricePerKwh: 4.2,
    demandLevel: 'Normal',
    solarForecast: 'Strong',
  },
  trades: [
    {
      id: '1',
      date: 'April 12, 2026',
      status: 'completed',
      energy: '12.4 kWh',
      price: '₹ 62.4',
      type: 'sold',
      counterpart: 'Consumer Node-120',
      settlementHash: '0xa1b2c3d4e5f6012a9b8c7d6e5f4a3210',
      settlementNetwork: 'Polygon Amoy',
      paymentConfirmedAt: 'April 12, 2026 10:24 AM',
    },
    {
      id: '2',
      date: 'April 11, 2026',
      status: 'completed',
      energy: '8.0 kWh',
      price: '₹ 41.6',
      type: 'bought',
      counterpart: 'Seller Node-045',
      settlementHash: '0xbc34aa991e22145fe60789df6ca010ef',
      settlementNetwork: 'Polygon Amoy',
      paymentConfirmedAt: 'April 11, 2026 04:15 PM',
    },
    {
      id: '3',
      date: 'April 09, 2026',
      status: 'cancelled',
      energy: '15.0 kWh',
      price: '₹ 78.0',
      type: 'sold',
      counterpart: 'Buyer Node-990',
    },
    {
      id: '4',
      date: 'April 08, 2026',
      status: 'pending',
      energy: '6.2 kWh',
      price: '₹ 29.8',
      type: 'bought',
      counterpart: 'Prosumer Node-212',
    },
  ],
};

function createInitialState(): UserState {
  return {
    onboarding: { ...initialState.onboarding },
    profile: { ...initialState.profile },
    wallet: { ...initialState.wallet },
    preferences: { ...initialState.preferences },
    market: { ...initialState.market },
    trades: initialState.trades.map((trade) => ({
      ...trade,
      chatTranscript: trade.chatTranscript ? trade.chatTranscript.map((entry) => ({ ...entry })) : undefined,
    })),
  };
}

let state: UserState = initialState;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function updateState(mutator: (prev: UserState) => UserState) {
  state = mutator(state);
  emit();
}

export function useUserStore() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state
  );
}

export function updateProfile(partial: Partial<UserState['profile']>) {
  updateState((prev) => ({ ...prev, profile: { ...prev.profile, ...partial } }));
}

export function updateOnboarding(partial: Partial<UserState['onboarding']>) {
  updateState((prev) => ({ ...prev, onboarding: { ...prev.onboarding, ...partial } }));
}

export function updatePreferences(partial: Partial<UserState['preferences']>) {
  updateState((prev) => ({ ...prev, preferences: { ...prev.preferences, ...partial } }));
}

export function updateWallet(partial: Partial<UserState['wallet']>) {
  updateState((prev) => ({ ...prev, wallet: { ...prev.wallet, ...partial } }));
}

export function updateMarket(partial: Partial<UserState['market']>) {
  updateState((prev) => ({ ...prev, market: { ...prev.market, ...partial } }));
}

export function addTrade(trade: TradeItem) {
  updateState((prev) => ({ ...prev, trades: [trade, ...prev.trades] }));
}

export function updateTradeStatus(tradeId: string, status: TradeStatus) {
  updateState((prev) => ({
    ...prev,
    trades: prev.trades.map((trade) => (trade.id === tradeId ? { ...trade, status } : trade)),
  }));
}

export function finalizeTradeSettlement(tradeId: string, settlementHash: string, settlementNetwork = 'Polygon Amoy') {
  updateState((prev) => ({
    ...prev,
    trades: prev.trades.map((trade) =>
      trade.id === tradeId
        ? {
            ...trade,
            status: 'completed',
            settlementHash,
            settlementNetwork,
            paymentConfirmedAt: new Date().toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }
        : trade
    ),
  }));
}

export function resetUserState() {
  state = createInitialState();
  emit();
}
