import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const initialForm = { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' };

export default function TaskModal({ task, onClose, onSave, saving }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(task ? {
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.slice(0, 10) || '',
    } : initialForm);
  }, [task]);

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }));
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Please enter a task title.';
    else if (form.title.trim().length < 3) nextErrors.title = 'Use at least 3 characters.';
    if (form.title.length > 100) nextErrors.title = 'Keep the title under 100 characters.';
    if (form.description.length > 500) nextErrors.description = 'Keep the description under 500 characters.';
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) await onSave({ ...form, title: form.title.trim(), dueDate: form.dueDate || null });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal-header">
          <div><p className="eyebrow">{task ? 'Update your plan' : 'Add to your plan'}</p><h2 id="modal-title">{task ? 'Edit task' : 'Create a new task'}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={21} /></button>
        </header>
        <form onSubmit={submit} noValidate>
          <label>
            Task title <span>*</span>
            <input autoFocus value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="What needs to be done?" />
            <small className={errors.title ? 'field-error' : ''}>{errors.title || `${form.title.length}/100`}</small>
          </label>
          <label>
            Description
            <textarea rows="4" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Add useful context or notes..." />
            <small className={errors.description ? 'field-error' : ''}>{errors.description || `${form.description.length}/500`}</small>
          </label>
          <div className="form-grid">
            <label>Status
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                <option value="todo">To do</option><option value="in-progress">In progress</option><option value="completed">Completed</option>
              </select>
            </label>
            <label>Priority
              <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </label>
          </div>
          <label>Due date<input type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} /></label>
          <footer className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
            <button className="button button-primary" disabled={saving}>{saving ? 'Saving...' : task ? 'Save changes' : 'Create task'}</button>
          </footer>
        </form>
      </section>
    </div>
  );
}
