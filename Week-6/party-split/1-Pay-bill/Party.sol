// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Party is ReentrancyGuard {

    uint256 public amount;
    mapping(address => uint256) public users;
    address[] public attendees;


    constructor(uint256 _amount){
        amount = _amount;
    }

    function rsvp() external payable{
        require(msg.value == amount, "Not enought funds to join the party");
        require(users[msg.sender] == 0, "Users can only join once");
        
        users[msg.sender] = msg.value;
        attendees.push(msg.sender);

    }

    function payBill(address venue, uint billAmount) external nonReentrant{
        require(address(this).balance >= billAmount, "Not enough funds to pay the bill");

        (bool sentVenue, ) = venue.call{value: billAmount}("");
        require(sentVenue, "Payment to venue failed");

        uint256 remaining = address(this).balance;
        uint256 n = attendees.length;
        require(n > 0, "No attendees");

        uint256 share = remaining / n;

        for (uint i = 0; i < n; ++i) {
            (bool sent, ) = attendees[i].call{value: share}("");
            require(sent, "Refund failed");
        }
    } 
	
}