//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Middle {
    address winner = 0xde40DDc9e0E0F72f3136bfe61b67d2C193C2Fd04;

    function callWinner() external {
        (bool success, ) = winner.call(
            abi.encodeWithSignature("attempt()")
        );
        require(success);
    }

}