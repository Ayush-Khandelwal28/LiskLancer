import React from "react";
import "./css/GigsList.css";
import { Link } from "react-router-dom";
// Import any necessary modules or libraries

const GigsList = () => {
    // Dummy data array
    const dummyData = [
        {
            id: 1,
            name: "Project 1",
            description: "Description for Project 1",
            metrics: "Metrics for Project 1",
            isBidPlaced: false
        },
        {
            id: 2,
            name: "Project 2",
            description: "Description for Project 2",
            metrics: "Metrics for Project 2",
            isBidPlaced: true
        },
        {
            id: 3,
            name: "Project 3",
            description: "Description for Project 3",
            metrics: "Metrics for Project 3",
            isBidPlaced: false
        },
        // Add more dummy data objects as needed
        {
            id: 4,
            name: "Project 4",
            description: "Description for Project 4",
            metrics: "Metrics for Project 4",
            isBidPlaced: false
        },
        // Add more dummy data objects as needed
        {
            id: 5,
            name: "Project 5",
            description: "Description for Project 5",
            metrics: "Metrics for Project 5",
            isBidPlaced: false
        },
        // Add more dummy data objects as needed
    ];

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
                {dummyData.map((project) => (
                    <div className="card" key={project.id}>
                        <div className="card-content">
                            <h3 className="card-title">{project.name}</h3>
                            <p className="card-description">{project.description}</p>
                            <p className="card-metrics">{project.metrics}</p>
                            <form className="recent-card-form">
                                <input type="number" placeholder="Bid Amount" id="bidAmountInput" />
                                <input type="text" placeholder="Secret Key" id="secretKeyInput" />
                                {/* {project.isBidPlaced ? (
                                    <button className="recent-post-button">
                                        Reveal Bid
                                    </button>
                                ) : (
                                    <button className="recent-post-button">
                                        Post Bid
                                    </button>
                                )} */}
                                <Link to={`/view/${project.id}`} className="recent-post-button">
                                    View Gig
                                </Link>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GigsList;
