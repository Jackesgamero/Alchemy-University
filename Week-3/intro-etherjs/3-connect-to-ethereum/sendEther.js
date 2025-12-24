const { Wallet, utils, providers } = require('ethers');
const { ganacheProvider, PRIVATE_KEY } = require('./config');

// TODO: replace undefined with a new web3 provider
const provider = new providers.Web3Provider(ganacheProvider);

const wallet = new Wallet(PRIVATE_KEY);

async function sendEther({ value, to }) {
    const rawTx = await wallet.signTransaction({ 
        value, to, 
        gasLimit: 0x5208,
        gasPrice: 0x3b9aca00 
    });

    // TODO: send the transaction and return the transaction promise
    return provider.sendTransaction(rawTx);
}

module.exports = sendEther;