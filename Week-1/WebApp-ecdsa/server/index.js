const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("@noble/secp256k1");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "6061e3ea800e4a3b9bb33b3799698aa2569fcd02": 100,
  "7eb3cb0ee04fc15f82c90a43d82821cd3d8ff0f0": 50,
  "82baa10cc4f034b0f6351014ed514d2cab1d5827": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, recoveryBit } = req.body;

  try {
    //Generate and hash the message
    const msg = { sender: sender, amount: amount, recipient: recipient };
    const bytes = utf8ToBytes(JSON.stringify(msg));
    const msgHash = keccak256(bytes);

    //Recover the eth address from the signature
    const pub = secp.recoverPublicKey(msgHash,signature,recoveryBit);
    const address = toHex(keccak256(pub.slice(1)).slice(-20));

    //Check wether the sender is the propietary of the wallet
    if(sender !== address) {
      res.status(400).send({ message: "Invalid signature" });
    }
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
