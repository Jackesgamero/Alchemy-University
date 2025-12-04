const { providers } = require('ethers');
const { ganacheProvider } = require('./config');

const provider = new providers.Web3Provider(ganacheProvider);

/**
 * Given an ethereum address find all the addresses
 * that were sent ether from that address
 * @param {string} address - The hexadecimal address for the sender
 * @async
 * @returns {Array} all the addresses that received ether
 */
async function findEther(address) {
    recipentsAddr = [];

    for (let i = 0; i < 3; i++){
        const transactions = (await provider.getBlockWithTransactions(i+1)).transactions;
        transactions
            .filter((tx) => tx.from == address)
            .forEach((tx) => {
                recipentsAddr.push(tx.to);
            });
    }
    return recipentsAddr;
}

module.exports = findEther;