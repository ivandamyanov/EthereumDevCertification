// SPDX-License-Identifier: CPL-1.0

pragma solidity 0.8.2;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }

    function getCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    address public manager;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    uint256 numRequests;
    mapping(uint256 => Request) public requests;

    uint256 public minimumContribution;

    modifier onlyManager {
        require(msg.sender == manager, "Only managers allowed!");
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(
            msg.value > minimumContribution,
            "You need more money to enter into the contribution list!"
        );
        require(!approvers[msg.sender], "You can contribute only once!");

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public onlyManager returns (uint256 requestId) {
        requestId = numRequests++;
        Request storage newRequest = requests[requestId];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.isComplete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 id) public {
        Request storage request = requests[id];

        require(approvers[msg.sender], "You need to contribute first!");
        require(
            !request.approvals[msg.sender],
            "You can't approve a request twice!"
        );

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 id) public onlyManager {
        Request storage request = requests[id];

        require(
            request.approvalCount > approversCount / 2,
            "Insufficient approvals!"
        );
        require(
            !request.isComplete,
            "This request has already been completed!"
        );
        request.isComplete = true;
        request.recipient.transfer(request.value);
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return numRequests;
    }

    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool isComplete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }
}
