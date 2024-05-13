import React, { useState } from 'react';
import "./css/PostGig.css";
import Owner from "../assets/Freelancer.png";
import gigArtifact from '../contractArtifacts/Gig.json';
import masterArtifact from '../contractArtifacts/Master.json';
import { masterAddress } from '../contractArtifacts/addresses';
const ethers = require('ethers');

const PostGig = () => {
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectMetrics, setProjectMetrics] = useState("");

    const deployContract = async () => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const loggedInAddress = await signer.getAddress();

        const gigabi = gigArtifact.abi;
        const gigbytecode = gigArtifact.bytecode;

        const masterabi = masterArtifact.abi;
        const masterContract = new ethers.Contract(masterAddress, masterabi, signer);


        const contract = new ethers.ContractFactory(gigabi, gigbytecode, signer);
        const tx = await contract.deploy(projectName, projectDescription, projectMetrics);
        const gigContractAddress = tx.address;
        console.log('Gig Contract Deployed at ' + gigContractAddress);

        console.log('Adding Project to Master Contract');
        // const url = 'https://rpc.sepolia-api.lisk.com';
        // const masterprovider = new ethers.JsonRpcProvider(url);
        // const privateKey = 'PRIVATE_KEY';
        // const mastersigner = new ethers.Wallet(privateKey, provider);
        const tx2 = await masterContract.addProjectemployer(loggedInAddress, gigContractAddress);
        console.log('Project Added to Master Contract');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Deploying Contract...");
        await deployContract(projectName, projectDescription, projectMetrics);
        console.log("Contract Deployed!");
    }


    return (
        <div className="post-gig-container">
            <div className="left-section">
                <img src={Owner} alt="Owner" className="right-section-image" />
            </div>
            <div className="right-section">
                <h1 className="form-heading">Post a Gig</h1>
                <form className="project-form">
                    <input
                        type="text"
                        placeholder="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                    />
                    <textarea
                        placeholder="Project Description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                    />
                    <textarea
                        placeholder="Project Metrics"
                        value={projectMetrics}
                        onChange={(e) => setProjectMetrics(e.target.value)}
                    />
                    <button className="post-button" type="submit" onClick={handleSubmit}>
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PostGig;
