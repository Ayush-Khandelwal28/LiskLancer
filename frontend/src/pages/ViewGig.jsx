import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { useParams } from 'react-router-dom';
import './css/ViewGig.css';
import freelanceGirl from "../assets/image.png";

const ViewGig = () => {
    const [fetchedProject, setFetchedProject] = useState({});
    const [loading, setLoading] = useState(true); // State to track loading status

    const { gigAddress } = useParams();

    // Contract ABI, address, and provider setup
    const abi = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_projectName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_projectDescription",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_projectMetrics",
                    "type": "string"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "bidder",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "bidAmount",
                    "type": "uint256"
                }
            ],
            "name": "BidPlaced",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "bidder",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "int256",
                    "name": "bidAmount",
                    "type": "int256"
                }
            ],
            "name": "BidRevealed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [],
            "name": "BiddingPaused",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [],
            "name": "BiddingResumed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "winner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "int256",
                    "name": "winningBid",
                    "type": "int256"
                }
            ],
            "name": "WinnerComputed",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "biddingPaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "bids",
            "outputs": [
                {
                    "internalType": "int256",
                    "name": "",
                    "type": "int256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "computeWinner",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "encryptedBids",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "escrowAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getNumBidsPlaced",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "bidder",
                    "type": "address"
                }
            ],
            "name": "hasPlacedBid",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "pauseBidding",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "encryptedBid",
                    "type": "string"
                }
            ],
            "name": "placeBid",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "projectDescription",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "projectMetrics",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "projectName",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "resumeBidding",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "int256",
                    "name": "bidAmount",
                    "type": "int256"
                }
            ],
            "name": "revealBid",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_escrowAddress",
                    "type": "address"
                }
            ],
            "name": "setEscrowAddress",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "winner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "winnerCalculated",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "winningBid",
            "outputs": [
                {
                    "internalType": "int256",
                    "name": "",
                    "type": "int256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const address = '0xb26Ca415FD5eae5f5A09cA73e75c16c01Df95459';
    const url = 'https://rpc.sepolia-api.lisk.com';
    const provider = new ethers.providers.JsonRpcProvider(url);
    const contract = new ethers.Contract(address, abi, provider);

    // Fetch project details
    const fetchProject = async () => {
        try {
            const projectName = await contract.projectName();
            const projectDescription = await contract.projectDescription();
            const projectMetrics = await contract.projectMetrics();
            setFetchedProject({
                projectName,
                projectDescription,
                projectMetrics
            });
            setLoading(false); // Set loading to false when data is fetched
        } catch (error) {
            console.error('Error fetching project:', error);
            setLoading(false); // Set loading to false even if there's an error
        }
    }

    useEffect(() => {
        fetchProject();
    }, [gigAddress]);

    useEffect(() => {
        console.log('ID:', gigAddress);
    }, [gigAddress]);

    return (
        <div className="view-gig-container">
            <div className="left-section">
                <img src={freelanceGirl} alt="freelanceGirl" className="left-section-image" />
            </div>
            <div className="right-section">
                {loading ? ( // Display loading indicator if data is being fetched
                    <p>Loading...</p>
                ) : (
                    <>
                        <h1 className="gig-heading">Gig Details</h1>
                        <div className="gig-details">
                            <h2>{fetchedProject.projectName}</h2>
                            <p>{fetchedProject.projectDescription}</p>
                            <p>{fetchedProject.projectMetrics}</p>
                            {/* Additional gig details can be displayed here */}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewGig;
