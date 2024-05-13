import React, { useState, useEffect } from 'react';
import masterArtifact from '../contractArtifacts/Master.json';
import gigArtifact from '../contractArtifacts/Gig.json';
import { masterAddress } from '../contractArtifacts/addresses';
import { Link } from 'react-router-dom';
import './css/MyGigs.css';
const ethers = require('ethers');

const MyGigs = () => {
    const [activeTab, setActiveTab] = useState('posted');

    const [postedGigsData, setPostedGigsData] = useState([]);

    const fetchPostedGigs = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const loggedInAddress = await signer.getAddress();

        const masterabi = masterArtifact.abi;
        const masterContract = new ethers.Contract(masterAddress, masterabi, signer);
        const postedGigs = await masterContract.getProjectsByemployer(loggedInAddress);
        fetchPostedGigsData(provider, postedGigs);
    };

    const fetchPostedGigsData = async (provider, gigAddresses) => {
        const signer = provider.getSigner();
        const gigabi = gigArtifact.abi;
        const currPostedGigsData = [];
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
            currPostedGigsData.push(gigData);
        }
        setPostedGigsData(currPostedGigsData);
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchPostedGigs();
        };
        fetchData();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };


    // Dummy data for applied gigs
    const appliedGigs = [
        {
            id: 1,
            title: "Data Entry Specialist",
            description: "Aliquam convallis, turpis vel viverra tempor, nisl libero dignissim elit, eu aliquam odio dui id nibh.",
        },
        {
            id: 2,
            title: "Social Media Manager",
            description: "Ut interdum mauris id eros pulvinar, in vulputate nulla accumsan. Duis scelerisque semper ex.",
        },
        // Add more dummy data as needed
    ];

    return (
        <div className="my-gigs-container">
            <div className="tabs">
                <button
                    className={activeTab === 'posted' ? 'active' : ''}
                    onClick={() => handleTabChange('posted')}
                >
                    Posted Gigs
                </button>
                <button
                    className={activeTab === 'applied' ? 'active' : ''}
                    onClick={() => handleTabChange('applied')}
                >
                    Applied Gigs
                </button>
            </div>
            <div className="gigs-list">
                {activeTab === 'posted' && (
                    <div>
                        <h2>Posted Gigs</h2>
                        {postedGigsData.map(gig => (
                            <Link to={`/view/${gig.id}`} key={gig.id}>
                                <div className="gig-card">
                                    <h3>{gig.title}</h3>
                                    <p>{gig.description}</p>
                                    <p>{gig.metrics}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {activeTab === 'applied' && (
                    <div>
                        <h2>Applied Gigs</h2>
                        {appliedGigs.map(gig => (
                            <div key={gig.id} className="gig-card">
                                <h3>{gig.title}</h3>
                                <p>{gig.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyGigs;
