import React from 'react';

export default function DeleteConfirm({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="delete-popover">
      <div className="arrow" />
      <h4>Delete this blog?</h4>
      <p>This cannot be undone.</p>
      <div className="row">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="button" className="danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  );
}
