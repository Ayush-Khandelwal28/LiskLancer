import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { useParams } from 'react-router-dom';
import gigArtifact from '../contractArtifacts/Gig.json';
import masterArtifact from '../contractArtifacts/Master.json';
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
                const [gigName, gigDescription, gigMetrics, isBidPlaced, employer, numOfBidders] = await Promise.all([
                    gigContract.projectName(),
                    gigContract.projectDescription(),
                    gigContract.projectMetrics(),
                    gigContract.hasPlacedBid(currUser),
                    gigContract.employer(),
                    gigContract.getNumBidsPlaced(),
                ]);
                const gigData = {
                    id: gigAddress.toString(),
                    title: gigName.toString(),
                    description: gigDescription.toString(),
                    metrics: gigMetrics.toString(),
                    isBidPlaced: isBidPlaced,
                    employer: employer,
                    numOfBidders: numOfBidders.toString(),
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
                                <p>Number of Valid Bidders: {fetchedProject.numOfBidders} </p>
                                <button /* onClick={handleComputeWinner}*/ >Compute Winner</button>
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
