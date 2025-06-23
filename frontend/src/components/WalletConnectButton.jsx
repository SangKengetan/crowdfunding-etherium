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
          localStorage.setItem("walletAddress", accounts[0]); // Simpan ke localStorage
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
  // const disconnectWallet = () => {
  //   setWalletAddress("");
  // };

  // Pantau perubahan akun (termasuk logout)
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          localStorage.setItem("walletAddress", accounts[0]);
        } else {
          setWalletAddress(""); // User logout dari MetaMask
          localStorage.removeItem("walletAddress");
        }
      });
    }
  }, []);

  return (
    <button
      onClick={walletAddress ? undefined : connectWallet}
      className="wallet-button px-4 py-2 bg-blue-600 hover:bg-blue-700 text-black dark:text-white font-semibold rounded-xl shadow-md"
    >
      {walletAddress
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : "Connect Wallet"}
    </button>
  );
};

export default WalletConnectButton;
