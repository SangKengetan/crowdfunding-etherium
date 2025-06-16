// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    // Membuat campaign
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        string memory _image
    ) public returns (uint256) {
        require(_owner != address(0), "Owner invalid.");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    // Menerima donasi
    function donateToCampaign(uint256 _id) public payable {
        require(_id < numberOfCampaigns, "Campaign not found.");
        require(msg.value > 0, "Donation must be greater than zero.");

        Campaign storage campaign = campaigns[_id];
        campaign.amountCollected += msg.value;

        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
    }

    // Penarikan dana oleh owner
    function withdraw(uint256 _id, uint256 _amount) external {
        require(_id < numberOfCampaigns, "Campaign not found.");
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Not owner.");
        require(_amount <= campaign.amountCollected, "Not enough balance.");

        payable(campaign.owner).transfer(_amount);
        campaign.amountCollected -= _amount;
    }

    // Mengambil daftar donor per-campaign
    function getDonators(uint256 _id)
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        require(_id < numberOfCampaigns, "Campaign not found.");

        Campaign storage campaign = campaigns[_id];
        return (campaign.donators, campaign.donations);
    }

    // Mengambil daftar campaign
    function getCampaigns()
        public
        view
        returns (Campaign[] memory)
    {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }

        return allCampaigns;
    }
}
