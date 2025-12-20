class Tree {
    constructor() {
        this.root = null;
    }

    addNode(node) {
        if (!this.root) {
            this.root = node;
            return;
        }

        let current = this.root;

        while (true) {
            if (node.data < current.data) {
                if (!current.left) {
                    current.left = node;
                    break;
                } else {
                    current = current.left;
                }
            } else if (node.data > current.data) {
                if (!current.right) {
                    current.right = node; 
                    break;
                } else {
                    current = current.right;
                }
            } 
        }
    }

    hasNode(value) {
        let current = this.root;

        while (current) {
            if (value === current.data) {
                return true;
            } else if (value < current.data) {
                current = current.left; 
            } else {
                current = current.right;
            }
        }
        return false;
    }
}

module.exports = Tree;