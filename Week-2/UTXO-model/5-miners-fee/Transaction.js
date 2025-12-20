class Transaction {
    constructor(inputUTXOs, outputUTXOs) {
        this.inputUTXOs = inputUTXOs;
        this.outputUTXOs = outputUTXOs;
    }
    execute() {
        for (const utxo of this.inputUTXOs) {
            if (utxo.spent) {
                throw new Error("Input TXO has already been spent!");
            }
        }

        const totalInput = this.inputUTXOs.reduce((sum, utxo) => sum + utxo.amount, 0);
        const totalOutput = this.outputUTXOs.reduce((sum, utxo) => sum + utxo.amount, 0);

        if (totalInput < totalOutput) {
            throw new Error(
                `Not enough input value to cover outputs: inputs=${totalInput}, outputs=${totalOutput}`
            );
        }

        for (const utxo of this.inputUTXOs) {
            utxo.spent = true;
        }
        this.fee = totalInput - totalOutput;
    }
}

module.exports = Transaction;