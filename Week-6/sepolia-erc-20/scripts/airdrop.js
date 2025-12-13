const hre = require("hardhat");
const recipients = require("../airdrop.json");

async function main(){
    const [deployer] = await hre.ethers.getSigners();

    console.log("Airdrop sender:", deployer.address);

    const TOKEN_ADDRESS = "0x859AA9197A948296493f4A83f66E45EEc5994843";

    const token = await hre.ethers.getContractAt(
        "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol:IERC20Metadata",
        TOKEN_ADDRESS
    );

    const decimals = await token.decimals();

    for(let i = 0; i < recipients.length; i++){
        const { address, amount } = recipients[i];
        const value = hre.ethers.parseUnits(amount, decimals);
        const tx = await token.transfer(address, value);
        await tx.wait();

        console.log(
            `✅ Sent ${amount} tokens to ${address} (tx: ${tx.hash})`
        );
    }

    console.log("🎉 Airdrop completed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});