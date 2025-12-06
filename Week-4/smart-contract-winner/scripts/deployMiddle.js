//npx hardhat run scripts/deploy.js --network sepolia

const ethers = require('ethers');
require('dotenv').config();

async function main() {

  const url = process.env.ALCHEMY_TESTNET_RPC_URL;

  let artifacts = await hre.artifacts.readArtifact("Middle");

  const provider = new ethers.JsonRpcProvider(url);

  let privateKey = process.env.TESTNET_PRIVATE_KEY;

  let wallet = new ethers.Wallet(privateKey, provider);

  // Create an instance of a Faucet Factory
  let factory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);

  let middle = await factory.deploy();

  console.log("Middle address:", await middle.getAddress());

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});