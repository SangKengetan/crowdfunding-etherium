import React, { useState } from 'react';

const CreateCampaignForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Campaign created:', form);
    // TODO: Tambahkan logika submit ke backend/smart contract
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create a New Campaign</h2>

        <label className="block mb-4">
          <span className="text-gray-700">Title</span>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2  text-black"
            rows="4"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Goal (ETH)</span>
          <input
            name="goal"
            type="number"
            value={form.goal}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2  text-black"
            step="0.01"
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700">Image URL</span>
          <input
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2  text-black"
          />
        </label>

        <button
          type="submit"
          className="bg-cyan-500 text-white px-6 py-3 rounded-md hover:bg-cyan-600 w-full font-semibold"
        >
          Submit Campaign
        </button>
      </form>
    </div>
  );
};

export default CreateCampaignForm;
