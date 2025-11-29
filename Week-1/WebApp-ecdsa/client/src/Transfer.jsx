import { useState } from "react";
import server from "./server";
import { privateKey } from "../local/key.json";
import * as secp from "@noble/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes,toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    //Remove 0x
    const internalRecipient = recipient.slice(2);

    //Generate signature
    const msg = { sender: address.slice(2), amount: parseInt(sendAmount), recipient: internalRecipient };
    const bytes = utf8ToBytes(JSON.stringify(msg));
    const msgHash = keccak256(bytes);
    const [sig, recoveryBit] = await secp.sign(msgHash,privateKey[0], { recovered: true });
    
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address.slice(2),
        recipient: internalRecipient,
        amount: parseInt(sendAmount),
        signature: toHex(sig),
        recoveryBit
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
