// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
	struct User {
		uint balance;
		bool isActive;
	}

	mapping(address => User) public users;

	function createUser() external{
		require(!users[msg.sender].isActive, "user is already registered");
		users[msg.sender].balance = 100;
		users[msg.sender].isActive = true;
	}

	function transfer(address recipent, uint amount) external{
		require(users[msg.sender].isActive,"msg.sender is not an active user");
		require(users[recipent].isActive,"recipent is not an active user");
		require(users[msg.sender].balance >= amount, "msg.sender has not enought funds!");

		users[msg.sender].balance -= amount;
		users[recipent].balance += amount;
	}

}