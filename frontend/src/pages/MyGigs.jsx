import React, { useState } from 'react';
import './css/MyGigs.css';

const MyGigs = () => {
    const [activeTab, setActiveTab] = useState('posted'); // State to track active tab

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Dummy data for posted gigs
    const postedGigs = [
        {
            id: 1,
            title: "Web Developer",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec eros vitae est luctus finibus.",
        },
        {
            id: 2,
            title: "Graphic Designer",
            description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        },
        // Add more dummy data as needed
    ];

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
                        {postedGigs.map(gig => (
                            <div key={gig.id} className="gig-card">
                                <h3>{gig.title}</h3>
                                <p>{gig.description}</p>
                            </div>
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
