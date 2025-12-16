// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library Prime {

    function dividesEvenly(uint256 x, uint256 y) public pure returns(bool){
        require(y > 0, "Division by zero");
        return x % y == 0;
    }
    
}