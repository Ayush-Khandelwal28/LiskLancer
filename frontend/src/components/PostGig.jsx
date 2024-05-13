import React, { useState } from 'react';
import "./css/PostGig.css";
import Owner from "../assets/Freelancer.png";

const PostGig = () => {
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectMetrics, setProjectMetrics] = useState("");

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
                    <button className="post-button" type="submit">
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PostGig;
