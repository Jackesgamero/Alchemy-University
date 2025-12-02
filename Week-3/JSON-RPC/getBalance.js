const provider = require('./providerBalance');

async function getBalance(address) {
    const response = await provider.send({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance", // <-- fill in the method
        params: [address,"latest"],  // <-- fill in the params
    });

    // return the balance of the address
    return response.result;
}

module.exports = getBalance;