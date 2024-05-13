// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Gig {
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier biddingActive() {
        require(biddingPaused == false, "Bidding is currently paused");
        _;
    }

    address public owner;
    address public winner;
    int public winningBid;
    string public projectName;
    string public projectDescription;
    string public projectMetrics;
    mapping(address => string) public encryptedBids;
    mapping(address => int) public bids;
    address[] bidders;
    bool public biddingPaused;
    bool public winnerCalculated;
    address public escrowAddress;

    // Events
    event BidPlaced(address bidder, uint bidAmount);
    event WinnerComputed(address winner, int winningBid);
    event BidRevealed(address bidder, int bidAmount);
    event BiddingPaused();
    event BiddingResumed();

    // Constants
    uint constant MIN_NUM_BIDDERS = 3;

    // Constructor
    constructor(
        string memory _projectName,
        string memory _projectDescription,
        string memory _projectMetrics
    ) {
        require(
            bytes(_projectName).length >= 4,
            "Project name must be of length at least 4"
        );
        require(
            bytes(_projectDescription).length >= 20,
            "Project description must be of length at least 20"
        );
        require(
            bytes(_projectMetrics).length >= 30,
            "Project metrics must be of length at least 30"
        );
        owner = msg.sender;
        projectName = _projectName;
        projectDescription = _projectDescription;
        projectMetrics = _projectMetrics;
        biddingPaused = false;
        winnerCalculated = false;
    }

    // Function to place bid
    function placeBid(string memory encryptedBid) public payable biddingActive {
        encryptedBids[msg.sender] = encryptedBid;

        emit BidPlaced(msg.sender, msg.value);
    }

    // Function to reveal bid
    function revealBid(int bidAmount) public biddingActive {
        bids[msg.sender] = bidAmount;
        bidders.push(msg.sender);
        emit BidRevealed(msg.sender, bidAmount);
    }

    // Function to compute winner
    function computeWinner() public onlyOwner {
        // require(
        //     bidders.length >= MIN_NUM_BIDDERS,
        //     "At least 3 bidders required"
        // );

        // Initialize minimum bid to the maximum possible value
        int minimumBid = type(int).max;
        address minimumBidder;

        // Iterate through bidders to find the minimum bid and bidder
        for (uint i = 0; i < bidders.length; i++) {
            address bidder = bidders[i];
            int bidAmount = bids[bidder];
            if (bidAmount < minimumBid) {
                minimumBid = bidAmount;
                minimumBidder = bidder;
            }
        }

        // Update the result
        winner = minimumBidder;
        winningBid = minimumBid;
        winnerCalculated = true;
        emit WinnerComputed(minimumBidder, minimumBid);
    }

    // Function to pause bidding
    function pauseBidding() public onlyOwner {
        require(biddingPaused == false, "Bidding is already paused");
        biddingPaused = true;
        emit BiddingPaused();
    }

    // Function to resume bidding
    function resumeBidding() public onlyOwner {
        require(biddingPaused == true, "Bidding is not paused");
        biddingPaused = false;
        emit BiddingResumed();
    }

    function getNumBidsPlaced() public view returns (uint) {
        return bidders.length;
    }

    function hasPlacedBid(address bidder) public view returns (bool) {
        return bytes(encryptedBids[bidder]).length > 0;
    }

    function setEscrowAddress(address _escrowAddress) public onlyOwner {
        escrowAddress = _escrowAddress;
    }
}
