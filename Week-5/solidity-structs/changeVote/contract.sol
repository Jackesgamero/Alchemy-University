// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
	enum Choices { Yes, No }
	
	struct Vote {
		Choices choice;
		address voter;
	}
	
	Vote[] public votes;


	function createVote(Choices choice) external {
		require(!hasVoted(msg.sender), "Each address is only allowed to vote once");
		votes.push(Vote(choice,msg.sender));
	}

	function findVote(address addr) private view returns(Vote memory vote){
		for(uint i = 0; i < votes.length; ++i){
			if(votes[i].voter == addr){
				vote = votes[i];
			}
		}
	}

	function hasVoted(address addr) public view returns(bool){
		return findVote(addr).voter != address(0);
	}

	function findChoice(address addr) external view returns(Choices choice){
		choice = findVote(addr).choice;
	}

	function changeVote(Choices choice) external{
		bool exist;
		for(uint i = 0; i < votes.length; ++i){
			if(votes[i].voter == msg.sender){
				votes[i].choice = choice;
				exist = true;
			}
		}
		require(exist, "This address hasn't voted yet");
	}
}