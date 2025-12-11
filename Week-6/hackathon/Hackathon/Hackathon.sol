// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Hackathon {
    struct Project {
        string title;
        uint[] ratings;
    }
    
    Project[] projects;

    // TODO: add the findWinner function
    function findWinner() external view returns(Project memory project){
        uint256 n = projects.length;
        uint256 max = 0;

        for(uint i = 0; i < n; ++i){
            Project memory p = projects[i];
            uint256 m = p.ratings.length; 
            uint256 sum = 0; 

            for(uint j = 0; j < m; ++j){
                sum += p.ratings[j];
            }


            if(sum/m > max){
                project = p;
                max = sum/m;
            }
        }
    }

    function newProject(string calldata _title) external {
        // creates a new project with a title and an empty ratings array
        projects.push(Project(_title, new uint[](0)));
    }

    function rate(uint _idx, uint _rating) external {
        // rates a project by its index
        projects[_idx].ratings.push(_rating);
    }
}
