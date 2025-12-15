import { Outlet, NavLink } from 'react-router-dom'
import { useState } from 'react'

export default function Layout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const closeMobileMenu = () => setMobileMenuOpen(false)

    return (
        <div className="app-layout">
            {/* Hamburger button - mobile only */}
            <button
                className="hamburger-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Sidebar - desktop always visible, mobile overlay when open */}
            <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                {/* Close button - mobile only */}
                <button
                    className="close-menu-btn"
                    onClick={closeMobileMenu}
                    aria-label="Close menu"
                >
                    ✕
                </button>

                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                    onClick={closeMobileMenu}
                >
                    <span className="nav-icon">📊</span>
                    <span className="nav-label">Dashboard</span>
                </NavLink>
                <NavLink
                    to="/new"
                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                    onClick={closeMobileMenu}
                >
                    <span className="nav-icon">🎬</span>
                    <span className="nav-label">New Analysis</span>
                </NavLink>
                <NavLink
                    to="/train"
                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                    onClick={closeMobileMenu}
                >
                    <span className="nav-icon">🧠</span>
                    <span className="nav-label">Train</span>
                </NavLink>
                <NavLink
                    to="/archive"
                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                    onClick={closeMobileMenu}
                >
                    <span className="nav-icon">🗄️</span>
                    <span className="nav-label">Archive</span>
                </NavLink>
            </aside>

            {/* Overlay backdrop - mobile only */}
            {mobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={closeMobileMenu}
                />
            )}

            <div className="main-content">
                <header className="top-bar">
                    <h1>Archive News – Video Analysis</h1>
                </header>
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
