import { useState } from 'react'
import { trainSubject } from '../api/n8n'

interface TrainModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function TrainModal({ isOpen, onClose }: TrainModalProps) {
    const [personName, setPersonName] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async () => {
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

            // Auto-close after showing success message
            setTimeout(() => {
                handleClose()
            }, 1500)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to train subject')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setPersonName('')
        setImageUrl('')
        setError(null)
        setSuccess(false)
        setLoading(false)
        onClose()
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '24px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Train face recognition</h3>

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

                {/* Person Name Input */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        Person name
                    </label>
                    <input
                        type="text"
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
                        placeholder="Enter person name..."
                        disabled={loading || success}
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
                    <p style={{
                        fontSize: '12px',
                        color: '#888',
                        marginTop: '6px'
                    }}>
                        Create new person or add training images to existing person
                    </p>
                </div>

                {/* Image URL Input */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        Training image URL <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        disabled={loading || success}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #444',
                            borderRadius: '6px',
                            color: 'rgba(255, 255, 255, 0.87)',
                            fontSize: '14px'
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !loading && !success) handleSubmit()
                            if (e.key === 'Escape') handleClose()
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
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #444',
                            borderRadius: '6px',
                            color: 'rgba(255, 255, 255, 0.87)',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            opacity: loading ? 0.5 : 1
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || success || !personName.trim() || !imageUrl.trim()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: (loading || success || !personName.trim() || !imageUrl.trim()) ? '#444' : '#646cff',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            cursor: (loading || success || !personName.trim() || !imageUrl.trim()) ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        {loading ? 'Training...' : 'Train'}
                    </button>
                </div>
            </div>
        </div>
    )
}
