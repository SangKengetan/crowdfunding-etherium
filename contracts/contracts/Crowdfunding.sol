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
        uint256 deadline;
        bool isActive; // Digunakan hanya jika ingin membatalkan campaign manual
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    event CampaignCreated(uint256 indexed id, address indexed owner);
    event DonationReceived(uint256 indexed id, address indexed donor, uint256 amount);
    event WithdrawalMade(uint256 indexed id, address indexed owner, uint256 amount);
    event CampaignCancelled(uint256 indexed id);

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _durationInSeconds,
        string memory _image
    ) public returns (uint256) {
        require(_owner != address(0), "Owner invalid.");
        require(_target > 0, "Target must be greater than 0.");
        require(_durationInSeconds > 0, "Duration must be greater than 0.");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.deadline = block.timestamp + _durationInSeconds;
        campaign.isActive = true;

        emit CampaignCreated(numberOfCampaigns, _owner);

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        require(_id < numberOfCampaigns, "Campaign not found.");
        Campaign storage campaign = campaigns[_id];
        require(campaign.isActive, "Campaign is not active.");
        require(block.timestamp < campaign.deadline, "Campaign has ended.");
        require(msg.value > 0, "Donation must be greater than zero.");

        campaign.amountCollected += msg.value;
        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);

        emit DonationReceived(_id, msg.sender, msg.value);
    }

    function withdraw(uint256 _id, uint256 _amount) external {
        require(_id < numberOfCampaigns, "Campaign not found.");
        Campaign storage campaign = campaigns[_id];

        require(msg.sender == campaign.owner, "Not owner.");

        bool deadlineReached = block.timestamp >= campaign.deadline;
        bool goalReached = campaign.amountCollected >= campaign.target;

        require(deadlineReached || goalReached, "Cannot withdraw before target met or deadline reached.");
        require(_amount <= campaign.amountCollected, "Not enough balance.");

        payable(campaign.owner).transfer(_amount);
        campaign.amountCollected -= _amount;

        emit WithdrawalMade(_id, msg.sender, _amount);
    }

    function cancelCampaign(uint256 _id) external {
        require(_id < numberOfCampaigns, "Campaign not found.");
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Not owner.");
        require(campaign.isActive, "Campaign already cancelled.");

        campaign.isActive = false;

        emit CampaignCancelled(_id);
    }

    function getDonators(uint256 _id)
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        require(_id < numberOfCampaigns, "Campaign not found.");
        Campaign storage campaign = campaigns[_id];
        return (campaign.donators, campaign.donations);
    }

    function getCampaigns()
        public
        view
        returns (Campaign[] memory)
    {
        uint256 count = 0;

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage c = campaigns[i];
            if (block.timestamp <= c.deadline && c.isActive) {
                count++;
            }
        }

        Campaign[] memory activeCampaigns = new Campaign[](count);
        uint256 j = 0;

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage c = campaigns[i];
            if (block.timestamp <= c.deadline && c.isActive) {
                activeCampaigns[j] = c;
                j++;
            }
        }

        return activeCampaigns;
    }

    function getActiveCampaignsWithId()
        public
        view
        returns (uint256[] memory, Campaign[] memory)
    {
        uint256 count = 0;

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage c = campaigns[i];
            if (block.timestamp <= c.deadline && c.isActive) {
                count++;
            }
        }

        Campaign[] memory activeCampaigns = new Campaign[](count);
        uint256[] memory ids = new uint256[](count);
        uint256 j = 0;

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage c = campaigns[i];
            if (block.timestamp <= c.deadline && c.isActive) {
                activeCampaigns[j] = c;
                ids[j] = i;
                j++;
            }
        }

        return (ids, activeCampaigns);
    }

    function getCampaignById(uint256 _id)
        public
        view
        returns (Campaign memory)
    {
        require(_id < numberOfCampaigns, "Campaign not found.");
        return campaigns[_id];
    }

    function getMyCampaigns(address _user)
        public
        view
        returns (uint256[] memory, Campaign[] memory)
    {
        uint256 count = 0;

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            if (campaigns[i].owner == _user) {
                count++;
            }
        }

        Campaign[] memory myCampaigns = new Campaign[](count);
        uint256[] memory ids = new uint256[](count);
        uint256 j = 0;

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            if (campaigns[i].owner == _user) {
                myCampaigns[j] = campaigns[i];
                ids[j] = i;
                j++;
            }
        }

        return (ids, myCampaigns);
    }
}
