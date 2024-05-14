import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Done from '../assets/Done.png';
import gigArtifacts from '../contractArtifacts/Gig.json';
import escrowArtifacts from '../contractArtifacts/Escrow.json';
import './css/SubmitWork.css';

const ethers = require('ethers');

const SubmitWork = () => {
    const { id: gigAddress } = useParams();

    const [projectLink, setProjectLink] = useState('');
    const [assets, setAssets] = useState('');
    const [note, setNote] = useState('');
    const [isGigSubmitted, setIsGigSubmitted] = useState(false);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gigContract = new ethers.Contract(gigAddress, gigArtifacts.abi, signer);

    useEffect(() => {
        const checkSubmissionStatus = async () => {
            console.log("Checking project submission status");
            try {
                const escrowAddress = await gigContract.escrowAddress();
                const escrowContract = new ethers.Contract(escrowAddress, escrowArtifacts.abi, signer);
                const isSubmitted = await escrowContract.projectSubmitted();
                setIsGigSubmitted(isSubmitted);
                console.log("Project submission status:", isSubmitted);
            } catch (error) {
                console.error("Error checking project submission status:", error);
            }
        };

        checkSubmissionStatus();
    }, []); // Empty dependency array to run only once when the component mounts

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submitting project");
        console.log(gigContract);
        const escrowAddress = await gigContract.escrowAddress();
        console.log("Escrow Address is", escrowAddress);
        const escrowContract = new ethers.Contract(escrowAddress, escrowArtifacts.abi, signer);
        console.log(escrowContract);
        const isSubmitted = await escrowContract.projectSubmitted();
        console.log(isSubmitted);
        console.log(projectLink, assets, note);
        console.log("Submitting project");
        const tx = await escrowContract.submitProject(projectLink, assets, note);
        console.log("Project submitted", tx);
    }

    return (
        <div className="post-project-container">
            {isGigSubmitted ? (<div className="success-message">Project submitted successfully!</div>) : (<div className="submit-project-right">
                <h1>
                    Done with the <span className="span-h1"> WORK ?</span>
                </h1>
                <h2>
                    Submit <span className="span-h2"> IT </span>here
                </h2>
                <form className="project-form">
                    <label htmlFor="gigId">Gig ID:</label>
                    <input
                        type="text"
                        id="gigId"
                        name="gigId"
                        value={gigAddress}
                        disabled
                    />
                    <label htmlFor="projectLink">Gig Link:</label>
                    <input
                        type="text"
                        id="projectLink"
                        name="projectLink"
                        value={projectLink}
                        onChange={(event) => setProjectLink(event.target.value)}
                        placeholder="Enter Gig link"
                    />
                    <label htmlFor="assets">Assets Link:</label>
                    <input
                        type="text"
                        id="assets"
                        name="assets"
                        value={assets}
                        onChange={(event) => setAssets(event.target.value)}
                        placeholder="Enter Assets link"
                    />
                    <label htmlFor="note">Leave a Note:</label>
                    <textarea
                        id="note"
                        name="note"
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Write your note here..."
                    />
                    <button type="submit" onClick={handleSubmit}>Submit</button>
                </form>
            </div>)}
            <div className="submit-project-left">
                <img src={Done} alt="Issue Illustration" />
            </div>
        </div>
    );
};

export default SubmitWork;
