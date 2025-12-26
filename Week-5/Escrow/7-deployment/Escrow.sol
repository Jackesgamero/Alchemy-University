// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Escrow {
    address public depositor;
    address public beneficiary;
    address public arbiter;

    bool public isApproved;

    event Approved(uint balance);

    constructor(address _arbiter, address _beneficiary) payable{
        depositor = msg.sender;
        beneficiary = _beneficiary;
        arbiter = _arbiter;
    }

    function approve() external{
        require(msg.sender == arbiter, "Only arbiter can approve the transaction");
        isApproved = true;
        uint256 balance = address(this).balance;
        (bool success, ) = beneficiary.call{ value: balance }("");
        require(success, "Failed to send the funds");
        emit Approved(balance);
    }
    
}