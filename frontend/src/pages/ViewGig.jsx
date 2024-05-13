import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { useParams } from 'react-router-dom';
import gigArtifact from '../contractArtifacts/Gig.json';
import './css/ViewGig.css';
import freelanceGirl from "../assets/image.png";

const ViewGig = () => {
    const [fetchedProject, setFetchedProject] = useState({});
    const [loading, setLoading] = useState(true); 

    const { id: gigAddress } = useParams();

    const fetchProject = async () => {
        console.log('Fetching project...');
        const gigabi = gigArtifact.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const gigContract = new ethers.Contract(gigAddress, gigabi, signer);
        const [gigName, gigDescription, gigMetrics] = await Promise.all([
            gigContract.projectName(),
            gigContract.projectDescription(),
            gigContract.projectMetrics()
        ]);
        const gigData = {
            id: gigAddress.toString(),
            title: gigName.toString(),
            description: gigDescription.toString(),
            metrics: gigMetrics.toString(),
        };
        setFetchedProject(gigData);
        setLoading(false);
        console.log('Fetched project:', gigData);
    };

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
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewGig;
