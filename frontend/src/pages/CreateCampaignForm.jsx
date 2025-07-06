import React, { useState } from 'react';
import { ethers } from 'ethers';
import CrowdFunding from '../abis/CrowdFunding.json';
import { useNavigate } from 'react-router-dom';

const CONTRACT_ADDRESS = "0xdd9F11eb62126b0BF0e68cc5471c181E2Df194d5";

const CreateCampaignForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal: '0.05', // mulai dari 0.05
    imageUrl: '',
    days: '',
    hours: '',
    minutes: ''
  });

  // Tambahkan untuk sidebar
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [goalWarning, setGoalWarning] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'goal') {
      if (parseFloat(value) < 0.05) {
        setGoalWarning('Goal minimal 0.05 ETH');
      } else {
        setGoalWarning('');
      }
    }
    setForm({ ...form, [name]: value });
  };

  const handleNavigate = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!window.ethereum) throw new Error("MetaMask belum terpasang.");

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const { title, description, goal, imageUrl, days, hours, minutes } = form;

      if (parseFloat(goal) < 0.05) {
        setError('Goal minimal 0.05 ETH');
        setLoading(false);
        return;
      }

      if (!title || !description || !goal || !imageUrl || (!days && !hours && !minutes)) {
        throw new Error("Semua field harus diisi.");
      }

      const durationInSeconds =
        (parseInt(days || 0) * 86400) +
        (parseInt(hours || 0) * 3600) +
        (parseInt(minutes || 0) * 60);

      if (durationInSeconds <= 0) {
        throw new Error("Durasi harus lebih dari 0 menit.");
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CrowdFunding.abi, signer);
      const goalInWei = ethers.utils.parseEther(goal);

      const tx = await contract.createCampaign(
        userAddress,
        title,
        description,
        goalInWei,
        durationInSeconds,
        imageUrl
      );

      await tx.wait();
      alert("Campaign berhasil dibuat!");

      setForm({ title: '', description: '', goal: '', imageUrl: '', days: '', hours: '', minutes: '' });
      navigate('/all-campaigns');

    } catch (err) {
      console.error(err);
      setError(err.reason || err.message || "Gagal membuat campaign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
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
              className="w-48 py-2 px-4 text-white hover:text-cyan-400 transition text-center"
            >
              Seluruh Campaign
            </button>
          </li>
          <li className="flex justify-center">
            <button
              onClick={() => handleNavigate("/my-campaigns")}
              className="w-48 py-2 px-4 text-white hover:text-cyan-400 transition text-center"
            >
              Campaign Saya
            </button>
          </li>
          <li className="flex justify-center">
            <button
              onClick={() => handleNavigate("/create-campaign")}
              className="w-48 py-2 px-4 text-cyan-400 font-semibold transition text-center"
            >
              Create Campaign
            </button>
          </li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-white mb-6">Create a New Campaign</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-4 text-white">
          <span>Title</span>
          <input name="title" type="text" value={form.title} onChange={handleChange} required className="p-2 rounded-md w-full mt-1 bg-gray-700 text-white" />
        </label>

        <label className="block mb-4 text-white">
          <span>Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} required rows="4" className="p-2 rounded-md w-full mt-1 bg-gray-700 text-white" />
        </label>

        <label className="block mb-4 text-white">
          <span>Goal (ETH)</span>
          <input name="goal" type="number" step="0.01" value={form.goal} onChange={handleChange} required className="p-2 rounded-md w-full mt-1 bg-gray-700 text-white" />
        </label>

        <fieldset className="mb-4 text-white">
          <legend className="mb-1 font-medium">Duration</legend>
          <div className="flex gap-2">
            <input name="days" type="number" min="0" placeholder="Days" value={form.days} onChange={handleChange} className="p-2 rounded-md w-full bg-gray-700 text-white" />
            <input name="hours" type="number" min="0" max="23" placeholder="Hours" value={form.hours} onChange={handleChange} className="p-2 rounded-md w-full bg-gray-700 text-white" />
            <input name="minutes" type="number" min="0" max="59" placeholder="Minutes" value={form.minutes} onChange={handleChange} className="p-2 rounded-md w-full bg-gray-700 text-white" />
          </div>
        </fieldset>

        <label className="block mb-6 text-white">
          <span>Image URL (IPFS/Blob Link)</span>
          <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} required className="p-2 rounded-md w-full mt-1 bg-gray-700 text-white" />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="text-white px-6 py-3 rounded-md bg-cyan-500 hover:bg-cyan-600 w-full font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaignForm;
