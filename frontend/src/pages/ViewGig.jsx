import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { Link, useParams } from 'react-router-dom';
import gigArtifact from '../contractArtifacts/Gig.json';
import masterArtifact from '../contractArtifacts/Master.json';
import escrowArtifact from '../contractArtifacts/Escrow.json';
import { masterAddress } from '../contractArtifacts/addresses';

import './css/ViewGig.css';
import freelanceGirl from "../assets/image.png";
import { encrypt, decrypt } from '../scripts/encrypt';

const ViewGig = () => {
    const [fetchedProject, setFetchedProject] = useState({});
    const [loading, setLoading] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [gigContract, setGigContract] = useState(null);
    const [isBidPlaced, setIsBidPlaced] = useState(false);
    const [isFreelancerSigned, setIsFreelancerSigned] = useState(false);
    const [isEmployerSigned, setIsEmployerSigned] = useState(false);
    // const [winner, setWinner] = useState({});
    const [isWinnerCalculated, setIsWinnerCalculated] = useState(false);
    const [bidAmount, setBidAmount] = useState('');
    const [secretKey, setSecretKey] = useState('');

    const { id: gigAddress } = useParams();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    useEffect(() => {
        const fetchUserAndProject = async () => {
            try {
                console.log('Fetching user...');
                const currUser = await signer.getAddress();
                setLoggedInUser(currUser);

                console.log('Fetching project...');
                const gigabi = gigArtifact.abi;
                const gigContract = new ethers.Contract(gigAddress, gigabi, signer);
                setGigContract(gigContract);
                const [gigName, gigDescription, gigMetrics, isBidPlaced, employer, numOfBidders, WinnerCalculated, winner, winningBid, escrowAddress] = await Promise.all([
                    gigContract.projectName(),
                    gigContract.projectDescription(),
                    gigContract.projectMetrics(),
                    gigContract.hasPlacedBid(currUser),
                    gigContract.employer(),
                    gigContract.getNumBidsPlaced(),
                    gigContract.winnerCalculated(),
                    gigContract.winner(),
                    gigContract.winningBid(),
                    gigContract.escrowAddress()
                ]);
                if (escrowAddress != '0x0000000000000000000000000000000000000000') {
                    const escrowContract = new ethers.Contract(escrowAddress, escrowArtifact.abi, signer);
                    const [isEmployerSigned, isFreelancerSigned] = await Promise.all([
                        escrowContract.projectemployerStaked(),
                        escrowContract.freelancerStaked()
                    ]);
                    setIsEmployerSigned(isEmployerSigned);
                    setIsFreelancerSigned(isFreelancerSigned);
                }
                const gigData = {
                    id: gigAddress.toString(),
                    title: gigName.toString(),
                    description: gigDescription.toString(),
                    metrics: gigMetrics.toString(),
                    isBidPlaced: isBidPlaced,
                    employer: employer,
                    numOfBidders: numOfBidders.toString(),
                    isWinnerCalculated: WinnerCalculated,
                    winner: winner,
                    winningBid: winningBid.toString(),
                    escrowAddress: escrowAddress,
                };
                console.log('Fetched project:', gigData);
                setFetchedProject(gigData);
                setIsBidPlaced(gigData.isBidPlaced);

                setLoading(false);
                console.log('Fetched project:', gigData);
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };

        fetchUserAndProject();
    }, [gigAddress]);


    // Function to handle placing a bid
    const handlePlaceBid = async () => {
        const encryptedBidAmount = encrypt(bidAmount, secretKey);
        console.log("Placing bid with encrypted amount: ", encryptedBidAmount);
        const tx = await gigContract.placeBid(encryptedBidAmount);
        setIsBidPlaced(true);
        console.log('Bid placed successfully');
    };

    // Function to handle revealing a bid
    const handleRevealBid = async () => {
        // checking if the bid is valid
        const encryptedBidPlaced = await gigContract.encryptedBids(loggedInUser);
        console.log("Encrypted bid amount placed: ", encryptedBidPlaced);
        const decryptedBidPlaced = decrypt(encryptedBidPlaced, secretKey);
        console.log("Decrypted bid amount placed: ", decryptedBidPlaced);
        if ((decryptedBidPlaced.toString()) !== (bidAmount.toString())) {
            console.error("Invalid bid amount");
            return;
        }
        else {
            console.log("Revealing bid...");
            const tx = await gigContract.revealBid(bidAmount);
            console.log('Bid revealed successfully');
            console.log("Adding project freelancer...");
            const masterabi = masterArtifact.abi;
            const masterContract = new ethers.Contract(masterAddress, masterabi, signer);
            const tx2 = await masterContract.addProjectFreelancer(loggedInUser, gigAddress);
            console.log('Project freelancer added successfully');
        }
    };

    // Function to handle computing winner
    const handleComputeWinner = async () => {
        console.log("Computing winner...");
        const tx = await gigContract.computeWinner();
        console.log('Winner computed successfully');
        const winner = await gigContract.winner();
        console.log("Winner: ", winner);
        const winningBid = await gigContract.winningBid();
        console.log("Winning bid: ", winningBid);
        // setWinner({ winner: winner, winningBid: winningBid });
    };

    // Function to sign bid as freelancer
    const signBidFreelancer = async () => {
        console.log("Signing bid as freelancer...");
        const escrowContract = new ethers.Contract(fetchedProject.escrowAddress, escrowArtifact.abi, signer);
        const tx = await escrowContract.stakeFreelancer();
        console.log('Bid signed successfully');
    };

    const signBidEmployer = async () => {
        console.log("Deploying Escrow Contract...");
        const escrowContract = new ethers.ContractFactory(escrowArtifact.abi, escrowArtifact.bytecode, signer);
        const tx = await escrowContract.deploy(winner, winningBid, gigAddress);
        const escrowContractAddress = tx.address;
        console.log('Escrow Contract Deployed at ' + escrowContractAddress);
        const tx2 = await gigContract.setEscrowAddress(escrowContractAddress);
    };

    return (
        <div className="view-gig-container">
            <div className="left-section">
                <img src={freelanceGirl} alt="freelanceGirl" className="left-section-image" />
            </div>
            <div className="right-section">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <h1 className="gig-heading">Gig Details</h1>
                        <div className="gig-details">
                            <h2>{fetchedProject.title}</h2>
                            <p>{fetchedProject.description}</p>
                            <p>{fetchedProject.metrics}</p>
                        </div>
                        <div className="bid-section">
                            {loggedInUser !== fetchedProject.employer && (
                                <>
                                    {fetchedProject.isWinnerCalculated && (
                                        <>
                                            {fetchedProject.winner === loggedInUser ? (
                                                <>
                                                    {isFreelancerSigned ? (
                                                        <>
                                                            <p>You have signed the Gig</p>
                                                            <p>Submit your work here: </p>
                                                            <Link to={`/submit/${gigAddress}`}>Submit Work</Link>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p>Congrats! You are the winner of this Gig</p>
                                                            <p>Sign and Stake : {5 * ((fetchedProject.winningBid) % 100)} to finalize the gig</p>
                                                            <Button onClick={signBidFreelancer}>Sign Gig</Button>
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <p>Sorry, you are not the winner of this Gig. Check out other Gigs to work on.</p>
                                            )}
                                        </>
                                    )}
                                    <div className="bid-input">
                                        <input
                                            type="number"
                                            placeholder="Enter your bid"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                        />
                                    </div>
                                    <div className="bid-input">
                                        <input
                                            type="text"
                                            placeholder="Enter your secret key"
                                            value={secretKey}
                                            onChange={(e) => setSecretKey(e.target.value)}
                                        />
                                    </div>
                                    {!isBidPlaced && ( // If bid is not placed
                                        <button onClick={handlePlaceBid}>Place Bid</button>
                                    )}
                                    {isBidPlaced && ( // If bid is placed
                                        <button onClick={handleRevealBid}>Reveal Bid</button>
                                    )}
                                </>
                            )}
                            {loggedInUser === fetchedProject.employer && (
                                <>
                                    {fetchedProject.isWinnerCalculated ? (
                                        <>
                                            <p>Winner: {fetchedProject.winner}</p>
                                            <p>Winning Bid: {fetchedProject.winningBid}</p>
                                            <button onClick={signBidEmployer}>Sign Gig</button>
                                        </>
                                    ) : (
                                        <>
                                            <p>Number of Valid Bidders: {fetchedProject.numOfBidders}</p>
                                            <button onClick={handleComputeWinner}>Compute Winner</button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewGig;
