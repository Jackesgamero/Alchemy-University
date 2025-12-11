// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Party {

    uint256 public amount;
    mapping(address => uint256) public users;

    constructor(uint256 _amount){
        amount = _amount;
    }

    function rsvp() external payable{
        require(msg.value == amount, "Not enought funds to join the party");
        require(users[msg.sender] == 0, "Users can only join once");
        users[msg.sender] = msg.value;
    }
	
}