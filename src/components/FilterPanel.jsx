import React, { useState, useEffect } from 'react';

const FilterPanel = ({
  isOpen,
  onClose,
  activeFilters,
  onApply,
  onClear,
  categories
}) => {
  const [localFilters, setLocalFilters] = useState({
    category: '',
    tag: '',
    collaborator: '',
    date: ''
  });

  // Sync local inputs with parent state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        category: activeFilters.category || '',
        tag: activeFilters.tag || '',
        collaborator: activeFilters.collaborator || '',
        date: activeFilters.date || ''
      });
    }
  }, [isOpen, activeFilters]);

  const handleFieldChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  return (
    <>
      <div 
        className={`offcanvas offcanvas-end ${isOpen ? 'show' : ''}`} 
        tabIndex="-1" 
        style={{ 
          visibility: isOpen ? 'visible' : 'hidden', 
          display: 'block', 
          zIndex: 1055 
        }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold text-dark d-flex align-items-center gap-2">
            <i className="bi bi-funnel text-primary"></i> Filter Modules
          </h5>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column gap-3">
          
          <div>
            <label htmlFor="filter-category" className="form-label fw-semibold text-secondary small">CATEGORY</label>
            <select 
              className="form-select" 
              id="filter-category"
              value={localFilters.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-tag" className="form-label fw-semibold text-secondary small">TAG</label>
            <input 
              type="text" 
              className="form-control" 
              id="filter-tag" 
              placeholder="e.g. JWT"
              value={localFilters.tag}
              onChange={(e) => handleFieldChange('tag', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="filter-collaborator" className="form-label fw-semibold text-secondary small">COLLABORATOR</label>
            <input 
              type="text" 
              className="form-control" 
              id="filter-collaborator" 
              placeholder="e.g. Alice"
              value={localFilters.collaborator}
              onChange={(e) => handleFieldChange('collaborator', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="filter-date" className="form-label fw-semibold text-secondary small">CREATED ON DATE</label>
            <input 
              type="date" 
              className="form-control" 
              id="filter-date" 
              value={localFilters.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
            />
          </div>

        </div>
        <div className="p-3 border-top d-flex gap-2">
          <button className="btn btn-outline-secondary w-100 fw-semibold" onClick={onClear}>Clear</button>
          <button className="btn btn-primary w-100 fw-semibold" onClick={handleApply}>Apply</button>
        </div>
      </div>
      {isOpen && <div className="offcanvas-backdrop fade show" style={{ zIndex: 1050 }} onClick={onClose}></div>}
    </>
  );
};

export default FilterPanel;
