// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Master {
    mapping(address => address[]) public ownerToProjects;
    
    address[] public allOwners;
    address[] public allProjects;
    address[] public disputeHandlers;

    function addProject(address _owner, address _project) public {
        ownerToProjects[_owner].push(_project);
        allProjects.push(_project);
        if (!isOwnerRegistered(_owner)) {
            allOwners.push(_owner);
        }
    }

    function getProjectsByOwner(address _owner) public view returns (address[] memory) {
        return ownerToProjects[_owner];
    }
    
    function getAllProjects() public view returns (address[] memory) {
        return allProjects;
    }

    function isOwnerRegistered(address _owner) internal view returns (bool) {
        for (uint i = 0; i < allOwners.length; i++) {
            if (allOwners[i] == _owner) {
                return true;
            }
        }
        return false;
    }

    function addDisputeHandler(address _disputeHandler) public {
        disputeHandlers.push(_disputeHandler);
    }

    function getDisputeHandlers() public view returns (address[] memory) {
        return disputeHandlers;
    }
}
