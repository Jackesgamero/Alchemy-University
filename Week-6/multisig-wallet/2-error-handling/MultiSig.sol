// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {

    address[] public owners;
    uint256 public required;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0, "No owner addresses were sent");
        require(_required > 0, "Number of confirmations should be greater than zero");
        require(_required <= _owners.length, "required confirmations should be less than total owner addresses"); 
        
        owners = _owners;
        required = _required;
    }
    
}
