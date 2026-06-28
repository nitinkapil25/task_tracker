import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ task, onCancel, onConfirm, deleting }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <span className="warning-icon"><AlertTriangle size={22} /></span>
        <h2 id="confirm-title">Delete this task?</h2>
        <p>“{task.title}” will be permanently removed. This action can’t be undone.</p>
        <div className="modal-actions">
          <button className="button button-secondary" onClick={onCancel}>Keep task</button>
          <button className="button button-danger" onClick={onConfirm} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete task'}</button>
        </div>
      </section>
    </div>
  );
}
