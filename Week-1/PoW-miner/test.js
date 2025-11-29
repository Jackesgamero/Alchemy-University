const {assert} = require('chai');
const {addTransaction, mempool} = require('../miner');

describe('addTransaction', () => {
    it('should add the transaction to the mempool', () => {
        const transaction = { to: 'bob', sender: 'alice' }
        addTransaction(transaction);
        assert.equal(mempool.length, 1);
        assert.equal(mempool[0], transaction);
    });
});
