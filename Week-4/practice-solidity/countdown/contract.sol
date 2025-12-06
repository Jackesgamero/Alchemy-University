// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    uint256 times = 10;

    function tick() external{
        times--;
        if (times == 0){ selfdestruct(payable(msg.sender)); }
    }
}