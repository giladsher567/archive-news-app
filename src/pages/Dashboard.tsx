import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard, DashboardVideo, tagPerson } from '../api/n8n'
import { useSubjects } from '../contexts/SubjectsContext'

// ===== Helpers =====

// Convert seconds to MM:SS (used for screen time)
function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// Convert seconds to MM:SS:FF (video duration)
function formatDurationWithFrames(seconds: number, frameRate = 25): string {
    const totalSeconds = Math.floor(seconds)
    const frames = Math.floor((seconds - totalSeconds) * frameRate)

    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`
}

// Calculate screen time from first and last timecode
function calculateScreenTime(first: string, last: string): string {
    const parseTimecode = (tc: string): number => {
        const parts = tc.split(':').map(Number)
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2]
        }
        return 0
    }

    const firstSec = parseTimecode(first)
    const lastSec = parseTimecode(last)
    return formatDuration(lastSec - firstSec)
}

// Success statuses (faces_done + name_replaced)
function isFacesSuccess(status: string): boolean {
    return status === 'faces_done' || status === 'name_replaced'
}

// Status badge info
function getStatusInfo(status: string): { emoji: string; text: string; color: string } {
    const statusMap: Record<string, { emoji: string; text: string; color: string }> = {
        processing: { emoji: '⏳', text: 'Processing', color: '#facc15' },
        faces_done: { emoji: '✅', text: 'Face analysis completed', color: '#4ade80' },
        name_replaced: { emoji: '✅', text: 'Face analysis completed (tag updated)', color: '#4ade80' },
        audio_done: { emoji: '🎧', text: 'Audio analysis completed', color: '#4ade80' },
        vis_done: { emoji: '👁', text: 'Visual analysis completed', color: '#4ade80' },
        done: { emoji: '✔', text: 'Analysis completed', color: '#4ade80' },
        failed: { emoji: '❌', text: 'Failed', color: '#ef4444' },
    }

    return statusMap[status] || { emoji: '●', text: status, color: '#888' }
}

interface TaggingState {
    videoId: string
    faceIndex: number
    faceImageUrl?: string
}

export default function Dashboard() {
    const { subjects } = useSubjects()
    const [videos, setVideos] = useState<DashboardVideo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [taggingState, setTaggingState] = useState<TaggingState | null>(null)
    const [selectedSubject, setSelectedSubject] = useState('')
    const [tagError, setTagError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchDashboard() {
            try {
                setLoading(true)
                const data = await getDashboard()
                setVideos(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load dashboard')
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard()
    }, [])

    const handleOpenTagModal = (videoId: string, faceIndex: number, faceImageUrl?: string) => {
        setTaggingState({ videoId, faceIndex, faceImageUrl })
        setSelectedSubject('')
        setTagError(null)
    }

    const handleSaveTag = async () => {
        if (!taggingState || !selectedSubject) return

        try {
            await tagPerson(taggingState.videoId, 'UNKNOWN', selectedSubject)

            setVideos(prev =>
                prev.map(video => {
                    if (video.video_id === taggingState.videoId && video.faces) {
                        const updatedFaces = [...video.faces]
                        updatedFaces[taggingState.faceIndex] = {
                            ...updatedFaces[taggingState.faceIndex],
                            name: selectedSubject,
                        }

                        return {
                            ...video,
                            analysis_status: 'name_replaced',
                            faces: updatedFaces,
                        }
                    }
                    return video
                })
            )

            setTaggingState(null)
            setSelectedSubject('')
            setTagError(null)
        } catch (err) {
            setTagError(err instanceof Error ? err.message : 'Failed to tag person')
        }
    }

    if (loading) return <div className="loading">Loading dashboard...</div>
    if (error) return <div className="error">{error}</div>

    return (
        <div>
            <h2 className="page-title">Dashboard</h2>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
                <Link to="/new" className="btn">New Analysis</Link>
                <Link
                    to="/train"
                    className="btn"
                    style={{ backgroundColor: '#4ade80', border: 'none', textDecoration: 'none' }}
                >
                    Train new person
                </Link>
            </div>

            {videos.length === 0 ? (
                <p style={{ color: '#888' }}>No videos yet. Start your first analysis!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#333' }}>
                    {videos.map(video => {
                        const statusInfo = getStatusInfo(video.analysis_status)
                        let facesContent: React.ReactNode = '—'

                        if (isFacesSuccess(video.analysis_status) && video.faces?.length) {
                            facesContent = (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {video.faces.map((face, idx) => {
                                        const screenTime = calculateScreenTime(face.first_timecode, face.last_timecode)
                                        const isUnknown = face.name.toLowerCase().includes('unknown')

                                        return (
                                            <div key={idx} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <span>
                                                    {face.name} | Screen time: {screenTime} | First: {face.first_timecode} | Last: {face.last_timecode}
                                                </span>
                                                {isUnknown && (
                                                    <button
                                                        onClick={() => handleOpenTagModal(video.video_id, idx, face.thumbnail_url)}
                                                        style={{
                                                            padding: '3px 8px',
                                                            backgroundColor: '#646cff',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            color: 'white',
                                                            fontSize: '11px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Tag
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        } else if (isFacesSuccess(video.analysis_status)) {
                            facesContent = 'None detected'
                        }

                        return (
                            <div
                                key={video.video_id}
                                style={{
                                    backgroundColor: '#1a1a1a',
                                    padding: '12px 16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '14px' }}>
                                    <div style={{ flex: '1 1 200px', fontWeight: '500', minWidth: '150px' }}>
                                        {video.video_name || 'Unnamed video'}
                                    </div>

                                    <div style={{ flex: '0 0 auto', color: '#aaa', minWidth: '90px' }}>
                                        Duration: {formatDurationWithFrames(video.duration_seconds)}
                                    </div>

                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '4px 10px',
                                        borderRadius: '4px',
                                        backgroundColor: '#2a2a2a',
                                        color: statusInfo.color,
                                        fontSize: '13px',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        <span>{statusInfo.emoji}</span>
                                        <span>{statusInfo.text}</span>
                                    </div>

                                    <div style={{ flex: '1 1 250px', color: '#ccc', fontSize: '13px', minWidth: '200px' }}>
                                        {facesContent}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {taggingState && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '90%',
                    }}>
                        <h3 style={{ marginBottom: '20px' }}>Tag detected person</h3>

                        {tagError && (
                            <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                                {tagError}
                            </div>
                        )}

                        <select
                            value={selectedSubject}
                            onChange={e => setSelectedSubject(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#2a2a2a',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                color: 'rgba(255,255,255,0.87)',
                                marginBottom: '12px',
                            }}
                        >
                            <option value="">Select existing person...</option>
                            {subjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            value={selectedSubject}
                            onChange={e => setSelectedSubject(e.target.value)}
                            placeholder="Or enter new name..."
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#2a2a2a',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                color: 'rgba(255,255,255,0.87)',
                                marginBottom: '20px',
                            }}
                        />

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setTaggingState(null)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2a2a2a',
                                    border: '1px solid #444',
                                    borderRadius: '6px',
                                    color: 'white',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTag}
                                disabled={!selectedSubject.trim()}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: selectedSubject.trim() ? '#646cff' : '#444',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'white',
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
