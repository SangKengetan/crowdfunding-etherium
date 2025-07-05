import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import CrowdFunding from "../abis/CrowdFunding.json";
import { useNavigate } from "react-router-dom";

const contractAddress = "0x3bDdFB675A7e08C5860CB834AC03B69765c151F2";

const MyCampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadMyCampaigns();
  }, []);

  const loadMyCampaigns = async () => {
    try {
      if (!window.ethereum) {
        console.error("MetaMask tidak terhubung.");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);

      const contract = new ethers.Contract(contractAddress, CrowdFunding.abi, signer);
      const [ids, myCampaigns] = await contract.getMyCampaigns(address);

      const parsed = myCampaigns.map((campaign, i) => ({
        id: ids[i].toNumber(),
        title: campaign.title,
        description: campaign.description,
        target: campaign.target,
        amountCollected: campaign.amountCollected,
        image: campaign.image,
        deadline: campaign.deadline.toNumber(),
        isActive: campaign.isActive
      }));

      setCampaigns(parsed);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id, amountCollected) => {
    const amountBN = ethers.BigNumber.from(amountCollected);
    if (amountBN.lte(0)) {
      return alert("Tidak ada dana untuk ditarik.");
    }

    const confirmWithdraw = window.confirm(
      `Tarik semua dana (${ethers.utils.formatEther(amountCollected)} ETH)?`
    );
    if (!confirmWithdraw) return;

    try {
      setWithdrawingId(id);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CrowdFunding.abi, signer);

      const tx = await contract.withdraw(id, amountCollected);
      await tx.wait();

      alert("Withdraw berhasil!");
      loadMyCampaigns();
    } catch (error) {
      console.error("Withdraw gagal:", error);
      alert("Withdraw gagal.");
    } finally {
      setWithdrawingId(null);
    }
  };

  const getStatusLabel = (campaign) => {
    const now = Math.floor(Date.now() / 1000);
    if (!campaign.isActive) return "Nonaktif";
    if (now > campaign.deadline) return "Expired";
    return "Aktif";
  };

  const canWithdraw = (campaign) => {
    const now = Math.floor(Date.now() / 1000);
    const isExpired = now >= campaign.deadline;
    const reachedTarget = ethers.BigNumber.from(campaign.amountCollected).gte(campaign.target);
    const hasFund = ethers.BigNumber.from(campaign.amountCollected).gt(0);
    return hasFund && (isExpired || reachedTarget);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Aktif": return "bg-green-600";
      case "Expired": return "bg-yellow-500";
      case "Nonaktif": return "bg-gray-500";
      default: return "bg-gray-600";
    }
  };

  const formatTimeLeft = (deadline) => {
    const secondsLeft = deadline - Math.floor(Date.now() / 1000);
    if (secondsLeft <= 0) return "Campaign sudah berakhir";

    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    return `${hours}j ${minutes}m ${seconds}s tersisa`;
  };

  const handleNavigate = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
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
          <li>
            <button
              onClick={() => handleNavigate("/all-campaigns")}
              className="text-white hover:text-cyan-400 transition"
            >
              Seluruh Campaign
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigate("/my-campaigns")}
              className="text-cyan-400 font-semibold"
            >
              Campaign Saya
            </button>
          </li>
        </ul>
      </div>

      {/* Judul */}
      <div className="text-center pt-20 pb-10 px-4">
        <h1 className="text-4xl font-bold tracking-tight">Campaign Saya</h1>
        <p className="text-gray-400 mt-2">Kamu sedang melihat daftar penggalangan dana yang kamu buat</p>
      </div>

      {/* Konten */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">Memuat campaign kamu...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-center text-gray-400">Kamu belum membuat campaign apapun.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((item, index) => {
              const status = getStatusLabel(item);
              const canBeWithdrawn = canWithdraw(item);

              return (
                <div
                  key={index}
                  className="bg-white text-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-semibold truncate">{item.title}</h2>
                      <span
                        className={`text-xs text-white px-2 py-1 rounded-full ${getStatusColor(status)}`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">Terkumpul:</span>{" "}
                      {ethers.utils.formatEther(item.amountCollected)} ETH
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">Target:</span>{" "}
                      {ethers.utils.formatEther(item.target)} ETH
                    </p>
                    <p className="text-xs text-gray-500 italic mb-2">
                      {formatTimeLeft(item.deadline)}
                    </p>

                    {canBeWithdrawn && (
                      <button
                        onClick={() => handleWithdraw(item.id, item.amountCollected)}
                        className={`mt-4 w-full ${
                          withdrawingId === item.id ? "bg-gray-500 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700"
                        } text-white font-semibold py-2 px-4 rounded-lg transition`}
                        disabled={withdrawingId === item.id}
                      >
                        {withdrawingId === item.id ? "Memproses..." : "Withdraw"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCampaignList;
