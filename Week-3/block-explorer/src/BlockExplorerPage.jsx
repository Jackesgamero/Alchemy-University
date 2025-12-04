import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import "./blockStyles.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

export default function BlockExplorerPage() {
  // ===== Blocks =====
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== Pending Transaction =====
  const [pendingTxHash, setPendingTxHash] = useState("");
  const [txStatus, setTxStatus] = useState(null);

  // ===== Address Transfers =====
  const [address, setAddress] = useState("");
  const [transfers, setTransfers] = useState([]);

  // ===== Load latest block =====
  useEffect(() => {
    async function loadBlock() {
      try {
        setLoading(true);
        const number = await alchemy.core.getBlockNumber();
        setBlockNumber(number);

        const blockInfo = await alchemy.core.getBlockWithTransactions(number);
        setBlock(blockInfo);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    loadBlock();
  }, []);

  // ===== Check pending transaction =====
  const checkTx = async () => {
    try {
      const receipt = await alchemy.core.getTransactionReceipt(pendingTxHash);
      if (!receipt) setTxStatus("Pending...");
      else setTxStatus(receipt.status === 1 ? "Success" : "Failed");
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Get transfers for address =====
  const getTransfers = async () => {
    try {
      const txs = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        toAddress: address,
        category: ["erc20", "erc721", "erc1155"],
      });
      setTransfers(txs.transfers);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="loading">Loading block data...</p>;

  return (
    <div className="etherscan-container">
      {/* Block Summary */}
      <div className="block-card">
        <h2>Block Summary</h2>
        <div className="card-content">
          <div className="card-item">
            <strong>Block Number:</strong> {block.number}
          </div>
          <div className="card-item">
            <strong>Timestamp:</strong>{" "}
            {new Date(block.timestamp * 1000).toLocaleString()}
          </div>
          <div className="card-item">
            <strong>Miner:</strong> <span className="mono">{block.miner}</span>
          </div>
          <div className="card-item">
            <strong>Hash:</strong> <span className="mono">{block.hash}</span>
          </div>
          <div className="card-item">
            <strong>Parent Hash:</strong>{" "}
            <span className="mono">{block.parentHash}</span>
          </div>
          <div className="card-item">
            <strong>Gas Used:</strong> {block.gasUsed.toString()}
          </div>
          <div className="card-item">
            <strong>Gas Limit:</strong> {block.gasLimit.toString()}
          </div>
          <div className="card-item">
            <strong>Difficulty:</strong> <span className="mono">{block.difficulty}</span>
          </div>
          <div className="card-item">
            <strong>Transactions:</strong> {block.transactions.length}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="block-card">
        <h2>Transactions (first 20)</h2>
        <div className="card-content">
          {block.transactions.slice(0, 20).map((tx) => (
            <div key={tx.hash} className="tx-card">
              <div>
                <strong>Hash:</strong>{" "}
                <span className="mono hash">{tx.hash}</span>
              </div>
              <div>
                <strong>From:</strong> <span className="mono">{tx.from}</span>
              </div>
              <div>
                <strong>To:</strong> <span className="mono">{tx.to || "Contract creation"}</span>
              </div>
              <div>
                <strong>Value:</strong> {(Number(tx.value) / 1e18).toFixed(4)} ETH
              </div>
              <div>
                <button
                  className="button-copy"
                  onClick={() => navigator.clipboard.writeText(tx.hash)}
                >
                  Copy Hash
                </button>
              </div>
            </div>
          ))}
        </div>
        {block.transactions.length > 20 && (
          <p className="note">
            Showing first 20 of {block.transactions.length} transactions.
          </p>
        )}
      </div>

      {/* Pending Transaction */}
      <div className="block-card">
        <h2>Pending Transaction Status</h2>
        <input
          placeholder="Transaction Hash"
          value={pendingTxHash}
          onChange={(e) => setPendingTxHash(e.target.value)}
        />
        <button className="button-copy" onClick={checkTx}>
          Check Status
        </button>
        {txStatus && <p>Status: {txStatus}</p>}
      </div>

      {/* Address Transfers */}
      <div className="block-card">
        <h2>Transfers Received by Address</h2>
        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="button-copy" onClick={getTransfers}>
          Get Transfers
        </button>

        {transfers.length > 0 && (
          <div className="card-content">
            {transfers.slice(0, 10).map((tx) => (
              <div key={tx.hash} className="tx-card">
                <div>
                  <strong>Hash:</strong> <span className="mono hash">{tx.hash}</span>
                </div>
                <div>
                  <strong>From:</strong> <span className="mono">{tx.from}</span>
                </div>
                <div>
                  <strong>To:</strong> <span className="mono">{tx.to}</span>
                </div>
                <div>
                  <strong>Token:</strong> {tx.asset || "ETH"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}