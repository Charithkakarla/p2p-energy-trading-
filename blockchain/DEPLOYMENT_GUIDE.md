# Smart Contract Deployment Guide

## Overview
This guide will help you deploy the **EnergyTrade** smart contract to Polygon Amoy testnet using your funded MetaMask wallet.

## Prerequisites
✅ MetaMask installed and configured with Polygon Amoy network
✅ Test POL tokens in your wallet (you just received these)
✅ Hardhat project initialized (done)

---

## Step 1: Extract Your Private Key from MetaMask

1. Open MetaMask
2. Click on the **Menu** (three dots) → **Settings**
3. Select **Security & Privacy**
4. Scroll down and click **Show Private Key**
5. Enter your MetaMask password
6. Copy the private key (starts with `0x`)

⚠️ **SECURITY WARNING**: 
- Never share your private key with anyone
- Never commit it to git or version control
- Only use it in `.env` file (which should be in .gitignore)

---

## Step 2: Configure Environment Variables

1. In the `blockchain/` folder, create a new file called `.env`
2. Copy the contents from `.env.example`
3. Paste your private key:

```
PRIVATE_KEY=0xyour_actual_private_key_here
```

Save the file. The `.env` file is already in `.gitignore` so it won't be committed.

---

## Step 3: Compile the Contract

Run this command in the `blockchain/` folder:

```bash
npm run build
```

or

```bash
npx hardhat compile
```

This compiles the Solidity contract to bytecode. You should see:
```
Contracts compiled successfully
```

---

## Step 4: Deploy to Polygon Amoy

Now deploy the contract:

```bash
npx hardhat run scripts/deploy.ts --network polygonAmoy
```

**Expected output:**
```
🚀 Deploying EnergyTrade contract to Polygon Amoy...

Deploying contract...

✅ Contract deployed successfully!
📍 Contract Address: 0x1234...abcd
🔗 Polygon Amoy Explorer: https://amoy.polygonscan.com/address/0x1234...abcd
🌐 Network: amoy (Chain ID: 80002)
```

Save the contract address - you'll need it for app integration!

---

## Step 5: Verify Contract on Explorer (Optional but Recommended)

1. Go to https://amoy.polygonscan.com
2. Paste your contract address from Step 4
3. Confirm all transaction details are correct
4. Click on **Transactions** tab to see the deployment transaction

---

## Step 6: Integration with React Native App

Once deployment is complete, we'll integrate the contract into your app:

1. Copy the contract address from `contract-deployment.json`
2. Create a config file in `app/config/blockchainConfig.ts` with the contract address and ABI
3. Update `BlockchainPaymentModal.tsx` to call real contract functions instead of mocked ones
4. Wire up MetaMask signing for actual blockchain transactions

---

## Troubleshooting

### Error: "Cannot find module 'dotenv'"
- Run: `npm install dotenv`

### Error: "PRIVATE_KEY not provided"
- Ensure `.env` file exists in the `blockchain/` folder
- Check that you copied your private key correctly
- Restart your terminal after creating `.env`

### Error: "insufficient funds for gas"
- You may need more test POL. Request more from the faucet:
  - https://faucet.polygon.technology/ (select Polygon Amoy)
  - Use your wallet address to get more tokens

### Error: "invalid sender"
- Your private key might be incorrect. Double-check it in MetaMask
- Ensure there are no extra spaces or quotes

### Contract address shows on explorer but says "source code not verified"
- That's normal for now. We can verify it later using Hardhat Verify plugin

---

## Next Steps

Once deployment succeeds:
1. ✅ Contract deployed to Polygon Amoy
2. 📱 Integrate contract ABI into React Native app
3. 🔗 Replace mock blockchain calls with real contract interactions
4. 💳 Wire MetaMask signing into payment modal
5. ✨ Test end-to-end flow with real blockchain transactions

Let me know once you've deployed! I'll help with the app integration. 🚀
