import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import CrowdFunding from "../abis/CrowdFunding.json";
import { useNavigate } from "react-router-dom";

const contractAddress = "0x3bDdFB675A7e08C5860CB834AC03B69765c151F2";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadCampaigns();
  }, []);

  // async function loadCampaigns() {
  //   try {
  //     if (!window.ethereum) {
  //       console.error("MetaMask tidak terhubung.");
  //       return;
  //     }

  //     await window.ethereum.request({ method: "eth_requestAccounts" });
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();

  //     const contract = new ethers.Contract(
  //       contractAddress,
  //       CrowdFunding.abi,
  //       signer
  //     );

  //     const campaignsRaw = await contract.getCampaigns();

  //     const campaignsWithId = campaignsRaw.map((c, i) => ({
  //       id: i,
  //       owner: c.owner,
  //       title: c.title,
  //       description: c.description,
  //       target: c.target,
  //       amountCollected: c.amountCollected,
  //       image: c.image,
  //       deadline: Number(c.deadline),
  //       isActive: c.isActive,
  //     }));
      
  //     const filteredCampaigns = campaignsWithId.filter(
  //       c => c.isActive && c.deadline > Math.floor(Date.now() / 1000)
  //     );
  //     setCampaigns(filteredCampaigns);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function loadCampaigns() {
    try {
      if (!window.ethereum) {
        console.error("MetaMask tidak terhubung.");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, CrowdFunding.abi, signer);

      const [ids, campaignsRaw] = await contract.getActiveCampaignsWithId();

      const campaignsWithId = campaignsRaw.map((c, i) => ({
        id: ids[i].toNumber(), // ✅ ID asli dari mapping
        owner: c.owner,
        title: c.title,
        description: c.description,
        target: c.target,
        amountCollected: c.amountCollected,
        image: c.image,
        deadline: Number(c.deadline),
        isActive: c.isActive,
      }));

      setCampaigns(campaignsWithId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }


  const handleNavigate = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const formatTimeLeft = (deadline) => {
    const secondsLeft = deadline - Math.floor(Date.now() / 1000);
    if (secondsLeft <= 0) return "Campaign sudah berakhir";

    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    return `${hours}j ${minutes}m ${seconds}s tersisa`;
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
              className="text-cyan-400 font-semibold"
            >
              Seluruh Campaign
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigate("/my-campaigns")}
              className="text-white hover:text-cyan-400 transition"
            >
              Campaign Saya
            </button>
          </li>
        </ul>
      </div>

      {/* Judul dan Indikator */}
      <div className="text-center pt-20 pb-10 px-4">
        <h1 className="text-4xl font-bold tracking-tight">Daftar Penggalangan Dana</h1>
        <p className="text-gray-400 mt-2">
          Kamu sedang melihat semua campaign yang tersedia
        </p>
      </div>

      {/* Konten */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">
            Memuat data kampanye...
          </p>
        ) : campaigns.length === 0 ? (
          <p className="text-center text-gray-400">
            Belum ada penggalangan dana yang tersedia.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((item) => {
              const amountCollected = parseFloat(
                ethers.utils.formatEther(item.amountCollected)
              );
              const target = parseFloat(ethers.utils.formatEther(item.target));
              const progress = Math.min((amountCollected / target) * 100, 100);

              return (
                <div
                  key={item.id}
                  className="bg-white text-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold truncate">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mb-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Terkumpul:</span>{" "}
                        {amountCollected.toFixed(2)} ETH
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Target:</span>{" "}
                        {target.toFixed(2)} ETH
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTimeLeft(item.deadline)}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-4">
                      <div
                        className="bg-cyan-500 h-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <button
                      onClick={() => navigate(`/campaign/${item.id}`)}
                      className="mt-2 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Donasi
                    </button>
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

export default CampaignList;
