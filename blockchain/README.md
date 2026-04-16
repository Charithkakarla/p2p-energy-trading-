# Blockchain Workspace (EnergyTrade)

This folder contains the Hardhat workspace for the P2P energy trading smart contract used by Yagami.

## Contract

- `contracts/EnergyTrade.sol`

The contract models a trade lifecycle:

1. `createTrade` - seller creates a trade for a buyer
2. `lockEscrow` - buyer deposits trade amount into escrow
3. `confirmDelivery` - seller confirms energy delivery
4. `completeSettlement` - releases escrow to seller
5. `cancelTrade` - cancels trade (refunds escrow when applicable)

## Networks

Configured in `hardhat.config.ts`:

- `hardhatMainnet` (simulated)
- `hardhatOp` (simulated OP)
- `sepolia`
- `polygonAmoy`

## Setup

From `blockchain/`:

```bash
npm install
```

Create/update `.env` with keys and RPC values:

```env
PRIVATE_KEY=0x...
SEPOLIA_PRIVATE_KEY=0x...
SEPOLIA_RPC_URL=https://...
```

## Compile

```bash
npx hardhat compile
```

## Test

```bash
npx hardhat test
```

## Deploy to Polygon Amoy

```bash
npx hardhat run scripts/deploy.ts --network polygonAmoy
```

Deployment metadata is written to `contract-deployment.json`.

## Useful Scripts

- `scripts/deploy.ts` - deploys `EnergyTrade` using ethers
- `scripts/send-op-tx.ts` - sample OP chain type transaction flow

## Frontend Integration Status

- Frontend currently simulates settlement state progression in `components/BlockchainPaymentModal.tsx`.
- Smart contract is ready for direct integration (replace simulated modal stage completion with real transaction calls).

## Security

- Never commit `.env` secrets.
- Use dedicated test wallets for testnets.
