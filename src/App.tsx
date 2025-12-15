import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SubjectsProvider } from './contexts/SubjectsContext'

import Layout from './components/Layout'

import Dashboard from './pages/Dashboard'
import NewAnalysis from './pages/NewAnalysis'
import Train from './pages/Train'
import Archive from './pages/Archive'
import Results from './pages/Results'

import './App.css'

function App() {
    return (
        <BrowserRouter>
            <SubjectsProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="new" element={<NewAnalysis />} />
                        <Route path="train" element={<Train />} />
                        <Route path="archive" element={<Archive />} />
                        <Route path="results/:video_id" element={<Results />} />
                    </Route>
                </Routes>
            </SubjectsProvider>
        </BrowserRouter>
    )
}

export default App
