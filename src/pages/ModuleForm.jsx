import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Security', 'Analytics', 'Messaging', 'Billing', 'Database', 'Frontend', 'DevOps'];

const ModuleForm = ({
  view,
  id,
  onSuccess,
  onCancel
}) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    collaborators: ''
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = view === 'edit';

  // Load details on mount if editing
  useEffect(() => {
    const fetchExistingData = async () => {
      setLoading(true);
      setFormError(null);
      try {
        const res = await fetch(`/api/modules/${id}`);
        if (!res.ok) throw new Error('Could not fetch existing module details.');
        const data = await res.json();
        setForm({
          name: data.name,
          description: data.description || '',
          category: data.category,
          tags: data.tags ? data.tags.join(', ') : '',
          collaborators: data.collaborators ? data.collaborators.join(', ') : ''
        });
      } catch (err) {
        setFormError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (isEdit && id) {
      fetchExistingData();
    }
  }, [view, id]);

  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category) {
      setFormError('Module Name and Category are required.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      collaborators: form.collaborators.split(',').map(c => c.trim()).filter(Boolean)
    };

    try {
      const url = isEdit ? `/api/modules/${id}` : '/api/modules';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save changes.');
      }

      onSuccess(isEdit ? 'Module updated successfully.' : 'Module created successfully.');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-4">
        <button 
          className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 fw-semibold text-primary" 
          onClick={onCancel}
          disabled={submitting}
        >
          <i className="bi bi-arrow-left"></i> Back to Components
        </button>
      </div>

      <div className="mb-4">
        <h1 className="h2 fw-bold text-dark mb-1">
          {isEdit ? 'Edit Module Details' : 'Register New Module'}
        </h1>
        <p className="text-secondary mb-0">
          {isEdit ? 'Modify parameters for this system component.' : 'Fill out structural fields to instantiate an application component.'}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm p-4 bg-white" style={{ maxWidth: '800px' }}>
          <form onSubmit={handleFormSubmit}>
            {formError && (
              <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{formError}</div>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="form-name" className="form-label fw-medium text-secondary">Module Name *</label>
              <input 
                type="text" 
                className="form-control" 
                id="form-name" 
                placeholder="e.g. Distributed Service"
                value={form.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                required 
                disabled={submitting}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="form-category" className="form-label fw-medium text-secondary">Category *</label>
              <select 
                className="form-select" 
                id="form-category"
                value={form.category || ''}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                required
                disabled={submitting}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="form-description" className="form-label fw-medium text-secondary">Description</label>
              <textarea 
                className="form-control" 
                id="form-description" 
                rows="4" 
                placeholder="Explain the module functionality"
                value={form.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                disabled={submitting}
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="form-tags" className="form-label fw-medium text-secondary">Tags</label>
              <input 
                type="text" 
                className="form-control" 
                id="form-tags" 
                placeholder="e.g. SQL, Postgres, Cache (separate with commas)"
                value={form.tags || ''}
                onChange={(e) => handleFieldChange('tags', e.target.value)}
                disabled={submitting}
              />
              <div className="form-text">Comma-separated keyterms for searching tags.</div>
            </div>

            <div className="mb-4">
              <label htmlFor="form-collaborators" className="form-label fw-medium text-secondary">Collaborators</label>
              <input 
                type="text" 
                className="form-control" 
                id="form-collaborators" 
                placeholder="e.g. John, Alice (separate with commas)"
                value={form.collaborators || ''}
                onChange={(e) => handleFieldChange('collaborators', e.target.value)}
                disabled={submitting}
              />
              <div className="form-text">Developers who will participate in this module.</div>
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
              <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={submitting}>
                <i className="bi bi-save"></i> {submitting ? 'Saving...' : 'Save Module'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ModuleForm;
