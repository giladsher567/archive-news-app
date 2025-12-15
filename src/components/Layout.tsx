import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
    return (
        <div className="app-layout">
            <aside className="sidebar">
                <NavLink to="/" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    Dashboard
                </NavLink>
                <NavLink to="/new" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    New Analysis
                </NavLink>
                <NavLink to="/train" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    Train
                </NavLink>
                <NavLink to="/archive" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    Archive
                </NavLink>
            </aside>
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
