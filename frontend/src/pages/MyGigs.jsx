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
    const [appliedGigsData, setAppliedGigsData] = useState([]);

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

    // /////////////////////////
    const fetchAppliedGigs = async () => {
        console.log("fetching applied gigs")
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const loggedInAddress = await signer.getAddress();

        const masterabi = masterArtifact.abi;
        const masterContract = new ethers.Contract(masterAddress, masterabi, signer);
        const AppliedGigs = await masterContract.getProjectsByFreelancer(loggedInAddress);
        console.log(AppliedGigs);
        fetchAppliedGigsData(provider, AppliedGigs);
    };

    const fetchAppliedGigsData = async (provider, gigAddresses) => {
        console.log("fetching applied gigs data")
        const signer = provider.getSigner();
        const gigabi = gigArtifact.abi;
        const currAppliedGigsData = [];
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
            currAppliedGigsData.push(gigData);
        }
        console.log(currAppliedGigsData);
        setAppliedGigsData(currAppliedGigsData);
    };
    // /////////////////////////

    useEffect(() => {
        const fetchData = async () => {
            await fetchPostedGigs();
            await fetchAppliedGigs();
        };
        fetchData();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

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
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {activeTab === 'applied' && (
                    <div>
                        <h2>Applied Gigs</h2>
                        {appliedGigsData.map(gig => (
                            <Link to={`/view/${gig.id}`} key={gig.id}>
                                <div className="gig-card">
                                    <h3>{gig.title}</h3>
                                    <p>{gig.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyGigs;
