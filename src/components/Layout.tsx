import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
    return (
        <div className="app-layout">
            <aside className="sidebar">
                <NavLink to="/" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/new" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    <span>New Analysis</span>
                </NavLink>
                <NavLink to="/train" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    <span>Train</span>
                </NavLink>
                <NavLink to="/archive" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    <span>Archive</span>
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
