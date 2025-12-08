// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Collectible {
    address public owner;
    event Deployed(address owner);
    event Transfer(address originalOwner, address newOwner);
    event ForSale(uint price, uint timestamp);

    constructor(){
        owner = msg.sender;
        emit Deployed(msg.sender);
    }

    function transfer(address recipent) external{
        require(owner != recipent, "recipent already owns the collectible");
        emit Transfer(owner, recipent);
        owner = recipent;
    }

    function markPrice(uint askingPrice) external{
        require(msg.sender == owner, "you don't own this collectible");
        emit ForSale(askingPrice,block.timestamp);
    }
    
}