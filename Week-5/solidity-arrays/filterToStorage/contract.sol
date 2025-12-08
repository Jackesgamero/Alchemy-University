// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Contract {
    uint256[] public evenNumbers;

    function filterEven(uint256[] calldata array) external{
        uint256 num;
        for(uint i = 0; i < array.length; ++i){
            num = array[i];
            
            if (num % 2 == 0) {
                evenNumbers.push(num);
            }
        }
    }
}