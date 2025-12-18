// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Voting {
    struct Proposal {
        address target;
        bytes data;
        uint yesCount;
        uint noCount;
    }

    Proposal[] public proposals;

    function newProposal(address _target, bytes memory _data) external{
        Proposal memory p = Proposal(_target, _data, 0, 0);
        proposals.push(p);
    }

    function castVote(uint256 proposalId, bool supported) external{
        if(supported){
            proposals[proposalId].yesCount++;
        } else proposals[proposalId].noCount++;

    }
    
}
