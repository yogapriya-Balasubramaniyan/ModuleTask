import React, { useState, useEffect } from 'react';

const ModuleList = ({
  activeFilters,
  onRemoveActiveFilter,
  onClearFilters,
  onOpenFilters,
  onCreateClick,
  onViewClick,
  onEditClick,
  formatDate
}) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load modules internally when active filters change
  const loadModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeFilters.category) params.append('category', activeFilters.category);
      if (activeFilters.tag) params.append('tag', activeFilters.tag);
      if (activeFilters.collaborator) params.append('collaborator', activeFilters.collaborator);
      if (activeFilters.date) params.append('date', activeFilters.date);

      const res = await fetch(`/api/modules?${params.toString()}`);
      if (!res.ok) throw new Error('Could not retrieve modules list.');
      const data = await res.json();
      setModules(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, [activeFilters]);

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== '');

  return (
    <div className="fade-in">
      {error && (
        <div className="alert alert-danger mb-4 shadow-sm" role="alert">
          {error}
        </div>
      )}

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h1 className="h2 fw-bold mb-1">System Components</h1>
          <p className="text-secondary mb-0">Registry configuration and search telemetry.</p>
        </div>
        <div className="d-flex gap-2 w-100 w-sm-auto justify-content-sm-end">
          <button 
            className="btn btn-outline-secondary d-flex align-items-center gap-2 position-relative" 
            onClick={onOpenFilters}
          >
            <i className="bi bi-funnel"></i> Filters
            {hasActiveFilters && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                {Object.values(activeFilters).filter(v => v !== '').length}
              </span>
            )}
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={onCreateClick}>
            <i className="bi bi-plus-lg"></i> Create Module
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3 bg-white p-2.5 rounded border shadow-xs">
          <span className="text-secondary small fw-medium me-1">Active filters:</span>
          {Object.entries(activeFilters).map(([key, val]) => {
            if (!val) return null;
            return (
              <span key={key} className="badge bg-light text-dark border d-flex align-items-center gap-2 py-2 px-3 rounded-pill">
                <span className="text-muted text-uppercase small">{key}:</span> {val}
                <button 
                  type="button" 
                  className="btn-close ms-1" 
                  style={{ fontSize: '0.65rem' }} 
                  onClick={() => onRemoveActiveFilter(key)}
                ></button>
              </span>
            );
          })}
          <button className="btn btn-link btn-sm text-decoration-none text-danger fw-semibold ms-auto" onClick={onClearFilters}>
            Clear all
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : modules.length === 0 ? (
        <div className="card text-center py-5 border-0 shadow-xs bg-white">
          <div className="card-body">
            <i className="bi bi-slash-circle text-muted fs-1 mb-3 d-block"></i>
            <h4 className="card-title fw-bold text-dark">No modules match filters</h4>
            <p className="card-text text-secondary mb-4">Try clearing filters or add a new module to start.</p>
            <button className="btn btn-primary" onClick={onCreateClick}>Add New Module</button>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="px-4 py-3">Module Name</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Created On</th>
                  <th className="py-3">Collaborators</th>
                  <th className="py-3">Tags</th>
                  <th className="pe-4 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(mod => (
                  <tr key={mod.id}>
                    <td className="px-4 py-3 fw-semibold text-dark">{mod.name}</td>
                    <td className="py-3">
                      <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1.5 rounded">{mod.category}</span>
                    </td>
                    <td className="py-3 text-secondary">{formatDate(mod.createdAt)}</td>
                    <td className="py-3">
                      <div className="d-flex gap-1 flex-wrap">
                        {mod.collaborators.length === 0 ? (
                          <span className="text-muted small italic">None</span>
                        ) : (
                          mod.collaborators.map((c, i) => (
                            <span key={i} className="small text-dark-emphasis bg-light px-2 py-1 rounded border">{c}</span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex gap-1 flex-wrap">
                        {mod.tags.length === 0 ? (
                          <span className="text-muted small italic">None</span>
                        ) : (
                          mod.tags.map((t, i) => (
                            <span key={i} className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">{t}</span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="pe-4 py-3 text-end">
                      <div className="btn-group">
                        <button 
                          className="btn btn-outline-light text-dark btn-sm border-secondary-subtle" 
                          title="View Details"
                          onClick={() => onViewClick(mod.id)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-outline-light text-dark btn-sm border-secondary-subtle" 
                          title="Edit Module"
                          onClick={() => onEditClick(mod.id)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleList;
