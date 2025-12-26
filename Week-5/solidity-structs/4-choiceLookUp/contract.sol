// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
	enum Choices { Yes, No }
	
	struct Vote {
		Choices choice;
		address voter;
	}
	
	// TODO: create a public state variable: an array of votes
	Vote[] public votes;


	function createVote(Choices choice) external {
		// TODO: add a new vote to the array of votes state variable
		votes.push(Vote(choice,msg.sender));
	}

	function findVote(address addr) private view returns(Vote memory vote){
		for(uint i = 0; i < votes.length; ++i){
			if(votes[i].voter == addr){
				vote = votes[i];
			}
		}
	}

	function hasVoted(address addr) external view returns(bool){
		return findVote(addr).voter != address(0);
	}

	function findChoice(address addr) external view returns(Choices choice){
		choice = findVote(addr).choice;
	}
}