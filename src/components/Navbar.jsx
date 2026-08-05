import React from 'react';

const Navbar = ({ onViewList, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3 shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center gap-2 fw-semibold" href="#" onClick={onViewList}>
          <i className="bi bi-cpu text-primary fs-3"></i>
          Modules Manager
        </a>
        <div className="navbar-text text-white-50 d-none d-sm-block me-auto">
          Persistent System Registry
        </div>
        {onLogout && (
          <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1.5 fw-medium px-3 py-1.5" onClick={onLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
