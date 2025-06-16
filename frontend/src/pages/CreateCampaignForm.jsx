

import React, { useState } from 'react';
import { ethers } from 'ethers';
import CrowdFunding from '../abis/CrowdFunding.json';

// Ganti dengan alamat kontrak hasil deploy Ganache
const CONTRACT_ADDRESS = "0x4BADc658CB702EEfcA9D31dbBDD8585eAD257693";

const CreateCampaignForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal: '',
    imageUrl: ''
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

    // Ambil alamat langsung dari MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const userAddress = accounts[0];

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Validasi data
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.goal.trim() ||
      !form.imageUrl.trim()
    ) throw new Error("Semua field harus diisi.");

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CrowdFunding.abi, signer);
    const goalInWei = ethers.utils.parseEther(form.goal);

    console.log("=== Submit Campaign ===");
    console.log("Address:", userAddress);
    console.log("Title:", form.title);
    console.log("Desc:", form.description);
    console.log("Goal:", form.goal);
    console.log("Image:", form.imageUrl);

    const tx = await contract.createCampaign(
      userAddress,                           // ⛔ Hindari signer.getAddress()
      String(form.title),
      String(form.description),
      goalInWei,
      String(form.imageUrl)
    );

    await tx.wait();

    alert("Campaign berhasil dibuat!");
    setForm({ title: '', description: '', goal: '', imageUrl: '' });

  } catch (err) {
    console.error("Error:", err);
    setError(err.reason || err.message || "Gagal membuat campaign.");
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full"
      >
        <h2 className="text-2xl font-semibold mb-6">Create a New Campaign</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-4">
          <span>Title</span>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            disabled={loading}
            required
            className="border p-2 rounded-md w-full mt-1 text-black"
          />
        </label>

        <label className="block mb-4">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
            required
            className="border p-2 rounded-md w-full mt-1 text-black"
            rows="4"
          ></textarea>
        </label>

        <label className="block mb-4">
          <span>Goal (ETH)</span>
          <input
            name="goal"
            type="number"
            step="0.01"
            value={form.goal}
            onChange={handleChange}
            disabled={loading}
            required
            className="border p-2 rounded-md w-full mt-1 text-black"
          />
        </label>

        <label className="block mb-6">
          <span>Image URL</span>
          <input
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            disabled={loading}
            required
            className="border p-2 rounded-md w-full mt-1 text-black"
          />
        </label>

        <button
          disabled={loading}
          type="submit"
          className="bg-cyan-500 text-white px-6 py-3 rounded-md hover:bg-cyan-600 w-full font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaignForm;
