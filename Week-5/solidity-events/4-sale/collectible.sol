// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Collectible {
    address public owner;
    uint public askingPrice;
    event Deployed(address owner);
    event Transfer(address originalOwner, address newOwner);
    event ForSale(uint price, uint timestamp);
    event Purchase(uint amount, address buyer);

    constructor(){
        owner = msg.sender;
        emit Deployed(msg.sender);
    }

    function transfer(address recipent) external{
        require(owner != recipent, "recipent already owns the collectible");
        emit Transfer(owner, recipent);
        owner = recipent;
    }

    function markPrice(uint _askingPrice) external{
        require(msg.sender == owner, "you don't own this collectible");
        askingPrice = _askingPrice;
        emit ForSale(_askingPrice,block.timestamp);
    }

    function purchase() external payable{
        require(owner != msg.sender, "You already own this collectible");
        require(askingPrice > 0, "This collectible is not for sale");
        require(askingPrice == msg.value, "Not enought funds!");
        
        address prevOwner = owner;
        owner = msg.sender;

        emit Purchase(askingPrice, msg.sender);
        askingPrice = 0;

        //Check-effects pattern
        (bool success, ) = prevOwner.call{value: msg.value}("");
        require(success);
    }
    
}