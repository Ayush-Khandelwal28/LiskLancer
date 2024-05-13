// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Escrow {
    address public projectOwner;
    address public freelancer;
    uint256 public projectOwnerStake;
    uint256 public freelancerStake;
    bool public funds_released;
    bool public projectSubmitted;
    bool public projectOwnerStaked;
    bool public freelancerStaked;
    bool public escrowactivated;
    string public codeLink;
    string public assetsLink;
    string public comments;
    address public projectId;

    constructor(
        address _freelancer,
        uint256 _projectOwnerStake,
        address _projectId
    ) {
        projectOwner = msg.sender;
        freelancer = _freelancer;
        projectOwnerStake = _projectOwnerStake;
        projectId = _projectId;
    }

    modifier onlyProjectOwner() {
        require(
            msg.sender == projectOwner,
            "Only the project owner can perform this action."
        );
        _;
    }

    modifier onlyFreelancer() {
        require(
            msg.sender == freelancer,
            "Only the freelancer can perform this action."
        );
        _;
    }

    modifier notReleased() {
        require(!funds_released, "Funds have already been released.");
        _;
    }

    modifier projectNotSubmitted() {
        require(!projectSubmitted, "Project has already been submitted.");
        _;
    }

    

    modifier projectSubmittedCondition() {
        require(projectSubmitted, "Project has not been submitted yet.");
        _;
    }

    

    function stakeFreelancer() public onlyFreelancer notReleased {
        freelancerStake = 5 * (projectOwnerStake % 100);
    }

    function submitProject(
        string memory _codeLink,
        string memory _assetsLink,
        string memory _comments
    ) public onlyFreelancer notReleased projectNotSubmitted {
        require(bytes(_codeLink).length > 0, "Code link cannot be blank.");
        codeLink = _codeLink;
        assetsLink = _assetsLink;
        comments = _comments;
        projectSubmitted = true;
    }

    

    function releaseFunds()
        public
        projectSubmittedCondition
        notReleased
    {
        funds_released = true;
    }
}
