import React from 'react';
import { useParams } from 'react-router-dom';
import Annoyed from '../assets/Annoyed.svg';
import disputeArtifacts from '../contractArtifacts/disputeHandler.json';
import masterArtifact from '../contractArtifacts/Master.json';
import { masterAddress } from '../contractArtifacts/addresses';
import '../styles/Dispute.css';
const ethers = require('ethers');

const Dispute = () => {
  const { id: projectId } = useParams();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();



  const handleRaiseIssue = async (e) => {
    e.preventDefault();
    const problemDescription = document.getElementById('problemDescription').value;
    console.log(projectId, problemDescription);
    const arbiters = ['0xe658fD80111E460D5b58FaB6fe0F18F81ee2CBe1','0xD3C15aEa275ac6A6f1eD8681Ee002150C9DF810f','0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'];
    const contract = new ethers.ContractFactory(disputeArtifacts.abi, disputeArtifacts.bytecode, signer);
    const tx = await contract.deploy(projectId, problemDescription, arbiters);
    const disputeContractAddress = tx.address;
    console.log('Dispute Contract Deployed at ' + disputeContractAddress);

    console.log('Adding Dispute to Master Contract');
    const masterContract = new ethers.Contract(masterAddress,  masterArtifact.abi, signer);
    const tx2 = await masterContract.addDisputeHandler(disputeContractAddress);
    console.log('Dispute Added to Master Contract');
  };

  return (
    <div className="raise-issue-container">
      <h1 className="raise-issue-heading">
        Did Something <span>Went </span>Wrong?
      </h1>
      <div className="raise-issue-content">
        <div className="raise-issue-left">
          <img src={Annoyed} alt="Issue Illustration" />
        </div>
        <div className="raise-issue-right">
          <h2>
            Tell <span>US</span> about it & <span> OUR</span> team will look
            <span> UPON </span> it for you
          </h2>
          <form className="raise-issue-form">
            <label htmlFor="projectName">Project ID:</label>
            <input
              type="text"
              id="projectID"
              name="projectName"
              value={projectId} // Set value from URL params
              readOnly // Make the field read-only
            />
            <label htmlFor="problemDescription">Problem Description:</label>
            <textarea
              id="problemDescription"
              name="problemDescription"
              rows="4"
            />
            <button className="raise-issue-button" onClick={handleRaiseIssue}>
              Raise Issue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dispute;
