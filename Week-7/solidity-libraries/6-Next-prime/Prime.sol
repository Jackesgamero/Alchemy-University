// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library Prime {

    function dividesEvenly(uint256 x, uint256 y) public pure returns(bool){
        require(y > 0, "Division by zero");
        return x % y == 0;
    }

    function isPrime(uint256 n) public pure returns (bool) {
        if (n < 2) return false;
        if (n == 2) return true;
        if (n % 2 == 0) return false;
        
        for (uint256 i = 3; i * i <= n; i += 2) {
            if (dividesEvenly(n, i)) {
                return false;
            }
        }
        return true;
    }
}
