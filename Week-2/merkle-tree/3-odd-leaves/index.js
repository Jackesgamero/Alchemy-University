class MerkleTree {
    constructor(leaves, concat) {
        this.leaves = leaves;
        this.concat = concat;
    }
    getRoot() {
        let layer = this.leaves;

        while (layer.length > 1) {
            const nextLayer = [];

            for (let i = 0; i < layer.length; i += 2) {
                const left = layer[i];
                const right = layer[i + 1];

                if (right !== undefined) {
                    nextLayer.push(this.concat(left, right));
                } else {
                    nextLayer.push(left);
                }
            }

            layer = nextLayer;
        }

        return layer[0];
    }

    getProof(index) {
    const proof = [];
    let layer = [...this.leaves];

    while (layer.length > 1) {
        const nextLayer = [];

        for (let i = 0; i < layer.length; i += 2) {
            const left = layer[i];
            const right = layer[i + 1];

            if (right !== undefined) {
                nextLayer.push(this.concat(left, right));
            } else {
                nextLayer.push(left);
            }
        }

        const isLeftNode = index % 2 === 0;
        const pairIndex = isLeftNode ? index + 1 : index - 1;

        if (layer[pairIndex] !== undefined) {
            proof.push({
                data: layer[pairIndex],
                left: !isLeftNode
            });
        }

        index = Math.floor(index / 2);
        layer = nextLayer;
    }

    return proof;
}

}

module.exports = MerkleTree;