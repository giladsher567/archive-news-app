const DASHBOARD_URL = 'https://n8n.sharedvisionai.org/webhook/dashboard'
const ARCHIVE_URL = 'https://n8n.sharedvisionai.org/webhook/archive'
const ANALYZE_URL = 'https://n8n.sharedvisionai.org/webhook/analyze'
const TAG_URL = 'https://n8n.sharedvisionai.org/webhook/tag-video'
const TRAIN_URL = 'https://n8n.sharedvisionai.org/webhook/train-subject'
const SUBJECTS_URL = 'https://n8n.sharedvisionai.org/webhook/subjects'

/* =========================
   Types
========================= */

export interface FaceDetection {
    name: string
    first_timecode: string
    last_timecode: string
    appearances: number
    thumbnail_url?: string
}

export interface DashboardVideo {
    video_id: string
    video_name: string
    duration_seconds: number
    analysis_status:
    | 'processing'
    | 'faces_done'
    | 'name_replaced'
    | 'failed'
    | 'audio_done'
    | 'vis_done'
    | 'done'
    faces?: FaceDetection[]
}

export interface AnalysisResponse {
    video_id: string
    status?: string
    message?: string
}

export interface TagRequest {
    video_id: string
    old_name: string
    new_name: string
}

export interface TrainRequest {
    person_name: string
    image_url: string
}

export interface SubjectsResponse {
    subjects: string[]
}

/* =========================
   Dashboard
========================= */

export async function getDashboard(): Promise<DashboardVideo[]> {
    const response = await fetch(DASHBOARD_URL)

    if (!response.ok) {
        throw new Error(`Failed to fetch dashboard: ${response.statusText}`)
    }

    return response.json()
}

/* =========================
   Archive (❗️היה חסר – זה שבר את כל ה-UI)
========================= */

export async function getArchive(): Promise<DashboardVideo[]> {
    const response = await fetch(ARCHIVE_URL)

    if (!response.ok) {
        throw new Error(`Failed to fetch archive: ${response.statusText}`)
    }

    return response.json()
}

/* =========================
   Start Analysis
========================= */

export async function startAnalysis(videoUrl: string): Promise<AnalysisResponse> {
    const response = await fetch(ANALYZE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: videoUrl }),
    })

    if (!response.ok) {
        throw new Error(`Failed to start analysis: ${response.statusText}`)
    }

    return response.json()
}

/* =========================
   Subjects (Get list of known subjects)
========================= */

export async function getSubjects(): Promise<string[]> {
    const response = await fetch(SUBJECTS_URL)

    if (!response.ok) {
        throw new Error(`Failed to fetch subjects: ${response.statusText}`)
    }

    const data: SubjectsResponse = await response.json()
    return data.subjects
}

/* =========================
   Tag Person (Update existing video metadata)
========================= */

export async function tagPerson(videoId: string, oldName: string, newName: string): Promise<void> {
    const response = await fetch(TAG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: videoId, old_name: oldName, new_name: newName }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Failed to tag person: ${response.statusText}`)
    }
}

/* =========================
   Train Subject (Add training image for face recognition)
========================= */

export async function trainSubject(personName: string, imageUrl: string): Promise<void> {
    const response = await fetch(TRAIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person_name: personName, image_url: imageUrl }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Failed to train subject: ${response.statusText}`)
    }
}
