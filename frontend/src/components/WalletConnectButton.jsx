import React, { useEffect, useState } from "react";

const WalletConnectButton = () => {
  const [walletAddress, setWalletAddress] = useState("");

  // Fungsi koneksi
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(""); // Logout
        }
      } catch (err) {
        console.error("Connection error:", err);
        alert("Gagal menghubungkan wallet. Pastikan MetaMask aktif dan sudah login.");
      }
    } else {
      alert("MetaMask tidak ditemukan. Install atau aktifkan ekstensi MetaMask.");
    }
  };

  // Fungsi 'logout' manual
  const disconnectWallet = () => {
    setWalletAddress("");
  };

  // Pantau perubahan akun (termasuk logout)
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(""); // User logout dari MetaMask
        }
      });
    }
  }, []);

  return (
    <button
      onClick={walletAddress ? disconnectWallet : connectWallet}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md"
    >
      {walletAddress
        ? `Disconnect: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : "Connect Wallet"}
    </button>
  );
};

export default WalletConnectButton;
