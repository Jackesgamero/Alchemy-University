const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;

const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    mempool.push(transaction);
}

function mine() {
    const blockHeight = blocks.length;
    const newBlock = { id: blockHeight };

    const transactions = [];
    while(transactions.length < MAX_TRANSACTIONS && mempool.length > 0){
        const tx = mempool.shift();
        transactions.push(tx);
    }
    newBlock.transactions = transactions;

    newBlock.nonce = 0;
    let hashInt;

    while(true) {
        const blockString = JSON.stringify(newBlock);
        const blockHash = SHA256(blockString).toString();
        const hashInt = BigInt(`0x${blockHash}`);

        if(hashInt < TARGET_DIFFICULTY) {
            newBlock.hash = blockHash;
            break;
        }
        newBlock.nonce++;
    }
    blocks.push(newBlock);
}

module.exports = {
    TARGET_DIFFICULTY,
    MAX_TRANSACTIONS,
    addTransaction, 
    mine, 
    blocks,
    mempool
};
