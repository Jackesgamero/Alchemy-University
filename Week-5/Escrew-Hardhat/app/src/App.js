// App.jsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Escrow from "./Escrow";
import './styles.css';
const EscrowJSON = require("../src/artifacts/contracts/Escrow.sol/Escrow.json");

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

export default function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  const [arbiterInput, setArbiterInput] = useState("");
  const [beneficiaryInput, setBeneficiaryInput] = useState("");
  const [weiInput, setWeiInput] = useState("");

  useEffect(() => {
    async function init() {
      if (!window.ethereum) return console.warn("MetaMask not detected");
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0] || null);
      const network = await provider.getNetwork();
      setChainId(network.chainId);
    }
    init();

    const handleAccounts = (accounts) => setAccount(accounts[0] || null);
    const handleChain = (chainHex) => setChainId(Number(chainHex));

    window.ethereum?.on?.("accountsChanged", handleAccounts);
    window.ethereum?.on?.("chainChanged", handleChain);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccounts);
      window.ethereum?.removeListener?.("chainChanged", handleChain);
    };
  }, []);

  const formatEth = (weiString) => {
    try {
      return ethers.utils.formatEther(ethers.BigNumber.from(weiString));
    } catch {
      return weiString;
    }
  };

  async function newContract() {
    if (!account) return alert("Connect MetaMask first");
    if (!arbiterInput || !beneficiaryInput || !weiInput) return alert("Fill all fields");

    const response = await fetch("http://localhost:3001/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ arbiter: arbiterInput, beneficiary: beneficiaryInput, value: weiInput }),
    });

    const data = await response.json();
    if (!data?.address) return alert("Deploy failed");

    const entry = {
      address: data.address,
      arbiter: arbiterInput,
      beneficiary: beneficiaryInput,
      value: weiInput,
    };
    setEscrows((prev) => [entry, ...prev]);

    setArbiterInput("");
    setBeneficiaryInput("");
    setWeiInput("");
  }

  async function handleApprove(address, onApprovedUI) {
    const contract = new ethers.Contract(address, EscrowJSON.abi, provider);
    const signer = provider.getSigner();
    try {
      contract.once("Approved", () => onApprovedUI());
      const tx = await contract.connect(signer).approve();
      await tx.wait();
    } catch (err) {
      console.error(err);
      alert("Approve failed: " + (err?.message || err));
    }
  }

  return (
    <div className="app-root">
      <header className="hero">
        <div className="hero-inner">
          <h1 className="title">Vaultly — Decentralized Escrow</h1>
          <p className="subtitle">Secure escrows on-chain, beautifully displayed.</p>
          <div className="account-row">
            <div className="chip"><strong>Account:</strong> <span className="mono">{account ?? "Not connected"}</span></div>
            <div className="chip"><strong>Network:</strong> <span className="mono">{chainId ?? "unknown"}</span></div>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="card new-contract">
          <h2>Create new escrow</h2>
          <label>Arbiter
            <input value={arbiterInput} onChange={e => setArbiterInput(e.target.value)} placeholder="0x..." />
          </label>
          <label>Beneficiary
            <input value={beneficiaryInput} onChange={e => setBeneficiaryInput(e.target.value)} placeholder="0x..." />
          </label>
          <label>Deposit (wei)
            <input value={weiInput} onChange={e => setWeiInput(e.target.value)} placeholder="1000000000000000000" />
          </label>
          <div className="actions">
            <button className="btn primary" onClick={newContract}>Deploy</button>
            <button className="btn" onClick={() => { setArbiterInput(""); setBeneficiaryInput(""); setWeiInput(""); }}>Clear</button>
          </div>
        </section>

        <section className="card escrows-list">
          <h2>Existing Contracts</h2>
          {escrows.length === 0 ? (
            <div className="empty">No escrows yet — deploy one!</div>
          ) : (
            <div className="grid">
              {escrows.map(e => (
                <Escrow
                  key={e.address}
                  address={e.address}
                  arbiter={e.arbiter}
                  beneficiary={e.beneficiary}
                  value={formatEth(e.value)}
                  onApprove={(address, callback) => handleApprove(address, callback)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <small>Made with ❤️ — Vaultly</small>
      </footer>
    </div>
  );
}
