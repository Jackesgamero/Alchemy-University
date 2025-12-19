const { ethers } = require("hardhat");

const GOVERNOR_ADDRESS = "0x04818c5e48a11dDf013E8c5175A72bA56553E022";
const PROPOSAL_ID = "41960448531987851037982842240856197304182123677626750158800051662914625053956";

async function main() {
    const governor = await ethers.getContractAt(
        "MyGovernor",
        GOVERNOR_ADDRESS
    );

    const tx = await governor.castVote(PROPOSAL_ID, 1);
    await tx.wait();

    console.log("Vote cast: FOR");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});