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

    enum Vote { None, Yes, No }
    mapping(address => mapping(uint256 => Vote)) public votes;

    function newProposal(address _target, bytes memory _data) external{
        Proposal memory p = Proposal(_target, _data, 0, 0);
        proposals.push(p);
    }

    function castVote(uint256 proposalId, bool supported) external {
        Vote previousVote = votes[msg.sender][proposalId];
        Vote newVote = supported ? Vote.Yes : Vote.No;

        if (previousVote == newVote) return;

        Proposal storage proposal = proposals[proposalId];

        if (previousVote == Vote.Yes) proposal.yesCount--;
        else if (previousVote == Vote.No) proposal.noCount--;

        if (newVote == Vote.Yes) proposal.yesCount++;
        else proposal.noCount++;

        votes[msg.sender][proposalId] = newVote;
    }   
}