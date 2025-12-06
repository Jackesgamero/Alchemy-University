const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy({ value: ethers.parseUnits("1", "ether") });

    const [owner, addr1] = await ethers.getSigners();

    let withdrawAmount = ethers.parseUnits("1", "ether");

    console.log('Signer 1 address: ', owner.address);
    return { faucet, owner, withdrawAmount, addr1 };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should not allow withdrawals above .1 ETH at a time', async function () {
        const { faucet, withdrawAmount } = await loadFixture(deployContractAndSetVariables);
        await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it("should allow only the owner to call withdrawAll()", async function () {
  const { faucet, owner, addr1 } = await loadFixture(deployContractAndSetVariables);

  await expect(faucet.connect(owner).withdrawAll()).to.not.be.reverted;

  const { faucet: faucet2, addr1: nonOwner } = await loadFixture(deployContractAndSetVariables);

  await expect(faucet2.connect(nonOwner).withdrawAll()).to.be.reverted;
  });

  it("should transfer all contract ETH to the owner when withdrawAll() is called", async function () {
  const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

  const provider = ethers.provider;

  const initialContractBalance = await provider.getBalance(faucet.target);
  const initialOwnerBalance = await provider.getBalance(owner.address);

  const tx = await faucet.withdrawAll();
  const receipt = await tx.wait();
  const gasUsed = receipt.gasUsed * receipt.gasPrice;

  const finalContractBalance = await provider.getBalance(faucet.target);
  const finalOwnerBalance = await provider.getBalance(owner.address);

  expect(finalContractBalance).to.equal(0n);
  expect(finalOwnerBalance).to.be.closeTo(
    initialOwnerBalance + initialContractBalance - gasUsed,
    ethers.parseUnits("0.000001", "ether") // tolerancia
  );
});

it("should allow only the owner to call destroyFaucet()", async function () {
  const { faucet, owner, addr1 } = await loadFixture(deployContractAndSetVariables);

  await expect(faucet.connect(owner).destroyFaucet()).to.not.be.reverted;

  const { faucet: faucet2 } = await loadFixture(deployContractAndSetVariables);

  await expect(faucet2.connect(addr1).destroyFaucet()).to.be.reverted;
});

it("should actually self-destruct the contract when destroyFaucet() is called", async function () {
  const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
  const provider = ethers.provider;

  // Confirmamos que el código existe antes de destruir
  const codeBefore = await provider.getCode(faucet.target);
  expect(codeBefore).to.not.equal("0x");

  // Owner destruye el contrato
  const tx = await faucet.connect(owner).destroyFaucet();
  await tx.wait(); // esperar que se mine la transacción

  // Comprobamos que el contrato ya no tiene bytecode
  const codeAfter = await provider.getCode(faucet.target);
  expect(codeAfter).to.equal("0x");
});


});