// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {

    function double(uint x) external pure returns(uint){
        return 2*x;
    }

    function double(uint _x, uint _y) external pure returns(uint x, uint y){
        x = _x*2;
        y = _y*2;
    } 

}