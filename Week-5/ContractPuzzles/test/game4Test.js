const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    const player = ethers.provider.getSigner(0);
    const address = await player.getAddress();

    return { game, player, address};
  }
  it('should be a winner', async function () {
    const { game, player, address } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}
    await game.connect(player).write(address);

    await game.connect(player).win(address);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
