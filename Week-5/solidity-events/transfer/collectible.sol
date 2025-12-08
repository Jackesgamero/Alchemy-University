// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Collectible {
    address public owner;
    event Deployed(address owner);
    event Transfer(address originalOwner, address newOwner);

    constructor(){
        owner = msg.sender;
        emit Deployed(msg.sender);
    }

    function transfer(address recipent) external{
        require(owner != recipent, "recipent already owns the collectible");
        emit Transfer(owner, recipent);
        owner = recipent;
    }
    
}