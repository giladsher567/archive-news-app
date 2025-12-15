import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startAnalysis } from '../api/n8n'

export default function NewAnalysis() {
    const [videoUrl, setVideoUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!videoUrl.trim()) {
            setError('Please enter a video URL')
            return
        }

        try {
            setLoading(true)
            setError(null)
            const response = await startAnalysis(videoUrl)

            // Navigate to results page
            navigate(`/results/${response.video_id}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start analysis')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2 className="page-title">New Analysis</h2>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="video-url">Video URL</label>
                    <input
                        id="video-url"
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://example.com/video.mp4"
                        disabled={loading}
                    />
                </div>

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Starting Analysis...' : 'Start Analysis'}
                </button>
            </form>
        </div>
    )
}
