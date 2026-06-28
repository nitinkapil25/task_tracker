import { Check, CircleDot, ListTodo, TrendingUp } from 'lucide-react';

export default function Stats({ tasks }) {
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const inProgress = tasks.filter((task) => task.status === 'in-progress').length;
  const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const cards = [
    { label: 'Total tasks', value: tasks.length, icon: ListTodo, tone: 'ink' },
    { label: 'In progress', value: inProgress, icon: CircleDot, tone: 'amber' },
    { label: 'Completed', value: completed, icon: Check, tone: 'green' },
    { label: 'Completion', value: `${percent}%`, icon: TrendingUp, tone: 'blue' },
  ];

  return (
    <section className="stats-grid" aria-label="Task overview">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <article className="stat-card" key={label}>
          <span className={`stat-icon ${tone}`}><Icon size={19} /></span>
          <div><p>{label}</p><strong>{value}</strong></div>
        </article>
      ))}
    </section>
  );
}
