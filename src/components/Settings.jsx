import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [status, setStatus] = useState({ type: '', message: '' });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/user/update_profile.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(profileData)
            });
            const data = await response.json();
            if (data.success) {
                updateUser(profileData);
                setStatus({ type: 'success', message: 'Profile updated successfully' });
            } else {
                setStatus({ type: 'error', message: data.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to update profile' });
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        try {
            const response = await fetch('/api/user/update_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    current_password: passwordData.current_password,
                    new_password: passwordData.new_password
                })
            });
            const data = await response.json();
            if (data.success) {
                setStatus({ type: 'success', message: 'Password updated successfully' });
                setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
            } else {
                setStatus({ type: 'error', message: data.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to update password' });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <button className="back-btn" onClick={() => navigate('/dashboard')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#db4c3f', fontWeight: 'bold', marginBottom: '10px' }}>
                    ← Back to Dashboard
                </button>
                <h2>Settings</h2>

                {status.message && (
                    <div className={status.type === 'success' ? 'auth-success-message' : 'auth-error-message'} style={{
                        backgroundColor: status.type === 'success' ? '#e6fffa' : '#fff5f5',
                        color: status.type === 'success' ? '#2c7a7b' : '#c53030',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {status.message}
                    </div>
                )}

                <section className="settings-section">
                    <h3>Update Profile</h3>
                    <form className="auth-form" onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="auth-btn">Save Profile</button>
                    </form>
                </section>

                <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />

                <section className="settings-section">
                    <h3>Change Password</h3>
                    <form className="auth-form" onSubmit={handlePasswordUpdate}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="auth-btn">Update Password</button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default Settings;
