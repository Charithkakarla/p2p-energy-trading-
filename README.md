# P2P Energy Trading (Yagami)

Yagami is a peer-to-peer energy trading platform built with Expo and React Native. It lets people with extra solar generation sell energy to nearby buyers, compare rates, negotiate a deal, and settle the trade through a blockchain-ready workflow.

In simple business terms, this is a digital marketplace for electricity.

## 1. Executive Summary

This product solves a simple market problem:

- Solar owners often produce more power than they need.
- Buyers want cleaner and more flexible electricity options.
- Traditional utility billing is not designed for direct peer-to-peer trading.
- Trust, pricing, and settlement need a transparent workflow.

Yagami gives both sides a single platform to:

- register and verify identity,
- see a live rate reference,
- find nearby counterparties,
- negotiate a final price,
- record the trade,
- and prepare settlement in a blockchain-friendly format.

## 2. What the Product Does

The app is designed around two user roles:

- Buyer: a user who wants to purchase energy.
- Seller: a user who has surplus solar energy to sell.

Each role gets its own marketplace experience, but they share the same platform, ledger, wallet, and verification model.

### Core business flow

1. User opens the platform.
2. User logs in with phone number and OTP.
3. User selects and links a DISCOM.
4. User chooses a role: buyer or seller.
5. User verifies with a credential.
6. User sees nearby buyers or sellers on a map.
7. User compares the offer rate against the live reference rate.
8. User negotiates the price through chat.
9. A trade is created and stored in the ledger.
10. Payment settlement is simulated in the UI and ready for blockchain integration.

## 3. Business Value

This is the version you can explain to a company in simple words.

### Why a business would care

- It creates a new digital market for local energy trading.
- It helps prosumers monetize surplus solar instead of wasting it.
- It gives consumers access to cleaner energy choices.
- It creates transparent pricing and settlement records.
- It builds trust through verification, auditability, and settlement tracking.

### Who benefits

- Sellers: can earn from extra solar generation.
- Buyers: can buy energy at a negotiated or competitive rate.
- DISCOMs/utilities: get trackable settlement records and verification support.
- Platform operator: can earn transaction fees, premium services, or enterprise licensing revenue.

### Possible monetization models

- Per-trade transaction fee.
- Fast-settlement fee.
- Premium listing or priority matching.
- Enterprise reporting dashboards.
- White-label deployments for utilities or energy partners.

## 4. Main Features

### User onboarding and identity

- Phone number login with OTP.
- Role selection: buyer or seller.
- DISCOM selection and linking.
- Credential upload or mock credential testing.

### Marketplace and matching

- Role-specific market screens.
- Nearby discovery based on user location.
- Live rate reference shown for comparison.
- Filters and trust signals for counterparties.

### Negotiation and trade creation

- Chat-based negotiation between buyer and seller.
- Optional AI-assisted negotiation using Grok.
- Fallback rule-based negotiation if AI key is not configured.
- Trade summary and transcript capture.

### Wallet and ledger

- Wallet balance view.
- Monthly spend and earnings.
- Energy bought or sold summaries.
- Trade ledger with completed, pending, and cancelled states.

### Blockchain-ready settlement

- Trade settlement flow is modeled like escrow.
- Contract exists for create, escrow, delivery confirmation, settlement, and cancel.
- Current UI settlement modal simulates the blockchain steps.
- Settlement metadata is written into the local trade store for now.

### Map and location experience

- Nearby counterparties appear on a map.
- Mobile uses `react-native-maps`.
- Web uses `pigeon-maps`.
- Radius control helps users expand or narrow nearby results.

### Desktop and mobile navigation

- Desktop uses a collapsible left sidebar for app tabs.
- Mobile keeps the bottom tab navigation.
- Landing page also uses collapsible navigation for the top modules.

## 5. Simple User Journey

### Buyer journey

1. Buyer logs in.
2. Buyer selects DISCOM.
3. Buyer chooses buyer role.
4. Buyer verifies identity.
5. Buyer sees nearby sellers.
6. Buyer compares asking price to live market reference.
7. Buyer chats and negotiates.
8. Buyer locks the deal.
9. Buyer goes to trades and settles payment.

### Seller journey

1. Seller logs in.
2. Seller selects DISCOM.
3. Seller chooses seller role.
4. Seller verifies identity.
5. Seller sees nearby buyers and demand.
6. Seller compares offers to live market reference.
7. Seller chats and negotiates.
8. Seller locks the deal.
9. Seller receives settlement tracking in the ledger.

## 6. Screen-by-Screen Overview

### Landing page

File: `app/index.tsx`

This is the marketing and explanation page. It shows the product story, how the process works, and the business pitch. It also contains the collapsible sidebar navigation on desktop.

### Auth screens

- `app/(auth)/login.tsx`
- `app/(auth)/discom.tsx`

These screens handle the basic entry flow:

- phone number login,
- OTP verification,
- DISCOM selection,
- and routing into the main app.

### Home dashboard

File: `app/(tabs)/home.tsx`

This is the central role-aware dashboard. It shows:

- user role state,
- verification status,
- live market signal,
- nearby buyers or sellers,
- map view,
- radius control,
- trust snapshot,
- and negotiation entry points.

### Buyer market

File: `app/(tabs)/buy.tsx`

This is the buyer-facing marketplace. It shows seller listings, price, distance, trust score, and a live comparison rate.

### Seller market

File: `app/(tabs)/sell.tsx`

This is the seller-facing marketplace. It shows buyer demand, expected rates, and a live comparison rate for sellers.

### Wallet

File: `app/(tabs)/wallet.tsx`

This screen shows balance, monthly analytics, linked accounts, and spending trends.

### Trades

File: `app/(tabs)/trades.tsx`

This is the trade ledger. It shows pending, completed, and cancelled trades, plus settlement details and transcript history.

### Profile

File: `app/(tabs)/profile.tsx`

This screen manages personal details, verification preference toggles, and account settings.

## 7. Map Integration

The map is implemented as a platform-aware component.

- `components/NearbyMap.tsx` selects the correct implementation.
- `components/NearbyMap.native.tsx` uses `react-native-maps`.
- `components/NearbyMap.web.tsx` uses `pigeon-maps`.

The Home screen controls:

- user location,
- map center,
- nearby nodes,
- radius filter,
- and selected counterparty.

If location access is denied, the app falls back to a city center view so the experience still works.

## 8. Live Rate and Comparison

The app already shows a live rate reference in the marketplace screens.

- Buyers compare seller prices against a live reference rate.
- Sellers compare buyer offers against the same reference.
- The negotiation modal also shows the market price reference during the chat.

Important note:

- This live rate is currently app-managed demo data.
- It is not yet connected to an external live market API.
- The UI and logic are ready for a real feed later.

## 9. State and Logic Architecture

### Current state store

File: `constants/userStore.ts`

This store keeps:

- onboarding data,
- profile data,
- wallet data,
- preferences,
- market reference values,
- and trade history.

### Negotiation service

File: `services/grokNegotiation.ts`

This handles chat negotiation:

- If an AI API key exists, it can call a model.
- If not, it uses fallback logic.
- This makes the product work even without external AI configuration.

## 10. Blockchain Role in the Product

The blockchain workspace is here:

- `blockchain/contracts/EnergyTrade.sol`
- `blockchain/hardhat.config.ts`
- `blockchain/scripts/deploy.ts`

### What the contract does

The contract models the trade lifecycle:

1. Create trade.
2. Lock buyer payment into escrow.
3. Confirm delivery.
4. Complete settlement.
5. Cancel trade if needed.

### Why blockchain is useful here

- It creates a trustworthy record.
- It makes settlement auditable.
- It reduces manual reconciliation.
- It supports future compliance and reporting.

### What is real today

- The contract is real and deployable.
- The app settlement modal is currently simulated.
- The trade ledger stores settlement results locally for now.

## 11. Where Blockchain Can Be Used More Later

If you want to extend this project, blockchain can also be used for:

- escrow-based payment locking,
- on-chain trade receipts,
- verification hashes for credentials,
- meter reading proofs,
- seller reputation tracking,
- settlement splitting,
- and dispute resolution rules.

## 12. Technology Stack

### Frontend

- Expo
- React Native
- Expo Router
- TypeScript

### UI and device features

- `lucide-react-native` for icons
- `expo-location` for GPS/location access
- `expo-document-picker` for credential upload
- `react-native-maps` for native maps
- `pigeon-maps` for web maps

### Blockchain

- Hardhat
- Solidity
- Ethers

## 13. Run Instructions

### Main app

From the project root:

```bash
npm install
npm start
```

Then:

- Press `a` for Android.
- Press `w` for web.
- Scan the QR code in Expo Go for mobile testing.

### Blockchain workspace

From `blockchain/`:

```bash
npm install
npx hardhat compile
npx hardhat test
```

To deploy to Polygon Amoy:

```bash
npx hardhat run scripts/deploy.ts --network polygonAmoy
```

## 14. Environment Variables

### Optional app AI variables

Set these before starting Expo if you want AI negotiation:

- `EXPO_PUBLIC_GROK_API_KEY`
- `EXPO_PUBLIC_GROK_MODEL`
- `EXPO_PUBLIC_GROK_NEGOTIATION_PROMPT`

If the key is missing, the app still works using fallback negotiation logic.

### Blockchain variables

In `blockchain/.env`:

```env
PRIVATE_KEY=0x...
SEPOLIA_PRIVATE_KEY=0x...
SEPOLIA_RPC_URL=https://...
```

Do not commit secrets to git.

## 15. Current Status

### Completed in the app

- Buyer and seller flows.
- Role-based marketplace screens.
- Desktop collapsible sidebar navigation.
- Map-based nearby discovery.
- Negotiation chat.
- Trade ledger.
- Wallet and profile screens.
- Presentation-ready landing page.

### Still simulated or demo-based

- Live rate source is currently app-managed, not a real exchange feed.
- Blockchain settlement modal is simulated in the UI.
- App data is in memory and not persisted to a backend database.

## 16. Business Presentation Summary

If you need to explain this in a company presentation, say this:

"Yagami is a digital marketplace for electricity. It helps people with surplus solar power sell to nearby buyers, compare rates, negotiate a final price, and record the trade transparently. The product is built for both buyers and sellers, supports location-based discovery, includes a live market reference for price comparison, and is ready for blockchain-based settlement and auditability."

## 17. Suggested Next Steps

If this is moving toward production, the best next upgrades are:

1. Connect the live rate to a real market or utility API.
2. Replace simulated settlement with real smart contract calls.
3. Add backend persistence for trades and user profiles.
4. Add push notifications for price changes and trade updates.
5. Add admin/company dashboard and reporting.

## 18. Related Files

- [app/index.tsx](app/index.tsx)
- [app/(auth)/login.tsx](app/(auth)/login.tsx)
- [app/(auth)/discom.tsx](app/(auth)/discom.tsx)
- [app/(tabs)/_layout.tsx](app/(tabs)/_layout.tsx)
- [app/(tabs)/home.tsx](app/(tabs)/home.tsx)
- [app/(tabs)/buy.tsx](app/(tabs)/buy.tsx)
- [app/(tabs)/sell.tsx](app/(tabs)/sell.tsx)
- [app/(tabs)/wallet.tsx](app/(tabs)/wallet.tsx)
- [app/(tabs)/trades.tsx](app/(tabs)/trades.tsx)
- [app/(tabs)/profile.tsx](app/(tabs)/profile.tsx)
- [components/NearbyMap.tsx](components/NearbyMap.tsx)
- [components/TradeChatModal.tsx](components/TradeChatModal.tsx)
- [components/BlockchainPaymentModal.tsx](components/BlockchainPaymentModal.tsx)
- [constants/userStore.ts](constants/userStore.ts)
- [services/grokNegotiation.ts](services/grokNegotiation.ts)
- [blockchain/contracts/EnergyTrade.sol](blockchain/contracts/EnergyTrade.sol)
