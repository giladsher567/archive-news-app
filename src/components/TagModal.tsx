import { useState } from 'react'

interface TagModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (personName: string) => void
    faceImageUrl?: string
    error?: string | null
}

export default function TagModal({ isOpen, onClose, onSave, faceImageUrl, error }: TagModalProps) {
    const [personName, setPersonName] = useState('')

    if (!isOpen) return null

    const handleSave = () => {
        if (personName.trim()) {
            onSave(personName.trim())
            setPersonName('')
        }
    }

    const handleCancel = () => {
        setPersonName('')
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
                maxWidth: '400px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Tag detected person</h3>

                {/* Error Message */}
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

                {/* Face Preview */}
                {faceImageUrl && (
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <img
                            src={faceImageUrl}
                            alt="Face preview"
                            style={{
                                maxWidth: '200px',
                                maxHeight: '200px',
                                borderRadius: '6px',
                                border: '1px solid #333'
                            }}
                        />
                    </div>
                )}

                {/* Name Input */}
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
                        placeholder="Enter name..."
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave()
                            if (e.key === 'Escape') handleCancel()
                        }}
                    />
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={handleCancel}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #444',
                            borderRadius: '6px',
                            color: 'rgba(255, 255, 255, 0.87)',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!personName.trim()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: personName.trim() ? '#646cff' : '#444',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            cursor: personName.trim() ? 'pointer' : 'not-allowed',
                            fontSize: '14px'
                        }}
                    >
                        Save & Train
                    </button>
                </div>
            </div>
        </div>
    )
}
