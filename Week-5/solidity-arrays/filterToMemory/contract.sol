// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    function filterEven(uint256[] calldata array) 
        pure 
        external 
        returns (uint256[] memory) 
    {
        uint256[] memory evens = new uint256[](array.length);
        uint256 count = 0;

        for (uint256 i = 0; i < array.length; ++i) {
            uint256 num = array[i];
            if (num % 2 == 0) {
                evens[count] = num;
                count++;
            }
        }

        assembly {
            mstore(evens, count)
        }

        return evens;
    }
}