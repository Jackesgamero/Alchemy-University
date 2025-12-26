// Escrow.jsx
import React, { useState } from "react";

export default function Escrow({ address, arbiter, beneficiary, value, onApprove }) {
  const [approved, setApproved] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (approved) return;
    setBusy(true);
    try {
      // Llama a la función de approve desde App.jsx
      await onApprove(address, () => setApproved(true));
    } catch (err) {
      console.error(err);
      alert("Approve failed: " + (err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`escrow-card ${approved ? "approved" : ""}`}>
      {/* Cabecera con título y dirección */}
      <div className="escrow-top">
        <div className="escrow-title">Escrow</div>
        <div className="address mono">{address.slice(0, 6)}...{address.slice(-4)}</div>
      </div>

      {/* Información del escrow */}
      <div className="escrow-body">
        <div className="row">
          <div className="label">Arbiter</div>
          <div className="mono small">{arbiter}</div>
        </div>
        <div className="row">
          <div className="label">Beneficiary</div>
          <div className="mono small">{beneficiary}</div>
        </div>
        <div className="row">
          <div className="label">Value</div>
          <div className="mono small">{value} ETH</div>
        </div>
      </div>

      {/* Botón de approve */}
      <button
        className={`btn primary ${approved ? "disabled" : ""}`}
        onClick={handleClick}
        disabled={busy || approved}
      >
        {busy ? "Waiting..." : approved ? "Approved ✓" : "Approve"}
      </button>
    </div>
  );
}
