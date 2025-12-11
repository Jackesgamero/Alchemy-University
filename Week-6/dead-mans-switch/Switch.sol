// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Switch {
    address public recipent;
    address public owner;
    uint256 public lastPing;

    constructor(address _recipent) payable{
        recipent = _recipent;
        owner = msg.sender;
        lastPing = block.timestamp;
    }

    function ping() external {
        require(msg.sender == owner, "Only owner can ping");
        lastPing = block.timestamp;
    }

    function withdraw() external{
        require(block.timestamp >= lastPing + 52 weeks, "Owner is still active");
        (bool success, ) = recipent.call{ value: address(this).balance }("");
        require(success);
    }
}