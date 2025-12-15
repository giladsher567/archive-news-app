import { useParams, Link } from 'react-router-dom'

export default function Results() {
    const { video_id } = useParams<{ video_id: string }>()

    // אם אין video_id בכלל – מצב חריג
    if (!video_id) {
        return (
            <div>
                <div className="error">Missing video ID</div>
                <Link to="/" className="btn">Back to Dashboard</Link>
            </div>
        )
    }

    return (
        <div>
            <h2 className="page-title">Analysis in Progress</h2>

            <div className="card" style={{ marginBottom: '30px' }}>
                <p>
                    <strong>Video ID:</strong> {video_id}
                </p>
                <p style={{ marginTop: '15px', color: '#aaa' }}>
                    The video has been successfully received and is currently being processed.
                </p>
                <p style={{ color: '#aaa' }}>
                    Face recognition analysis may take a few minutes.
                </p>
            </div>

            <div className="card">
                <h3>Status</h3>
                <p style={{ color: '#f0c674' }}>🟡 Processing</p>
                <p style={{ fontSize: '0.9em', color: '#888' }}>
                    You can safely leave this page and return later from the Archive.
                </p>
            </div>

            <div style={{ marginTop: '30px' }}>
                <Link to="/" className="btn">Back to Dashboard</Link>
                <Link to="/archive" className="btn" style={{ marginLeft: '10px' }}>
                    Go to Archive
                </Link>
            </div>
        </div>
    )
}
