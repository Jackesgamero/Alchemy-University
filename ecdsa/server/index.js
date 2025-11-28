const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes, hexToBytes, toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "360734290ba6bd3d5bc81da00fccbdf348f4aef9": 100,
  "e345fd8d25fefc0c4c0401701329c0f826afa225": 50,
  "ae7143f999d5c2146a1c0304be07bb5a95e4ae01": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, recoveryBit, message } = req.body;

  try {
    const msg = utf8ToBytes(JSON.stringify(message));
    const msgHash = keccak256(msg);
    const pubKey = secp.recoverPublicKey(msgHash, signature,recoveryBit);
    const hash = pubKey.slice(1);
    const _hash = keccak256(hash);
    const addressFromRecover = _hash.slice(-20);
    if(toHex(addressFromRecover != sender)) {
      res.status(400).send({ message: "Signature invalid" });
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
