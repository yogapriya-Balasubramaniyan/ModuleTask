import React, { useState } from 'react';

// Layout Components
import Navbar from './components/Navbar';
import FilterPanel from './components/FilterPanel';

// Page Views
import Login from './pages/Login';
import ModuleList from './pages/ModuleList';
import ModuleView from './pages/ModuleView';
import ModuleForm from './pages/ModuleForm';

const CATEGORIES = ['Security', 'Analytics', 'Messaging', 'Billing', 'Database', 'Frontend', 'DevOps'];

const App = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const [view, setView] = useState('list');
  const [selectedId, setSelectedId] = useState(null);
  
  // Active Filters (shared between FilterPanel and ModuleList)
  const [activeFilters, setActiveFilters] = useState({ category: '', tag: '', collaborator: '', date: '' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogin = () => {
    sessionStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    setView('list');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({ category: '', tag: '', collaborator: '', date: '' });
  };

  const handleRemoveActiveFilter = (key) => {
    setActiveFilters(prev => ({ ...prev, [key]: '' }));
  };

  const handleFormSuccess = (msg) => {
    setView('list');
    showToast(msg);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Guard page for Login view
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light text-dark">
      {/* Navbar Header with Logout Action */}
      <Navbar onViewList={() => setView('list')} onLogout={handleLogout} />

      {/* Toast popup */}
      {toast && (
        <div className="position-fixed top-0 start-50 translate-middle-x p-3 animate-fade" style={{ zIndex: 1060, marginTop: '70px' }}>
          <div className="alert alert-success d-flex align-items-center gap-2 shadow-lg" role="alert">
            <i className="bi bi-check-circle-fill"></i>
            <div>{toast}</div>
          </div>
        </div>
      )}

      {/* Main layout container */}
      <main className="container my-5 flex-grow-1">
        
        {/* LIST SCREEN */}
        {view === 'list' && (
          <ModuleList
            activeFilters={activeFilters}
            onRemoveActiveFilter={handleRemoveActiveFilter}
            onClearFilters={handleClearFilters}
            onOpenFilters={() => setIsFilterOpen(true)}
            onCreateClick={() => setView('create')}
            onViewClick={(id) => {
              setSelectedId(id);
              setView('view');
            }}
            onEditClick={(id) => {
              setSelectedId(id);
              setView('edit');
            }}
            formatDate={formatDate}
          />
        )}

        {/* VIEW DETAILS SCREEN */}
        {view === 'view' && (
          <ModuleView
            id={selectedId}
            onBackClick={() => setView('list')}
            onEditClick={(id) => {
              setSelectedId(id);
              setView('edit');
            }}
            formatDate={formatDate}
          />
        )}

        {/* FORM (CREATE/EDIT) SCREEN */}
        {(view === 'create' || view === 'edit') && (
          <ModuleForm
            view={view}
            id={selectedId}
            onSuccess={handleFormSuccess}
            onCancel={() => setView('list')}
            categories={CATEGORIES}
          />
        )}
      </main>

      {/* Slide-out Offcanvas Filter Drawer */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeFilters={activeFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        categories={CATEGORIES}
      />

      {/* Footer */}
      <footer className="bg-dark text-white-50 text-center py-4 border-top border-secondary-subtle mt-auto">
        <div className="container small">
          Modules Management System &copy; 2026. Made with Bootstrap & React.
        </div>
      </footer>
    </div>
  );
};

export default App;
