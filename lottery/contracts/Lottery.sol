// SPDX-License-Identifier: CPL-1.0

pragma solidity 0.8.0;

contract Lottery {
    address public manager;
    address[] public players;
    
    constructor() {
        manager = msg.sender;
    }
    
    modifier onlyManager {
        require(msg.sender == manager, "You are not a manager, my son!");
        _;
    }
    
    function enter() public payable {
        require(msg.value > 0.01 ether, "Minimum amount of 0.01 eth required");
        players.push(msg.sender);
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
    
    function pickWinner() public onlyManager {
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
    }
    
    function getPlayers() public view returns(address[] memory){
        return players;
    }
}