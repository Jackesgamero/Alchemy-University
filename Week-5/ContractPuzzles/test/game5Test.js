const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const lowAddr = "0x00000000000000000000000000000000000ffff1";

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [lowAddr]
    });

    const impersonatedSigner = await ethers.getSigner(lowAddr);

    const funder = await ethers.provider.getSigner(0);

     await funder.sendTransaction({
      to: lowAddr,
      value: ethers.utils.parseEther("1")
    });

    return { game, impersonatedSigner };
  }
  it('should be a winner', async function () {
    const { game , impersonatedSigner} = await loadFixture(deployContractAndSetVariables);

    // good luck
    await game.connect(impersonatedSigner).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
