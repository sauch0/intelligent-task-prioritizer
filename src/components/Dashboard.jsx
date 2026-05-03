import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskModal from './TaskModal';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('inbox');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Fetch tasks on load
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks/read.php', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleTaskStatus = async (taskId, currentStatus) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        try {
            const response = await fetch('/api/tasks/update.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: taskId, status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const deleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            const response = await fetch('/api/tasks/delete.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: taskId })
            });
            const data = await response.json();
            if (data.success) {
                setTasks(tasks.filter(t => t.id !== taskId));
            }
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const calculatePriorityScore = (task) => {
        let score = 0;

        // Priority weight (1 is highest)
        score += (5 - task.priority) * 30; // P1=120, P2=90, P3=60, P4=30

        // Urgency weight (Closer is better)
        if (task.due_date) {
            const today = new Date();
            const due = new Date(task.due_date);
            const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

            if (diffDays <= 0) score += 100; // Overdue or today
            else if (diffDays <= 3) score += 50;
            else if (diffDays <= 7) score += 20;
        }

        // Estimated time weight (Shorter tasks get a small "quick win" boost)
        const time = parseInt(task.estimated_time) || 30;
        if (time <= 15) score += 15;
        else if (time <= 30) score += 10;
        else if (time <= 60) score += 5;

        return score;
    };

    const sortedTasks = [...tasks]
        .filter(task => {
            if (activeTab === 'inbox') return task.status === 'pending';
            if (activeTab === 'completed') return task.status === 'completed';

            if (activeTab === 'today') {
                if (!task.due_date || task.status === 'completed') return false;
                const today = new Date().toISOString().split('T')[0];
                const taskDate = task.due_date.split(' ')[0];
                return taskDate === today;
            }

            return true;
        })
        .sort((a, b) => {
            if (activeTab === 'completed') return new Date(b.updated_at) - new Date(a.updated_at);
            return calculatePriorityScore(b) - calculatePriorityScore(a);
        });

    return (
        <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="user-profile">
                        <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
                        <span className="user-name">{user?.name || 'User'}</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button className="add-task-sidebar-btn" onClick={() => setIsTaskModalOpen(true)}>
                        <span className="plus-icon">+</span>
                        Add task
                    </button>

                    <div className="nav-group">
                        <button
                            className={`nav-item ${activeTab === 'inbox' ? 'active' : ''}`}
                            onClick={() => setActiveTab('inbox')}
                        >
                            <span className="nav-icon">📥</span>
                            Inbox
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'today' ? 'active' : ''}`}
                            onClick={() => setActiveTab('today')}
                        >
                            <span className="nav-icon">📅</span>
                            Today
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            <span className="nav-icon">🗓️</span>
                            Upcoming
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'completed' ? 'active' : ''}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            <span className="nav-icon">✅</span>
                            Completed
                        </button>
                    </div>

                    <div className="nav-group">
                        <button
                            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => navigate('/settings')}
                        >
                            <span className="nav-icon">⚙️</span>
                            Settings
                        </button>
                        <button className="nav-item logout-nav" onClick={handleLogout}>
                            <span className="nav-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="content-header">
                    <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                </header>

                <div className="task-list-container">
                    {loading ? (
                        <div className="loading-state">Loading tasks...</div>
                    ) : sortedTasks.length > 0 ? (
                        <div className="task-list">
                            {sortedTasks.map(task => (
                                <div key={task.id} className={`task-item ${task.status}`}>
                                    <button
                                        className="task-checkbox"
                                        onClick={() => toggleTaskStatus(task.id, task.status)}
                                    >
                                        {task.status === 'completed' && '✓'}
                                    </button>
                                    <div className="task-details">
                                        <div className="task-header-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <h3 className="task-title">{task.title}</h3>
                                            <span className="task-time-badge" style={{ fontSize: '11px', color: '#888', background: '#f0f0f0', padding: '2px 6px', borderRadius: '10px' }}>
                                                {task.estimated_time}m
                                            </span>
                                        </div>
                                        {task.description && <p className="task-desc">{task.description}</p>}
                                    </div>
                                    <button
                                        className="task-delete-btn"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <img src="https://todoist.com/_next/static/images/empty-state@2x.png" alt="Empty" className="empty-img" />
                            <h3>Capture now, plan later</h3>
                            <p>Inbox is your go-to spot for quick task entry. Clear your mind now, organize when you're ready.</p>
                            <button className="add-task-empty-btn" onClick={() => setIsTaskModalOpen(true)}>+ Add task</button>
                        </div>
                    )}
                </div>
            </main>

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onTaskCreated={fetchTasks}
            />
        </div>
    );
};

export default Dashboard;
