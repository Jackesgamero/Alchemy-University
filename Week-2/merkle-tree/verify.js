function verifyProof(proof, node, root, concat) {
    let hash = node;

    for (const step of proof) {
        if (step.left) {
            hash = concat(step.data, hash);
        } else {
            hash = concat(hash, step.data);
        }
    }
    return hash === root;
}

module.exports = verifyProof;
