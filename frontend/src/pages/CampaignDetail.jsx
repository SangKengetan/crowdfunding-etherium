import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import CrowdFunding from "../abis/CrowdFunding.json";

const contractAddress = "0xdd9F11eb62126b0BF0e68cc5471c181E2Df194d5";

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donators, setDonators] = useState([]);
  const [donations, setDonations] = useState([]);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Tambahkan untuk sidebar
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaignData();
  }, []);

  const fetchCampaignData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CrowdFunding.abi, signer);

      const data = await contract.getCampaignById(id); // ✅ gunakan getCampaignById()
      setCampaign(data);

      const [donatorList, donationList] = await contract.getDonators(id);
      setDonators(donatorList);
      setDonations(donationList);
    } catch (error) {
      console.error("Gagal mengambil data campaign:", error);
    }
  };

  const handleNavigate = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleDonate = async () => {
    if (!amount || isNaN(amount)) return alert("Masukkan jumlah donasi yang valid.");
    setIsLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CrowdFunding.abi, signer);

      const tx = await contract.donateToCampaign(id, {
        value: ethers.utils.parseEther(amount),
      });

      await tx.wait();
      alert("Donasi berhasil!");

      setAmount("");
      fetchCampaignData();
    } catch (error) {
      console.error("Gagal melakukan donasi:", error);
      alert("Gagal donasi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!campaign) return <div className="p-4 text-white">Memuat data campaign...</div>;

  const deadlineMs = Number(campaign.deadline) * 1000;
  const isExpired = Date.now() > deadlineMs;
  const isDisabled = isExpired || !campaign.isActive;

  return (
    // <div className="p-6 bg-gray-900 text-white min-h-screen">
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Hamburger */}
      <div className="absolute top-4 left-4 z-50">
        <button
          className="flex flex-col gap-1 group"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="w-6 h-1 bg-white transition-all duration-300 group-hover:bg-cyan-400"
            ></span>
          ))}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 w-48 h-full bg-gray-800 p-6 pt-16 shadow-lg transition-transform duration-300 z-40 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="space-y-4">
          <li className="flex justify-center">
            <button
              onClick={() => handleNavigate("/")}
              className="w-48 py-2 px-4 text-white hover:text-cyan-400 transition text-center"
            >
              Home
            </button>
          </li>
          <li className="flex justify-center">
            <button
              onClick={() => handleNavigate("/all-campaigns")}
              className="w-48 py-2 px-4 text-cyan-400 font-semibold transition text-center"
            >
              Seluruh Campaign
            </button>
          </li>
          <li className="flex justify-center">
            <button
              onClick={() => handleNavigate("/my-campaigns")}
              className="w-48 py-2 px-4 text-white hover:text-cyan-400  transition text-center"
            >
              Campaign Saya
            </button>
          </li>
          <li className="flex justify-center">
            <button
              onClick={() => handleNavigate("/create-campaign")}
              className="w-48 py-2 px-4 text-white hover:text-cyan-400 transition text-center"
            >
              Create Campaign
            </button>
          </li> 
        </ul>
      </div>
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <img
          src={campaign.image}
          alt="Campaign"
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
        <p className="mb-4 text-gray-300">{campaign.description}</p>

        <div className="mb-4">
          <p><strong>Target:</strong> {ethers.utils.formatEther(campaign.target)} ETH</p>
          <p><strong>Terkumpul:</strong> {ethers.utils.formatEther(campaign.amountCollected)} ETH</p>
          <p><strong>Owner:</strong> {campaign.owner}</p>
          <p><strong>Status:</strong> {isExpired ? "Berakhir" : campaign.isActive ? "Aktif" : "Nonaktif"}</p>
        </div>

        {/* Form Donasi */}
        <div className="mb-6">
          <label className="block mb-1">Jumlah Donasi (ETH)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
            disabled={isDisabled}
          />
          <button
            onClick={handleDonate}
            disabled={isDisabled || isLoading}
            className={`mt-3 w-full ${isDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"} text-white font-semibold py-2 px-4 rounded transition`}
          >
            {isLoading ? "Mengirim..." : isDisabled ? "Campaign Tidak Aktif" : "Donasi Sekarang"}
          </button>
        </div>

        {/* Daftar Donatur */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Donatur</h2>
          {donators.length === 0 ? (
            <p className="text-gray-400">Belum ada donasi.</p>
          ) : (
            <ul className="list-disc ml-5 text-gray-300 space-y-1">
              {donators.map((addr, index) => (
                <li key={index}>
                  {addr} - {ethers.utils.formatEther(donations[index])} ETH
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
