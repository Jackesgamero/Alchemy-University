// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MultiSig is ReentrancyGuard {

    struct Transaction{
        address recipent;
        uint256 value;
        bool executed;
        bytes data;
    }

    address[] public owners;
    uint256 public required;

    mapping(uint256 => Transaction) public transactions;
    uint256 tx_count;

    mapping(uint256 => mapping(address => bool)) public confirmations;
    mapping(uint256 => uint256) timesConfirmed;

    modifier isOwner(){
        bool authorized;
        for(uint i = 0; i < owners.length; ++i){
            if(msg.sender == owners[i]) authorized = true;
        }
        require(authorized, "Only owners can call this function");
        _;
    }

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

    function addTransaction(address _recipent, uint256 _value, bytes memory _data) internal returns(uint256 id){
        id = tx_count;
        transactions[tx_count++] = Transaction(_recipent,_value,false,_data);
    }

    function confirmTransaction(uint256 txId) public isOwner{
        if(!confirmations[txId][msg.sender])
            timesConfirmed[txId]++;
        
        confirmations[txId][msg.sender] = true;

        if(timesConfirmed[txId] >= required)
            executeTransaction(txId);
    } 

    function getConfirmationsCount(uint256 transactionId) public view returns(uint256){
        return timesConfirmed[transactionId];
    }

    function submitTransaction(address _recipent, uint256 _value, bytes memory _data) external{
        uint256 txId = addTransaction(_recipent,_value,_data);
        confirmTransaction(txId);
    }

    function isConfirmed(uint256 txId) public view returns(bool){
        return getConfirmationsCount(txId) >= required ? true : false; 
    }

    function executeTransaction(uint256 txId) public nonReentrant{
        require(isConfirmed(txId), "Transaction is not confirmed");
        address recipent = transactions[txId].recipent;
        uint256 amount = transactions[txId].value;
        bytes memory data = transactions[txId].data;
        (bool success, ) = recipent.call{ value: amount }(data);
        require(success);
        transactions[txId].executed = true;
    }

    receive() external payable{}
    
}
