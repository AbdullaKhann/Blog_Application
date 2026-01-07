import React from 'react';

const RegisterForm = ({ onSwitch }) => {
    return (
        <div className="auth-card">
            <div className="card-header">
                <h2>Join Community</h2>
                <p>Start publishing your discoveries</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Rohit Khan"
                        autoComplete="name"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        className="form-input"
                        placeholder="rohit@gmail.com"
                        autoComplete="email"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        autoComplete="new-password"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        autoComplete="new-password"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Role</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <input type="radio" name="role" value="reader" defaultChecked /> Reader
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <input type="radio" name="role" value="author" /> Author
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <input type="radio" name="role" value="editor" /> Editor
                        </label>
                    </div>
                </div>
                <button type="submit" className="btn-primary">
                    Register
                </button>
            </form>
            <div className="toggle-text">
                Already have an account?{' '}
                <span className="toggle-link" onClick={onSwitch}>
                    Sign in
                </span>
            </div>
        </div>
    );
};

export default RegisterForm;
