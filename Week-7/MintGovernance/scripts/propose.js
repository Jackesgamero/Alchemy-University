const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

const GOVERNOR_ADDRESS = "0x04818c5e48a11dDf013E8c5175A72bA56553E022";
const TOKEN_ADDRESS = "0xb94232a63C633A57BA6da88101258554Dc932E00";

async function main() {
    const [owner] = await ethers.getSigners();

    const governor = await ethers.getContractAt(
        "MyGovernor",
        GOVERNOR_ADDRESS
    );

    const token = await ethers.getContractAt(
        "MyToken",
        TOKEN_ADDRESS
    );

    const tx = await governor.propose(
        [token.address],
        [0],
        [token.interface.encodeFunctionData(
            "mint",
            [owner.address, parseEther("25000")]
        )],
        "Give the owner more tokens"
    );

    const receipt = await tx.wait();

    const event = receipt.events.find(
        (x) => x.event === "ProposalCreated"
    );

    const proposalId = event.args.proposalId;

    console.log("Proposal created");
    console.log("Proposal ID:", proposalId.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});