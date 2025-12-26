// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Contract {
    function sum(uint[] calldata array) external pure returns(uint res){
        for(uint i = 0; i < array.length; ++i){
            res += array[i];
        }
    }
    
}