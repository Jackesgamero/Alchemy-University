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


export default function NFTPage() {
  const [nftContract, setNftContract] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [nftData, setNftData] = useState(null);
  const [floorPrice, setFloorPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNFT = async () => {
    try {
      setLoading(true);
      setError(null);
      setNftData(null);

      const data = await alchemy.nft.getNftMetadata(nftContract, tokenId);
      setNftData(data);

      const floor = await alchemy.nft.getFloorPrice(nftContract);
      setFloorPrice(floor.openSea?.floorPrice || floor.looksRare?.floorPrice || "N/A");

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch NFT data. Check contract address and token ID.");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">NFT Lookup</h1>

      <div className="card">
        <h2>🔍 Lookup NFT Metadata</h2>

        <input
          className="input"
          placeholder="NFT Contract Address..."
          value={nftContract}
          onChange={(e) => setNftContract(e.target.value)}
        />

        <input
          className="input"
          placeholder="Token ID..."
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />

        <button className="button" onClick={fetchNFT} disabled={loading}>
          {loading ? "Fetching..." : "Fetch NFT"}
        </button>

        {error && <p className="error">{error}</p>}

        {nftData && (
          <div className="nft-info">
            <p><strong>Name:</strong> {nftData.title}</p>
            <p><strong>Description:</strong> {nftData.description}</p>
            <p><strong>Floor Price:</strong> {floorPrice} ETH</p>
            {nftData.media[0]?.gateway && (
              <img
                src={nftData.media[0].gateway}
                alt="NFT"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

//0xBC4CA0EdA7647a8ab7C2061C2e118A18a936f13D
//5270