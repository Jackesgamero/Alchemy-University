const { ethers } = require("hardhat");

const TOKEN_ADDRESS = "0xb94232a63C633A57BA6da88101258554Dc932E00";

async function main() {
    const [owner] = await ethers.getSigners();

    const token = await ethers.getContractAt(
        "MyToken",
        TOKEN_ADDRESS
    );

    const tx = await token.delegate(owner.address);
    await tx.wait();

    console.log(`Votes delegated to ${owner.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});