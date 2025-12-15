import { useEffect, useState } from 'react'
import { getDashboard, DashboardVideo } from '../api/n8n'

// Helper
function formatDuration(seconds?: number): string {
    if (!seconds || !Number.isFinite(seconds)) return '—'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default function Archive() {
    const [videos, setVideos] = useState<DashboardVideo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchArchive() {
            try {
                setLoading(true)
                const data = await getDashboard()

                // ארכיון = כל מה שלא processing
                const archived = data.filter(
                    v => v.analysis_status && v.analysis_status !== 'processing'
                )

                setVideos(archived)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load archive')
            } finally {
                setLoading(false)
            }
        }

        fetchArchive()
    }, [])

    if (loading) {
        return <div className="loading">Loading archive…</div>
    }

    if (error) {
        return (
            <div style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '12px',
                borderRadius: '6px'
            }}>
                {error}
            </div>
        )
    }

    return (
        <div>
            <h2 className="page-title">Archive</h2>

            {/* Search bar – הכנה בלבד */}
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search (coming soon)…"
                    disabled
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#2a2a2a',
                        border: '1px solid #444',
                        borderRadius: '6px',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '14px',
                        cursor: 'not-allowed'
                    }}
                />
            </div>

            {videos.length === 0 ? (
                <p style={{ color: '#888' }}>No archived videos yet.</p>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1px',
                    backgroundColor: '#333'
                }}>
                    {videos.map(video => (
                        <div
                            key={video.video_id}
                            style={{
                                backgroundColor: '#1a1a1a',
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                fontSize: '14px'
                            }}
                        >
                            {/* Name */}
                            <div style={{
                                flex: '1 1 200px',
                                fontWeight: '500'
                            }}>
                                {video.video_name || 'Unnamed video'}
                            </div>

                            {/* Duration */}
                            <div style={{
                                color: '#aaa',
                                minWidth: '60px'
                            }}>
                                {formatDuration(video.duration_seconds)}
                            </div>

                            {/* Status */}
                            <div style={{
                                padding: '4px 10px',
                                borderRadius: '4px',
                                backgroundColor: '#2a2a2a',
                                color: '#4ade80',
                                whiteSpace: 'nowrap'
                            }}>
                                ✓ Archived
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
