import React from 'react';

const LoginForm = ({ onSwitch }) => {
    return (
        <div className="auth-card">
            <div className="card-header">
                <h2>Welcome Back</h2>
                <p>Sign in to continue your research</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        className="form-input"
                        placeholder="abdullakhan@gmail.com"
                        autoComplete="email"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                </div>
                <button type="submit" className="btn-primary">
                    Sign In
                </button>
            </form>
            <div className="toggle-text">
                New to the platform?{' '}
                <span className="toggle-link" onClick={onSwitch}>
                    Create an account
                </span>
            </div>
        </div>
    );
};

export default LoginForm;
