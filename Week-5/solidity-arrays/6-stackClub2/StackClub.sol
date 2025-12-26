// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract StackClub {
    address[] public members;

    constructor(){
        members.push(msg.sender);
    }


    function addMember(address member) external{
        require(isMember(msg.sender), "Only members can add other members");
        members.push(member);
    } 

    function isMember(address member) public view returns(bool){
        for(uint i = 0; i < members.length; ++i){
            if(members[i] == member){
                return true;
            }
        }
        return false;
    }

    function removeLastMember() external{
        require(members.length > 0, "There are no members inside");
        require(isMember(msg.sender), "Only members can remove members");
        members.pop();
    }
}