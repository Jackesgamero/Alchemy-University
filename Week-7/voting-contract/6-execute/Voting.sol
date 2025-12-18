// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Voting {
    struct Proposal {
        address target;
        bytes data;
        uint yesCount;
        uint noCount;
        bool executed;
    }

    Proposal[] public proposals;

    enum Vote { None, Yes, No }
    mapping(address => mapping(uint256 => Vote)) public votes;
    mapping(address => bool) participants;

    event ProposalCreated(uint256 proposalID);
    event VoteCast(uint256 proposalID, address voter);

    constructor(address[] memory _participants){  
        participants[msg.sender] = true;
        for(uint i = 0; i < _participants.length; ++i){
            participants[_participants[i]] = true;
        }  
    }

    function newProposal(address _target, bytes memory _data) external{
        require(participants[msg.sender], "Only participants are allowed to create proposals");

        Proposal memory p = Proposal(_target, _data, 0, 0, false);
        emit ProposalCreated(proposals.length);
        proposals.push(p);
    }

    function castVote(uint256 proposalId, bool supported) external {
        require(participants[msg.sender], "Only participants are allowed to cast votes");

        Vote previousVote = votes[msg.sender][proposalId];
        Vote newVote = supported ? Vote.Yes : Vote.No;
        emit VoteCast(proposalId,msg.sender);

        if (previousVote == newVote) return;

        Proposal storage proposal = proposals[proposalId];

        if (previousVote == Vote.Yes) proposal.yesCount--;
        else if (previousVote == Vote.No) proposal.noCount--;

        if (newVote == Vote.Yes) proposal.yesCount++;
        else proposal.noCount++;

        votes[msg.sender][proposalId] = newVote;

        if(proposal.yesCount == 10 && !proposal.executed){
            (bool success, ) = proposal.target.call(proposal.data);
            require(success, "Failed to execute the proposal");
        }
    }   

}