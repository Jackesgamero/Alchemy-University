require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const Escrow = require("../src/artifacts/contracts/Escrow.sol/Escrow.json");


const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", // Solo permite tu frontend
  methods: ["GET", "POST"],
}));

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_TESTNET_RPC_URL
);

const wallet = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY, provider);

app.post("/deploy", async (req, res) => {
  try {
    const { arbiter, beneficiary, value } = req.body;

    const factory = new ethers.ContractFactory(
      Escrow.abi,
      Escrow.bytecode,
      wallet
    );

    const escrow = await factory.deploy(
      arbiter,
      beneficiary,
      { value: ethers.BigNumber.from(value) }
    );

    await escrow.deployed();

    res.json({ address: escrow.address});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));

