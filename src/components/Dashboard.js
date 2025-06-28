import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
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
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState(defaultTasks);
  const [points, setPoints] = useState(0);
  const [newTask, setNewTask] = useState('');
  const [undoStack, setUndoStack] = useState(null);
  const undoTimeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(undoTimeoutRef.current);
  }, []);

  const undoAction = useCallback(() => {
    if (!undoStack) return;
    const { action, task, prevDone } = undoStack;
    let newTasks, newPoints;

    if (action === 'delete') {
      newTasks = [...tasks, task].sort((a, b) => a.id - b.id);
      newPoints = task.done ? points + 10 : points;
    } else if (action === 'toggle') {
      newTasks = tasks.map(t =>
        t.id === task.id ? { ...t, done: prevDone } : t
      );
      newPoints = points + (prevDone ? 10 : -10);
    }

    setTasks(newTasks);
    setPoints(newPoints);
    setUndoStack(null);
    clearTimeout(undoTimeoutRef.current);
  }, [undoStack, tasks, points]);

  const toggleDone = useCallback((id) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(t => {
        if (t.id === id) {
          const updatedTask = { ...t, done: !t.done };
          const prevDone = t.done;
          const newPoints = points + (prevDone ? -10 : 10);

          setPoints(newPoints);
          setUndoStack({ action: 'toggle', task: updatedTask, prevDone });
          clearTimeout(undoTimeoutRef.current);
          undoTimeoutRef.current = setTimeout(() => setUndoStack(null), 5000);

          return updatedTask;
        }
        return t;
      });
      return newTasks;
    });
  }, [points]);

  const addTask = () => {
    if (newTask.trim() === '') return;
    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    const taskObj = { id: newId, task: newTask.trim(), done: false };
    setTasks([...tasks, taskObj]);
    setNewTask('');
  };

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

  const completedCount = tasks.filter(t => t.done).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const displayName = user?.displayName || user?.email;

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
          <h1>Welcome, {displayName}</h1>
          <button onClick={logout} className="logout-btn">Logout</button>
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
