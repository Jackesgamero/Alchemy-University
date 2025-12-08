// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {

    function sum(uint[5] memory array) external pure returns(uint res){
        res = array[0] + array[1] + array[2] + array[3] + array[4];
    }
}