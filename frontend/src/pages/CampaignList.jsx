import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
// Import artifact smart contract yang di-compile
import CrowdFunding from "../abis/CrowdFunding.json";

const contractAddress = "0x4BADc658CB702EEfcA9D31dbBDD8585eAD257693";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      // Menghubungkan MetaMask
      if (!window.ethereum) {
        console.error("MetaMask tidak terhubung.");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Provider dan Signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Menghubungkan ke Smart Contract
      const contract = new ethers.Contract(
        contractAddress,
        CrowdFunding.abi,
        signer
      );

      // Mengambil daftar campaigns
      const campaigns = await contract.getCampaigns();

      console.log("Campaigns from smart contract :", campaigns);
      setCampaigns(campaigns);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-6">
        Daftar Penggalangan Dana
      </h1>

      {/* List campaigns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {campaigns.length === 0 ? (
          <p>Belum ada penggalangan dana</p>
        ) : (
          campaigns.map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-1 transition ease-in-out duration-300">
              <img src={item.image} alt="Campaign" className="rounded-md mb-4" />

              <h2 className="text-2xl font-semibold mb-2">
                {item.title}
              </h2>

              <p className="text-gray-500 mb-4">
                {item.description}
              </p>

              <p className="text-gray-700">
                Terkumpul: {ethers.utils.formatEther(item.amountCollected)} ETH
              </p>

              <p className="text-gray-700">
                Target: {ethers.utils.formatEther(item.target)} ETH
              </p>

              <button
                onClick={() => console.log("Donate", item)}
                className="bg-cyan-500 hover:bg-cyan-600 text-gray-50 px-4 py-2 rounded-md">
                Donasi
              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default CampaignList;
