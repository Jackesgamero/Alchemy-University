const Block = require('./Block');

class Blockchain {
    constructor() {
        this.chain = [];
        const block = new Block("genesis");
        this.chain.push(block);
    }

    addBlock(block){
        const previousBlock = this.chain[this.chain.length - 1];
        block.previousHash = previousBlock.toHash();

        this.chain.push(block);
    }

    isValid(){
        for(let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i-1];

            if(current.previousHash.toString() !== previous.toHash().toString()) {
                return false;
            }
        }
        return true;
    }

}

module.exports = Blockchain;
