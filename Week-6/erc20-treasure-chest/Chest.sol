// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "IERC20.sol";

contract Chest {
    function plunder(address[] memory tokens) external{
        
        for(uint256 i = 0; i < tokens.length; ++i){
            IERC20 token = IERC20(tokens[i]);
            uint256 amount = token.balanceOf(address(this));
            bool success = token.transfer(msg.sender,amount);
            require(success);
        }
    }
}
