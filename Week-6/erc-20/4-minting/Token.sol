// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Token {
    uint256 public totalSupply;
    string public name = "Spin";
    string public symbol = "SPN";
    uint8 public decimals = 18;

    mapping(address => uint256) public balances;

    constructor(){
        totalSupply = 1000 * 10 ** decimals;
        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address user) external view returns(uint256){
        return balances[user];
    }

}