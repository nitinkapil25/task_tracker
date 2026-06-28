import { Calendar, Check, Circle, Clock3, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const statusLabels = { todo: 'To do', 'in-progress': 'In progress', completed: 'Completed' };

function formatDate(date) {
  if (!date) return null;
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(`${date.slice(0, 10)}T00:00:00`)
  );
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const isComplete = task.status === 'completed';
  const isOverdue = task.dueDate && !isComplete && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  return (
    <article className={`task-card ${isComplete ? 'is-complete' : ''}`}>
      <button
        className="complete-toggle"
        onClick={() => onToggle(task)}
        aria-label={isComplete ? `Mark ${task.title} as to do` : `Complete ${task.title}`}
      >
        {isComplete ? <Check size={15} /> : <Circle size={20} />}
      </button>
      <div className="task-content">
        <div className="task-heading">
          <h3>{task.title}</h3>
          <div className="task-menu" ref={menuRef}>
            <button className="icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Task actions">
              <MoreHorizontal size={20} />
            </button>
            {menuOpen && (
              <div className="menu-popover">
                <button onClick={() => { onEdit(task); setMenuOpen(false); }}><Pencil size={15} /> Edit</button>
                <button className="danger" onClick={() => { onDelete(task); setMenuOpen(false); }}><Trash2 size={15} /> Delete</button>
              </div>
            )}
          </div>
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        <footer className="task-meta">
          <span className={`status-badge ${task.status}`}>
            {task.status === 'in-progress' ? <Clock3 size={13} /> : <Circle size={9} fill="currentColor" />}
            {statusLabels[task.status]}
          </span>
          <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
          {task.dueDate && (
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              <Calendar size={14} /> {isOverdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
            </span>
          )}
        </footer>
      </div>
    </article>
  );
}
