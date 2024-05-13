import React, { useState, useEffect } from "react";
import "./css/GigsList.css";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import masterArtifact from '../contractArtifacts/Master.json';
import gigArtifact from '../contractArtifacts/Gig.json';
import { masterAddress } from '../contractArtifacts/addresses';

const GigsList = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const masterContract = new ethers.Contract(masterAddress, masterArtifact.abi, signer);
                const gigAddresses = await masterContract.getAllProjects(); // Adjust method name according to your contract

                const gigabi = gigArtifact.abi;
                const currGigs = [];
                for (let i = 0; i < gigAddresses.length; i++) {
                    const gigAddress = gigAddresses[i];
                    const gigContract = new ethers.Contract(gigAddress, gigabi, signer);
                    const [gigName, gigDescription, gigMetrics] = await Promise.all([
                        gigContract.projectName(),
                        gigContract.projectDescription(),
                        gigContract.projectMetrics()
                    ]);
                    const gigData = {
                        id: gigAddress,
                        title: gigName,
                        description: gigDescription,
                        metrics: gigMetrics,
                    };
                    currGigs.push(gigData);
                }

                setGigs(currGigs);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching gigs:", error);
            }
        };

        fetchGigs();
    }, []);

    return (
        <div id="recently-posted" className="recently-posted-container">
            <div className="recently-posted-header">
                <div className="heading-text">
                    <h1>
                        Recently Posted
                        <span>Works</span>
                    </h1>
                </div>
            </div>
            <div className="card-container">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    gigs.map((project) => (
                        <div className="card" key={project.id}>
                            <div className="card-content">
                                <h3 className="card-title">{project.title}</h3>
                                <p className="card-description">{project.description}</p>
                                <p className="card-metrics">{project.metrics}</p>
                                <Link to={`/view/${project.id}`} className="recent-post-button">
                                    View Gig
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GigsList;
