const { ethers } = require("hardhat");
const { parseEther, keccak256, toUtf8Bytes } = ethers.utils;

const GOVERNOR_ADDRESS = "0x04818c5e48a11dDf013E8c5175A72bA56553E022";
const TOKEN_ADDRESS = "0xb94232a63C633A57BA6da88101258554Dc932E00";


async function main() {
  const [owner] = await ethers.getSigners();

  const governor = await ethers.getContractAt("MyGovernor", GOVERNOR_ADDRESS);
  const token = await ethers.getContractAt("MyToken", TOKEN_ADDRESS);

  const description = "Give the owner more tokens";
  const descriptionHash = keccak256(toUtf8Bytes(description));

  const calldata = token.interface.encodeFunctionData(
    "mint",
    [owner.address, parseEther("25000")]
  );

  const proposalId = await governor.hashProposal(
    [token.address],
    [0],
    [calldata],
    descriptionHash
  );

  console.log("Proposal ID:", proposalId.toString());
  console.log("Proposal state:", await governor.state(proposalId));

  const tx = await governor.execute(
    [token.address],
    [0],
    [calldata],
    descriptionHash
  );

  await tx.wait();
  console.log("Proposal executed!");
}

main().catch(console.error);

