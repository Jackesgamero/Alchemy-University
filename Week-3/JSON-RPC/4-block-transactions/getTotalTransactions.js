const provider = require('./providerTotalTx');

async function getTotalTransactions(blockNumber) {
    const response = await provider.send({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBlockByNumber",
        params: [blockNumber, false], 
    });

    // return the total number of transactions in the block
    return response.result.transactions.length;
}

module.exports = getTotalTransactions;