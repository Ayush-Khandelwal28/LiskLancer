import React, { useState, useEffect } from 'react';
import './css/VoteDispute.css';
import gigArtifact from '../contractArtifacts/Gig.json';
import escrowArtifact from '../contractArtifacts/Escrow.json';
import disputeArtifact from '../contractArtifacts/disputeHandler.json';
import { useParams } from 'react-router-dom';
const ethers = require('ethers');

const VoteDispute = () => {

  const { id: disputeAddress } = useParams();

  const [disputeContract, setDisputeContract] = useState(null);
  const [gigContract, setGigContract] = useState(null);
  const [gigDetails, setGigDetails] = useState(null);
  const [gigIssue, setGigIssue] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState({});
  const [vote, setVote] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const fetchGigDetails = async () => {
      // Fetch gig details from gig contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const disputeContract = new ethers.Contract(disputeAddress, disputeArtifact.abi, signer);
      setDisputeContract(disputeContract);

      // Example: Fetching gig name and description
      const gigAddress = await disputeContract.projectId();
      const gigIssue = await disputeContract.problemDescription();
      setGigIssue(gigIssue);
      console.log(gigAddress, gigIssue);
      const gigContract = new ethers.Contract(gigAddress, gigArtifact.abi, signer);
      setGigContract(gigContract);

      const gigName = await gigContract.projectName();
      const gigDescription = await gigContract.projectDescription();
      const escrowAddress = await gigContract.escrowAddress();
      await fetchSubmissionDetails(escrowAddress);
      // Set gig details state
      setGigDetails({ name: gigName, description: gigDescription });
    };

    const fetchSubmissionDetails = async (escrowAddress) => {
      // Fetch submission details from escrow contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const escrowContract = new ethers.Contract(escrowAddress, escrowArtifact.abi, signer);

      const gigLink = await escrowContract.codeLink();
      const assetsLink = await escrowContract.assetsLink();
      const comments = await escrowContract.comments();

      setSubmissionDetails({
        gigLink: gigLink,
        assetsLink: assetsLink,
        comments: comments
      });
    };

    fetchGigDetails();
  }, [disputeAddress]);



  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Voting', vote);
    const tx = disputeContract.vote(vote);
    setVoted(true);
  };

  return (
    <div className="vote-dispute-container">
      <h2>Vote on Dispute</h2>
      {gigDetails && (
        <div className="gig-details">
          <h3>Gig Details</h3>
          <p>Name: {gigDetails.name}</p>
          <p>Description: {gigDetails.description}</p>
          <p>Issue with Subbmitted Gig : {gigIssue}</p>
        </div>
      )}
      {submissionDetails && (
        <div className="submission-details">
          <h3>Submission Details</h3>
          <p>Gig Link: {submissionDetails.gigLink}</p>
          <p>Assets Link: {submissionDetails.assetsLink}</p>
          <p>Comments: {submissionDetails.comments}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            value="for"
            checked={vote === true}
            onChange={() => setVote(true)}
          />
          Vote In Favour of Freelancer
        </label>
        <label>
          <input
            type="radio"
            value="against"
            checked={vote === false}
            onChange={() => setVote(false)}
          />
          Vote Against Freelancer
        </label>
        <button type="submit" disabled={voted}>
          {voted ? 'Voted' : 'Vote'}
        </button>
      </form>
    </div>
  );
};

export default VoteDispute;
