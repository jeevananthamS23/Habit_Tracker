'use client'; 
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import HabitRow from './HabitRow';
import styles from './styles/Dashboard.module.css'; 


export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabit, setEditingHabit] = useState(null); 
  const [modalError, setModalError] = useState('');

  
  const generateDates = useCallback(() => {
    const dates = [];
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - 3);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().slice(0, 10)); 
    }
    return dates;
  }, [currentDate]);

  const datesToDisplay = generateDates();

  
  const fetchHabits = useCallback(async () => {
    try {
      const response = await fetch('/api/habits');
      if (response.ok) {
        const data = await response.json();
        setHabits(data.habits);
      } else {
        console.error('Failed to fetch habits:', await response.json());
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  
  const handleSaveHabit = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!newHabitName.trim()) {
      setModalError('Habit name cannot be empty.');
      return;
    }

    try {
      let response;
      if (editingHabit) {
    
        response = await fetch(`/api/habits/${editingHabit._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newHabitName }),
        });
      } else {
        response = await fetch('/api/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newHabitName }),
        });
      }

      if (response.ok) {
        setNewHabitName('');
        setEditingHabit(null);
        setShowModal(false);
        fetchHabits(); 
      } else {
        const data = await response.json();
        setModalError(data.message || 'Failed to save habit.');
      }
    } catch (error) {
      console.error('Error saving habit:', error);
      setModalError('An unexpected error occurred.');
    }
  };


  const handleToggleComplete = async (habitId, date) => {
    try {
      const habitToUpdate = habits.find(h => h._id === habitId);
      if (!habitToUpdate) return;

      const isCurrentlyCompleted = habitToUpdate.completedDates.includes(date);
      const updatedCompletedDates = isCurrentlyCompleted
        ? habitToUpdate.completedDates.filter(d => d !== date)
        : [...habitToUpdate.completedDates, date];

      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedDates: updatedCompletedDates }),
      });

      if (response.ok) {
        setHabits(prevHabits =>
          prevHabits.map(h =>
            h._id === habitId ? { ...h, completedDates: updatedCompletedDates } : h
          )
        );
      } else {
        console.error('Failed to toggle habit completion:', await response.json());
      }
    } catch (error) {
      console.error('Error toggling habit completion:', error);
    }
  };


  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) {
      return; 
    }
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchHabits(); 
      } else {
        console.error('Failed to delete habit:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };


  const handleAddHabitClick = () => {
    setEditingHabit(null);
    setNewHabitName('');
    setModalError('');
    setShowModal(true);
  };

  
  const handleEditHabitClick = (habit) => {
    setEditingHabit(habit);
    setNewHabitName(habit.name);
    setModalError('');
    setShowModal(true);
  };

 
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHabit(null);
    setNewHabitName('');
    setModalError('');
  };


  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  return (
    <>
      <div className={styles.dashboardContainer}>
        <Sidebar habits={habits} onAddHabitClick={handleAddHabitClick} />
        <main className={styles.mainContent}>
          <div className={styles.dateNavigation}>
            <button onClick={goToPreviousWeek} className={styles.navButton}>
              &lt;
            </button>
            <div className={styles.dateDisplay}>
              {datesToDisplay.map((dateString) => {
                const date = new Date(dateString);
                const isCurrentDay = dateString === new Date().toISOString().slice(0, 10);
                return (
                  <div
                    key={dateString}
                    className={`${styles.dateColumn} ${isCurrentDay ? styles.currentDay : ''}`}
                  >
                   <span className={styles.dayOfWeek}>
  {date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase()}
</span>
<span className={styles.dayOfMonth}>
  {date.getDate()}
</span>
<span className={styles.monthName}>
  {date.toLocaleString('en-US', { month: 'short' })}
</span>

                  </div>
                );
              })}
            </div>
            <button onClick={goToNextWeek} className={styles.navButton}>
              &gt;
            </button>
          </div>
          <div className={styles.habitList}>
            {habits.length === 0 ? (
              <p className={styles.noHabitsMessage}>No habits yet. Click "+ New Habit" to add one!</p>
            ) : (
              habits.map((habit) => (
                <HabitRow
                  key={habit._id}
                  habit={habit}
                  dates={datesToDisplay}
                  onToggleComplete={handleToggleComplete}
                  onEditHabit={handleEditHabitClick}
                  onDeleteHabit={handleDeleteHabit}
                />
              ))
            )}
          </div>
        </main>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <button onClick={handleCloseModal} className={styles.closeButton}>
                &times;
              </button>
              <h2 className={styles.modalTitle}>{editingHabit ? 'Edit Habit' : 'Add New Habit'}</h2>
              <form onSubmit={handleSaveHabit}>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Habit Name"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  required
                />
                {modalError && <p className={styles.modalError}>{modalError}</p>}
                <button type="submit" className={styles.modalButton}>
                  {editingHabit ? 'Update Habit' : 'Add Habit'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
