import React, {useState} from 'react'
import { useParams } from 'react-router-dom'
import Done from '../assets/Done.png'
import './css/SubmitWork.css'

const SubmitWork = () => {

    const { gigAddress } = useParams()

    const [jobId, setJobId] = useState("");
    const [note, setNote] = useState("");
    const [projectLink, setProjectLink] = useState("");
    const [videoLink, setVideoLink] = useState("");

    return (
        <div className="post-project-container">
            <div className="submit-project-right">
                <h1>
                    Done with the <span className="span-h1"> WORK ?</span>
                </h1>{" "}
                <h2>
                    {" "}
                    Submit <span className="span-h2"> IT </span>here
                </h2>
                <form className="project-form">
                    <label htmlFor="jobId">Job ID:</label>
                    <input
                        type="text"
                        id="jobId"
                        name="jobId"
                        value={jobId}
                        onChange={(event) => setJobId(event.target.value)}
                        placeholder="Enter Job ID"
                    />
                    <label htmlFor="projectLink">Project Link:</label>
                    <input
                        type="text"
                        id="projectLink"
                        name="projectLink"
                        value={projectLink}
                        onChange={(event) => setProjectLink(event.target.value)}
                        placeholder="Enter project link"
                    />
                    <label htmlFor="videoLink">Video Demonstration Link:</label>
                    <input
                        type="text"
                        id="videoLink"
                        name="videoLink"
                        value={videoLink}
                        onChange={(event) => setVideoLink(event.target.value)}
                        placeholder="Enter video link"
                    />
                    <label htmlFor="note">Leave a Note:</label>
                    <textarea
                        id="note"
                        name="note"
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Write your note here..."
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className="submit-project-left">
                <img src={Done} alt="Issue Illustration" />
            </div>
        </div>
    );
}

export default SubmitWork