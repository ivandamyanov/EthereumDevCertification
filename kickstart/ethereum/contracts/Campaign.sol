// SPDX-License-Identifier: CPL-1.0

pragma solidity 0.8.1;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
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
    uint public approversCount;
    uint numRequests;
    mapping(uint => Request) public requests;
    
    uint public minimumContribution;

    modifier onlyManager {
        require(msg.sender == manager, "Only managers allowed!");
        _;
    }
    
    constructor(uint minimum, address creator){
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution, "You need more money to enter into the contribution list!");
        require(!approvers[msg.sender], "You can contribute only once!");
        
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string memory description, uint value, address payable recipient) public onlyManager returns (uint requestId) {
        requestId = numRequests++;
        Request storage newRequest = requests[requestId];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.isComplete = false;
        newRequest.approvalCount = 0;
    }
    
    function approveRequest(uint id) public {
        Request storage request = requests[id];

        require(approvers[msg.sender], "You need to contribute first!");
        require(!request.approvals[msg.sender], "You can't approve a request twice!");
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint id) public onlyManager {
        Request storage request = requests[id];
        
        require(request.approvalCount > approversCount / 2, "Insufficient approvals!");
        require(!request.isComplete, "This request has already been completed!");
        request.isComplete = true;
        request.recipient.transfer(request.value);
    }
    
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool isComplete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
}