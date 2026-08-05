import React, { useState, useEffect } from 'react';

const ModuleView = ({
  id,
  onBackClick,
  onEditClick,
  formatDate
}) => {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/modules/${id}`);
        if (!res.ok) throw new Error('Could not retrieve module details.');
        const data = await res.json();
        setModule(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchDetails();
    }
  }, [id]);

  return (
    <div className="fade-in">
      <div className="mb-4">
        <button 
          className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 fw-semibold text-primary" 
          onClick={onBackClick}
        >
          <i className="bi bi-arrow-left"></i> Back to Components
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : module ? (
        <>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
            <div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fs-7 fw-semibold rounded mb-2 d-inline-block">
                {module.category}
              </span>
              <h1 className="fw-bold text-dark mb-1">{module.name}</h1>
              <p className="text-secondary small mb-0">Module System ID: {module.id}</p>
            </div>
            <div>
              <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => onEditClick(module.id)}>
                <i className="bi bi-pencil"></i> Edit Module Details
              </button>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm p-4 bg-white">
                <h5 className="card-title fw-bold text-dark mb-3 border-bottom pb-2">Functional Scope</h5>
                <p className="card-text text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                  {module.description || 'No functional description specified.'}
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 bg-white h-100">
                <h5 className="card-title fw-bold text-dark mb-3 border-bottom pb-2">Collaborators</h5>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {module.collaborators.length === 0 ? (
                    <span className="text-secondary italic small">No developers assigned.</span>
                  ) : (
                    module.collaborators.map((c, i) => (
                      <span key={i} className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 fs-6 rounded">
                        <i className="bi bi-person-fill me-1"></i> {c}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 bg-white h-100">
                <h5 className="card-title fw-bold text-dark mb-3 border-bottom pb-2">Keywords & Tags</h5>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {module.tags.length === 0 ? (
                    <span className="text-secondary italic small">No tags applied.</span>
                  ) : (
                    module.tags.map((t, i) => (
                      <span key={i} className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 fs-6">
                        <i className="bi bi-tag-fill me-1"></i> {t}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 bg-white h-100">
                <h5 className="card-title fw-bold text-dark mb-3 border-bottom pb-2">Version Log</h5>
                <div className="mt-2">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary small">Created:</span>
                    <span className="text-dark fw-semibold small">{formatDate(module.createdAt)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-secondary small">Modified:</span>
                    <span className="text-dark fw-semibold small">{formatDate(module.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ModuleView;
