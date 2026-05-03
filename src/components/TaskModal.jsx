import React, { useState } from 'react';
import './TaskModal.css';

const TaskModal = ({ isOpen, onClose, onTaskCreated }) => {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        due_date: '',
        estimated_time: 30,
        priority: 4
    });
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch('/api/tasks/create.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(taskData)
            });
            const data = await response.json();
            if (data.success) {
                onTaskCreated();
                onClose();
                setTaskData({ title: '', description: '', due_date: '', estimated_time: 30, priority: 4 });
            }
        } catch (error) {
            console.error('Failed to create task:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Task</h2>
                    <button className="close-x-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="task-form">
                    <div className="form-section">
                        <label htmlFor="task-title">Task Title</label>
                        <input
                            id="task-title"
                            type="text"
                            placeholder="What needs to be done?"
                            className="modal-title-input"
                            value={taskData.title}
                            onChange={e => setTaskData({ ...taskData, title: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="task-desc">Description (Optional)</label>
                        <textarea
                            id="task-desc"
                            placeholder="Add some details..."
                            className="modal-desc-input"
                            value={taskData.description}
                            onChange={e => setTaskData({ ...taskData, description: e.target.value })}
                        />
                    </div>

                    <div className="modal-grid">
                        <div className="form-section">
                            <label htmlFor="task-date">Due Date</label>
                            <input
                                id="task-date"
                                type="date"
                                className="date-input"
                                value={taskData.due_date}
                                onChange={e => setTaskData({ ...taskData, due_date: e.target.value })}
                            />
                        </div>

                        <div className="form-section">
                            <label htmlFor="task-time">Estimated Time (Min)</label>
                            <input
                                id="task-time"
                                type="number"
                                className="time-input"
                                placeholder="30"
                                value={taskData.estimated_time}
                                onChange={e => setTaskData({ ...taskData, estimated_time: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div className="form-section">
                            <label htmlFor="task-priority">Priority</label>
                            <select
                                id="task-priority"
                                className="priority-select"
                                value={taskData.priority}
                                onChange={e => setTaskData({ ...taskData, priority: parseInt(e.target.value) })}
                            >
                                <option value="1">Priority 1 (Highest)</option>
                                <option value="2">Priority 2</option>
                                <option value="3">Priority 3</option>
                                <option value="4">Priority 4 (Lowest)</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn" disabled={submitting || !taskData.title.trim()}>
                            {submitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
