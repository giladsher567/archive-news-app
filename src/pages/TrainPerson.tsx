import { useState } from 'react'
import { Link } from 'react-router-dom'
import { trainSubject } from '../api/n8n'
import { useSubjects } from '../contexts/SubjectsContext'

export default function TrainPerson() {
    const { subjects, loading: subjectsLoading } = useSubjects()
    const [selectedSubject, setSelectedSubject] = useState('')
    const [newSubjectName, setNewSubjectName] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const isCreatingNew = selectedSubject === '__new__'
    const personName = isCreatingNew ? newSubjectName : selectedSubject

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!personName.trim()) {
            setError('Person name is required')
            return
        }

        if (!imageUrl.trim()) {
            setError('Training image URL is required')
            return
        }

        try {
            setLoading(true)
            setError(null)

            await trainSubject(personName.trim(), imageUrl.trim())

            setSuccess(true)
            setSelectedSubject('')
            setNewSubjectName('')
            setImageUrl('')

            // Auto-hide success message
            setTimeout(() => {
                setSuccess(false)
            }, 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to train subject')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2 className="page-title">Train Face Recognition</h2>

            <div style={{ maxWidth: '600px' }}>
                {success && (
                    <div style={{
                        backgroundColor: '#4ade80',
                        color: '#000',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        fontWeight: '500'
                    }}>
                        ✓ Training image added successfully
                    </div>
                )}

                {error && (
                    <div style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '20px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Subject Selection */}
                    <div className="form-group">
                        <label htmlFor="subject">Person</label>
                        <select
                            id="subject"
                            value={selectedSubject}
                            onChange={(e) => {
                                setSelectedSubject(e.target.value)
                                setError(null)
                            }}
                            disabled={loading || subjectsLoading}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#2a2a2a',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                color: 'rgba(255, 255, 255, 0.87)',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">Select existing person...</option>
                            {Array.isArray(subjects) && subjects.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}

                            <option value="__new__">Create new subject...</option>
                        </select>
                    </div>

                    {/* New Subject Name (conditional) */}
                    {isCreatingNew && (
                        <div className="form-group">
                            <label htmlFor="newSubject">New person name</label>
                            <input
                                id="newSubject"
                                type="text"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                                placeholder="Enter person name..."
                                disabled={loading}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#2a2a2a',
                                    border: '1px solid #444',
                                    borderRadius: '6px',
                                    color: 'rgba(255, 255, 255, 0.87)',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    )}

                    {/* Image URL */}
                    <div className="form-group">
                        <label htmlFor="imageUrl">
                            Training image URL <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            id="imageUrl"
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://drive.google.com/..."
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#2a2a2a',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                color: 'rgba(255, 255, 255, 0.87)',
                                fontSize: '14px'
                            }}
                        />
                        <p style={{
                            fontSize: '12px',
                            color: '#888',
                            marginTop: '6px'
                        }}>
                            Google Drive image URL or direct image link
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <Link to="/" className="btn" style={{
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #444',
                            textDecoration: 'none',
                            display: 'inline-block'
                        }}>
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn"
                            disabled={loading || !personName.trim() || !imageUrl.trim()}
                            style={{
                                backgroundColor: (loading || !personName.trim() || !imageUrl.trim()) ? '#444' : '#646cff',
                                cursor: (loading || !personName.trim() || !imageUrl.trim()) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Training...' : 'Train'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
