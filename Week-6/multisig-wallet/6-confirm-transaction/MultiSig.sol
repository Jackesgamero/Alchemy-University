// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {

    struct Transaction{
        address recipent;
        uint256 value;
        bool executed;
    }

    address[] public owners;
    uint256 public required;

    mapping(uint256 => Transaction) public transactions;
    uint256 tx_count;

    mapping(uint256 => mapping(address => bool)) public confirmations;
    mapping(uint256 => uint256) timesConfirmed;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0, "No owner addresses were sent");
        require(_required > 0, "Number of confirmations should be greater than zero");
        require(_required <= _owners.length, "required confirmations should be less than total owner addresses"); 
        
        owners = _owners;
        required = _required;
    }

    function transactionCount() public view returns(uint256){
        return tx_count;
    }

    function addTransaction(address _recipent, uint256 _value) public returns(uint256 id){
        id = tx_count;
        transactions[tx_count++] = Transaction(_recipent,_value,false);
    }

    function confirmTransaction(uint256 txId) public{
        if(!confirmations[txId][msg.sender]){
            timesConfirmed[txId]++;
        }
        confirmations[txId][msg.sender] = true;
    } 

    function getConfirmationsCount(uint256 transactionId) public view returns(uint256){
        return timesConfirmed[transactionId];
    }
    
}
