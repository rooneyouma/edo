import React, { useState } from 'react';

const OnboardRoleModal = ({
  roleName,
  open,
  onClose,
  onSuccess,
  user,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOnboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/onboard-role/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || ''}`,
        },
        body: JSON.stringify({ role: roleName }),
      });
      const data = await response.json();
      if (response.ok) {
        onSuccess(data.roles);
        onClose();
      } else {
        setError(data.error || 'Failed to onboard role.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Become a {roleName.charAt(0).toUpperCase() + roleName.slice(1)}</h2>
        <p>
          To access this portal, you need to onboard as a <b>{roleName}</b>.<br/>
          Would you like to proceed?
        </p>
        {error && <div className="error">{error}</div>}
        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>Cancel</button>
          <button onClick={handleOnboard} disabled={loading}>
            {loading ? 'Processing...' : `Become ${roleName}`}
          </button>
        </div>
      </div>
      <style>{`
        .modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal {
          background: #fff; padding: 2rem; border-radius: 8px; max-width: 400px; width: 100%;
          box-shadow: 0 2px 16px rgba(0,0,0,0.2);
        }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
        .error { color: #b00; margin-top: 1rem; }
      `}</style>
    </div>
  );
};

export default OnboardRoleModal; 