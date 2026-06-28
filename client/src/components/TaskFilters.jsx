import { Search, SlidersHorizontal } from 'lucide-react';

export default function TaskFilters({ filters, onChange, count }) {
  return (
    <section className="filters" aria-label="Task filters">
      <div className="search-wrap">
        <Search size={18} />
        <input
          aria-label="Search tasks"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
      </div>
      <div className="filter-controls">
        <SlidersHorizontal size={17} className="filter-icon" />
        <select
          aria-label="Filter by status"
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value })}
        >
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          aria-label="Filter by priority"
          value={filters.priority}
          onChange={(event) => onChange({ ...filters, priority: event.target.value })}
        >
          <option value="all">All priorities</option>
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </select>
        <select
          aria-label="Sort tasks"
          value={filters.sort}
          onChange={(event) => onChange({ ...filters, sort: event.target.value })}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="due">Due date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      <p className="result-count">{count} {count === 1 ? 'task' : 'tasks'}</p>
    </section>
  );
}
