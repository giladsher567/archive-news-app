import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type SubjectsContextValue = {
    subjects: string[]
    loading: boolean
    error: string | null
    refresh: () => Promise<void>
}

const SubjectsContext = createContext<SubjectsContextValue | null>(null)

/**
 * n8n webhook – returns:
 * {
 *   "subjects": ["miri_michaeli", "nave_dromi", "test_person"]
 * }
 */
const SUBJECTS_URL = 'https://n8n.sharedvisionai.org/webhook/subjects'

function extractSubjects(payload: any): string[] {
    // Case 1: { subjects: [...] }
    if (payload && Array.isArray(payload.subjects)) {
        return payload.subjects.filter((s: any) => typeof s === 'string' && s.trim() !== '')
    }

    // Case 2: [{ subjects: [...] }]
    if (Array.isArray(payload) && payload[0]?.subjects) {
        return payload[0].subjects.filter((s: any) => typeof s === 'string' && s.trim() !== '')
    }

    return []
}

export function SubjectsProvider({ children }: { children: React.ReactNode }) {
    const [subjects, setSubjects] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refresh = async () => {
        try {
            setLoading(true)
            setError(null)

            const res = await fetch(SUBJECTS_URL, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
                cache: 'no-store',
            })

            if (!res.ok) {
                throw new Error(`Failed to fetch subjects (${res.status})`)
            }

            const data = await res.json()
            const list = extractSubjects(data)

            setSubjects(list)
        } catch (err: any) {
            console.error('Failed to load subjects:', err)
            setSubjects([])
            setError(err?.message || 'Failed to load subjects')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void refresh()
    }, [])

    const value = useMemo(
        () => ({
            subjects,
            loading,
            error,
            refresh,
        }),
        [subjects, loading, error]
    )

    return <SubjectsContext.Provider value={value}>{children}</SubjectsContext.Provider>
}

export function useSubjects() {
    const ctx = useContext(SubjectsContext)
    if (!ctx) {
        throw new Error('useSubjects must be used inside SubjectsProvider')
    }
    return ctx
}
