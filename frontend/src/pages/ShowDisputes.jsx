import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import masterArtifact from '../contractArtifacts/Master.json';
import disputeArtifact from '../contractArtifacts/disputeHandler.json';
import { masterAddress } from '../contractArtifacts/addresses';
import './css/ShowDisputes.css';
const ethers = require('ethers');

const ShowDisputes = () => {
    const [disputeAddresses, setDisputeAddresses] = useState([]);
    const [disputesData, setDisputesData] = useState([]);

    useEffect(() => {
        const fetchDisputeAddresses = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const masterabi = masterArtifact.abi;
            const masterContract = new ethers.Contract(masterAddress, masterabi, signer);
            const disputes = await masterContract.getDisputeHandlers();

            setDisputeAddresses(disputes);
        };

        fetchDisputeAddresses();
    }, []);

    useEffect(() => {
        const fetchDisputesData = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const disputeabi = disputeArtifact.abi;

            const currDisputesData = [];
            for (let i = 0; i < disputeAddresses.length; i++) {
                const disputeAddress = disputeAddresses[i];
                const disputeContract = new ethers.Contract(disputeAddress, disputeabi, signer);

                const projectId = await disputeContract.projectId();
                const problemDescription = await disputeContract.problemDescription();

                const disputeData = {
                    id: disputeAddress,
                    projectId: projectId,
                    description: problemDescription,
                };

                currDisputesData.push(disputeData);
            }

            setDisputesData(currDisputesData);
        };

        fetchDisputesData();
    }, [disputeAddresses]);

    return (
        <div className="disputes-container">
            <h2>Disputes</h2>
            <div className="disputes-list">
                {disputesData.map(dispute => (
                    <div className="dispute-card" key={dispute.id}>
                        <h3>Project ID: {dispute.projectId}</h3>
                        <p>Description: {dispute.description}</p>
                        <Link to={`/VoteDispute/${dispute.id}`}>View Details</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowDisputes;
