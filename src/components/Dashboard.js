import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

const defaultTasks = [
  { id: 1, task: 'Complete project milestones', done: false },
  { id: 2, task: 'Attend meetings & update team', done: false },
  { id: 3, task: 'Review code and push commits', done: false },
  { id: 4, task: "Plan next day's tasks", done: false },
  { id: 5, task: 'Drink enough water', done: false },
  { id: 6, task: 'Do 5-10 minutes stretching', done: false },
  { id: 7, task: 'Take short breaks every hour', done: false },
  { id: 8, task: 'Prepare and eat a healthy meal', done: false },
  { id: 9, task: 'Avoid screen for 30 mins after work', done: false },
  { id: 10, task: 'Sleep at least 8 hours', done: false },
  { id: 11, task: 'Practice Kali Linux or related skills', done: false },
  { id: 12, task: 'Read a technical article or book', done: false },
  { id: 13, task: 'Watch tutorial or online course', done: false },
  { id: 14, task: 'Write a quick daily journal / notes', done: false },
  { id: 15, task: 'Visualize your goals & stay positive', done: false },
  { id: 16, task: 'Avoid unnecessary distractions', done: false }
];

const Dashboard = () => {
  const [tasks, setTasks] = useState(defaultTasks);
  const [points, setPoints] = useState(0);
  const [newTask, setNewTask] = useState('');
  const [undoStack, setUndoStack] = useState(null);
  const undoTimeoutRef = useRef(null);

  // Undo timer cleanup
  useEffect(() => {
    return () => clearTimeout(undoTimeoutRef.current);
  }, []);

  // Toggle task completion
  const toggleDone = (id) => {
    setTasks(prevTasks => {
      let updatedTask;
      const newTasks = prevTasks.map(t => {
        if (t.id === id) {
          updatedTask = { ...t, done: !t.done };
          return updatedTask;
        }
        return t;
      });

      if (updatedTask) {
        const prevDone = !updatedTask.done;
        const newPoints = points + (prevDone ? -10 : 10);
        setPoints(newPoints);
        setUndoStack({ action: 'toggle', task: updatedTask, prevDone });
        clearTimeout(undoTimeoutRef.current);
        undoTimeoutRef.current = setTimeout(() => setUndoStack(null), 5000);
      }

      return newTasks;
    });
  };

  // Add a new task
  const addTask = () => {
    if (newTask.trim() === '') return;
    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    const taskObj = { id: newId, task: newTask.trim(), done: false };
    const newTasks = [...tasks, taskObj];
    setTasks(newTasks);
    setNewTask('');
  };

  // Delete a task
  const deleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;
    const newTasks = tasks.filter(t => t.id !== id);
    const newPoints = taskToDelete.done ? points - 10 : points;
    setTasks(newTasks);
    setPoints(newPoints);
    setUndoStack({ action: 'delete', task: taskToDelete });
    clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => setUndoStack(null), 5000);
  };

  // Undo last action
  const undoAction = () => {
    if (!undoStack) return;
    if (undoStack.action === 'delete') {
      const newTasks = [...tasks, undoStack.task].sort((a, b) => a.id - b.id);
      const newPoints = undoStack.task.done ? points + 10 : points;
      setTasks(newTasks);
      setPoints(newPoints);
    } else if (undoStack.action === 'toggle') {
      const newTasks = tasks.map(t =>
        t.id === undoStack.task.id ? { ...t, done: undoStack.prevDone } : t
      );
      const newPoints = points + (undoStack.prevDone ? 10 : -10);
      setTasks(newTasks);
      setPoints(newPoints);
    }
    setUndoStack(null);
    clearTimeout(undoTimeoutRef.current);
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="points-display">
          Points: {points} | Progress: {progress}%
        </div>

        <div className="dashboard-header">
          <nav>
            <a href="/about" className="profile-nav" title="About Me">
              &#9432;
            </a>
          </nav>
          <h1>Welcome</h1>
          <button className="logout-btn">
            Logout
          </button>
        </div>

        <h2>Your Daily Tasks</h2>

        <div className="add-task">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') addTask();
            }}
          />
          <button onClick={addTask}>Add</button>
        </div>

        {undoStack && (
          <div className="undo-bar" onClick={undoAction} title="Undo last action">
            Undo last action
          </div>
        )}

        <ul className="task-list">
          {tasks.map(t => (
            <li key={t.id} className={`task-item ${t.done ? 'done' : ''}`}>
              <label>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleDone(t.id)}
                />
                <span className="text">{t.task}</span>
              </label>
              <button
                className="delete-btn"
                onClick={() => deleteTask(t.id)}
                aria-label="Delete task"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
