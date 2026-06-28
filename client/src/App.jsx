import { ClipboardList, Plus, RefreshCw, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { taskApi } from './api/tasks.js';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import Header from './components/Header.jsx';
import Stats from './components/Stats.jsx';
import TaskCard from './components/TaskCard.jsx';
import TaskFilters from './components/TaskFilters.jsx';
import TaskModal from './components/TaskModal.jsx';

const defaultFilters = { search: '', status: 'all', priority: 'all', sort: 'newest' };
const priorityWeight = { high: 3, medium: 2, low: 1 };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [modalTask, setModalTask] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskApi.list();
      setTasks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const visibleTasks = useMemo(() => {
    const search = filters.search.toLowerCase().trim();
    return tasks
      .filter((task) => filters.status === 'all' || task.status === filters.status)
      .filter((task) => filters.priority === 'all' || task.priority === filters.priority)
      .filter((task) => !search || `${task.title} ${task.description}`.toLowerCase().includes(search))
      .sort((a, b) => {
        if (filters.sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (filters.sort === 'due') {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (filters.sort === 'priority') return priorityWeight[b.priority] - priorityWeight[a.priority];
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [tasks, filters]);

  function openCreate() { setModalTask(undefined); setModalOpen(true); }
  function openEdit(task) { setModalTask(task); setModalOpen(true); }

  async function saveTask(payload) {
    setBusy(true);
    try {
      if (modalTask) {
        const response = await taskApi.update(modalTask._id, payload);
        setTasks((current) => current.map((task) => task._id === modalTask._id ? response.data : task));
        notify('Task updated successfully');
      } else {
        const response = await taskApi.create(payload);
        setTasks((current) => [response.data, ...current]);
        notify('Task added to your plan');
      }
      setModalOpen(false);
    } catch (err) { notify(err.message, 'error'); } finally { setBusy(false); }
  }

  async function toggleTask(task) {
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    try {
      const response = await taskApi.update(task._id, { status: nextStatus });
      setTasks((current) => current.map((item) => item._id === task._id ? response.data : item));
      notify(nextStatus === 'completed' ? 'Nice work — task completed!' : 'Task moved back to your list');
    } catch (err) { notify(err.message, 'error'); }
  }

  async function deleteTask() {
    setBusy(true);
    try {
      await taskApi.remove(deleteTarget._id);
      setTasks((current) => current.filter((task) => task._id !== deleteTarget._id));
      setDeleteTarget(null);
      notify('Task deleted');
    } catch (err) { notify(err.message, 'error'); } finally { setBusy(false); }
  }

  return (
    <>
      <Header />
      <main id="top">
        <section className="hero">
          <div>
            <p className="eyebrow"><Sparkles size={14} /> Your day, in focus</p>
            <h1>Make progress <em>visible.</em></h1>
            <p className="hero-copy">A simple space to capture what matters, focus on what’s next, and feel good about what you finish.</p>
          </div>
          <button className="button button-primary hero-add" onClick={openCreate}><Plus size={19} /> Add a task</button>
        </section>

        <Stats tasks={tasks} />

        <section className="task-section">
          <div className="section-title"><div><p className="eyebrow">Your workspace</p><h2>Tasks</h2></div></div>
          <TaskFilters filters={filters} onChange={setFilters} count={visibleTasks.length} />

          {loading ? (
            <div className="loading-list" aria-label="Loading tasks">{[1, 2, 3].map((n) => <div className="task-skeleton" key={n} />)}</div>
          ) : error ? (
            <div className="state-panel error-state"><RefreshCw size={28} /><h3>Couldn’t load your tasks</h3><p>{error}</p><button className="button button-secondary" onClick={loadTasks}>Try again</button></div>
          ) : visibleTasks.length ? (
            <div className="task-list">{visibleTasks.map((task) => <TaskCard key={task._id} task={task} onEdit={openEdit} onDelete={setDeleteTarget} onToggle={toggleTask} />)}</div>
          ) : (
            <div className="state-panel"><span className="empty-icon"><ClipboardList size={30} /></span><h3>{tasks.length ? 'No tasks match those filters' : 'A clear slate — nice.'}</h3><p>{tasks.length ? 'Try changing or clearing your filters.' : 'Create your first task and turn an intention into progress.'}</p>{!tasks.length && <button className="button button-primary" onClick={openCreate}><Plus size={18} /> Create first task</button>}</div>
          )}
        </section>
      </main>
      <footer className="site-footer"><span>TaskFlow</span><p>Small steps become meaningful progress.</p></footer>

      {modalOpen && <TaskModal task={modalTask} onClose={() => setModalOpen(false)} onSave={saveTask} saving={busy} />}
      {deleteTarget && <ConfirmDialog task={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={deleteTask} deleting={busy} />}
      {toast && <div className={`toast ${toast.type}`} role="status"><span>{toast.type === 'success' ? '✓' : '!'}</span>{toast.message}</div>}
    </>
  );
}
