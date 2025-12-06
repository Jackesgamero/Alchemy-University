const { ethers } = require("ethers");
require("dotenv").config();

async function main() {

    const url = process.env.ALCHEMY_TESTNET_RPC_URL;
    
    let artifacts = await hre.artifacts.readArtifact("Middle");
    
    const provider = new ethers.JsonRpcProvider(url);

    let privateKey = process.env.TESTNET_PRIVATE_KEY;

    let wallet = new ethers.Wallet(privateKey, provider);

    const middle = new ethers.Contract("0x16484b14Ca6E8d5Ec53daE109CE35CF907294701", artifacts.abi, wallet);

    const tx = await middle.callWinner();

    console.log("Transacción enviada:", tx.hash);

    const receipt = await tx.wait();

    console.log("Transacción confirmada en bloque:", receipt.blockNumber);
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});
