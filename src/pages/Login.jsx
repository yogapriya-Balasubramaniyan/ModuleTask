import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Default credentials setup
    if (username.trim() === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white px-3">
      <div className="card border-0 shadow-lg text-dark bg-white" style={{ maxWidth: '420px', width: '100%', borderRadius: '12px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary p-3 rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-shield-lock-fill fs-3"></i>
            </div>
            <h3 className="fw-bold text-dark mb-1">System Registry Login</h3>
            <p className="text-secondary small">Sign in using system administration credentials.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2.5" role="alert" style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{error}</div>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="login-username" className="form-label small fw-medium text-secondary">Username</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><i className="bi bi-person-fill text-muted"></i></span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-1" 
                  id="login-username" 
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="login-password" className="form-label small fw-medium text-secondary">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><i className="bi bi-key-fill text-muted"></i></span>
                <input 
                  type="password" 
                  className="form-control border-start-0 ps-1" 
                  id="login-password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-semibold py-2.5 d-flex align-items-center justify-content-center gap-2">
              Sign In <i className="bi bi-arrow-right-short"></i>
            </button>
          </form>
          
          <div className="mt-4 pt-3 border-top text-center text-secondary" style={{ fontSize: '0.8rem' }}>
            <div>Default credentials:</div>
            <code className="text-dark-emphasis fw-semibold">admin</code> / <code className="text-dark-emphasis fw-semibold">admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
