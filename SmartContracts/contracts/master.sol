// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Master {
    mapping(address => address[]) public employerToProjects;
    mapping(address => address[]) public freelancerToProjects;
    address[] public allemployers;
    address[] public allFreelancers;
    address[] public allProjects;
    address[] public disputeHandlers;

    
    function addProject(address _employer, address _freelancer, address _project) public {
        addProjectemployer(_employer, _project);
        addProjectFreelancer(_freelancer, _project);
        allProjects.push(_project);
    }

    function addProjectemployer(address _employer, address _project) public {
        employerToProjects[_employer].push(_project);
        if (!isemployerRegistered(_employer)) {
            allemployers.push(_employer);
        }
    }

    function addProjectFreelancer(address _freelancer, address _project) public {
        freelancerToProjects[_freelancer].push(_project);
        if (!isFreelancerRegistered(_freelancer)) {
            allFreelancers.push(_freelancer);
        }
    }

    function getProjectsByemployer(address _employer) public view returns (address[] memory) {
        return employerToProjects[_employer];
    }

    function getProjectsByFreelancer(address _freelancer) public view returns (address[] memory) {
        return freelancerToProjects[_freelancer];
    }
    
    function getAllProjects() public view returns (address[] memory) {
        return allProjects;
    }

    function isemployerRegistered(address _employer) internal view returns (bool) {
        for (uint i = 0; i < allemployers.length; i++) {
            if (allemployers[i] == _employer) {
                return true;
            }
        }
        return false;
    }

    function isFreelancerRegistered(address _freelancer) internal view returns (bool) {
        for (uint i = 0; i < allFreelancers.length; i++) {
            if (allFreelancers[i] == _freelancer) {
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
