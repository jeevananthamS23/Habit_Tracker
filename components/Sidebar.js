'use client'; 
import styles from './styles/Sidebar.module.css';
export default function Sidebar({ habits, onAddHabitClick, onSelectHabit }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <span className={styles.filterIcon}>☰</span>
        <span className={styles.allHabitsText}>ALL HABITS</span>
      </div>

      <ul className={styles.habitList}>
        {habits.map((habit) => (
          <li key={habit._id} className={styles.habitItem} onClick={() => onSelectHabit && onSelectHabit(habit)}>
            <span className={styles.habitIcon}>✅</span>
            <span className={styles.habitName}>{habit.name}</span>
          </li>
        ))}
      </ul>

      <button onClick={onAddHabitClick} className={styles.addHabitButton}>
        + New Habit
      </button>
    </aside>
  );
}
