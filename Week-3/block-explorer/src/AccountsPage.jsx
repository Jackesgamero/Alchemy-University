import { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import "./styles.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export default function AccountsPage() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookupBalance() {
    try {
      setLoading(true);
      setError("");
      setBalance(null);

      if (!address) {
        setError("Please enter an Ethereum address.");
        return;
      }

      const rawBalance = await alchemy.core.getBalance(address);
      const eth = Number(rawBalance) / 1e18;

      setBalance(eth.toFixed(6));
    } catch (err) {
      setError("Invalid address or network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 className="title">Account Balance Checker</h1>

      <div className="card">
        <h2>🔍 Lookup Balance</h2>

        <input
          className="input"
          placeholder="Enter Ethereum address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button className="button" onClick={lookupBalance} disabled={loading}>
          {loading ? "Checking..." : "Check Balance"}
        </button>

        {error && <p className="error">{error}</p>}

        {balance !== null && (
          <p className="balance">Balance: {balance} ETH</p>
        )}
      </div>
    </div>
  );
}

