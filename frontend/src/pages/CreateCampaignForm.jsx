import React, { useState } from 'react';
import { ethers } from 'ethers';
import CrowdFunding from '../abis/CrowdFunding.json';
import { useNavigate } from 'react-router-dom';

const CONTRACT_ADDRESS = "0x3bDdFB675A7e08C5860CB834AC03B69765c151F2";

const CreateCampaignForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal: '',
    imageUrl: '',
    days: '',
    hours: '',
    minutes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

      if (!title || !description || !goal || !imageUrl || (!days && !hours && !minutes)) {
        throw new Error("Semua field harus diisi.");
      }

      const durationInSeconds =
        (parseInt(days || 0) * 86400) +
        (parseInt(hours || 0) * 3600) +
        (parseInt(minutes || 0) * 60);

      if (durationInSeconds <= 0) {
        throw new Error("Durasi harus lebih dari 0 detik.");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-black mb-6">Create a New Campaign</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-4 text-black">
          <span>Title</span>
          <input name="title" type="text" value={form.title} onChange={handleChange} required className="border p-2 rounded-md w-full mt-1 text-black" />
        </label>

        <label className="block mb-4 text-black">
          <span>Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} required rows="4" className="border p-2 rounded-md w-full mt-1 text-black" />
        </label>

        <label className="block mb-4 text-black">
          <span>Goal (ETH)</span>
          <input name="goal" type="number" step="0.01" value={form.goal} onChange={handleChange} required className="border p-2 rounded-md w-full mt-1 text-black" />
        </label>

        <fieldset className="mb-4 text-black">
          <legend className="mb-1 font-medium">Duration</legend>
          <div className="flex gap-2">
            <input name="days" type="number" min="0" placeholder="Days" value={form.days} onChange={handleChange} className="border p-2 rounded-md w-full text-black" />
            <input name="hours" type="number" min="0" max="23" placeholder="Hours" value={form.hours} onChange={handleChange} className="border p-2 rounded-md w-full text-black" />
            <input name="minutes" type="number" min="0" max="59" placeholder="Minutes" value={form.minutes} onChange={handleChange} className="border p-2 rounded-md w-full text-black" />
          </div>
        </fieldset>

        <label className="block mb-6 text-black">
          <span>Image URL (IPFS/Blob Link)</span>
          <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} required className="border p-2 rounded-md w-full mt-1 text-black" />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-700 w-full font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaignForm;
