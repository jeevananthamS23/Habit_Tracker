'use client';

import styles from './styles/HabitRow.module.css';
export default function HabitRow({ habit, dates, onToggleComplete, onEditHabit, onDeleteHabit }) {

  const isCompleted = (date) => habit.completedDates.includes(date);

  return (
    <div className={styles.habitRow}>
      <div className={styles.habitControls}>
        <button onClick={() => onEditHabit(habit)} className={styles.controlButton}>
          ✏️
        </button>
        <button onClick={() => onDeleteHabit(habit._id)} className={styles.controlButton}>
          🗑️
        </button>
      </div>
      <span className={styles.habitName}>{habit.name}</span>
      <div className={styles.dateGrid}>
        {dates.map((date) => (
          <div
            key={date}
            className={`${styles.dateCell} ${isCompleted(date) ? styles.completed : ''}`}
            onClick={() => onToggleComplete(habit._id, date)}
          >
    
            {isCompleted(date) ? '✔️' : new Date(date).getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}
