import { ethers, getDefaultProvider } from "ethers";
import * as fs from "fs";

async function main() {
  console.log("🚀 Deploying EnergyTrade contract to Polygon Amoy...\n");

  // Get private key from environment
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not set in .env file");
  }

  // Connect to Polygon Amoy
  const rpc = "https://rpc-amoy.polygon.technology";
  const provider = new ethers.JsonRpcProvider(rpc);

  // Create signer from private key
  const signer = new ethers.Wallet(privateKey, provider);

  console.log(`Deploying with account: ${signer.address}`);

  // Read contract ABI and bytecode
  const contractJson = JSON.parse(
    fs.readFileSync("artifacts/contracts/EnergyTrade.sol/EnergyTrade.json", "utf8")
  );

  // Create contract factory
  const contractFactory = new ethers.ContractFactory(
    contractJson.abi,
    contractJson.bytecode,
    signer
  );

  // Deploy
  console.log("Deploying contract...");
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("\n✅ Contract deployed successfully!");
  console.log(`📍 Contract Address: ${address}`);
  console.log(`🔗 Polygon Amoy Explorer: https://amoy.polygonscan.com/address/${address}`);
  console.log(`🌐 Network: Polygon Amoy (Chain ID: 80002)`);

  // Save deployment info
  const deploymentInfo = {
    address,
    network: "Polygon Amoy",
    chainId: 80002,
    deployedAt: new Date().toISOString(),
    deployerAddress: signer.address,
  };

  fs.writeFileSync(
    "contract-deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n📝 Deployment info saved to contract-deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
