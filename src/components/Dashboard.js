// Dashboard.js
import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { AuthContext } from '../context/AuthContext';

const defaultTasks = [
  { id: 1, task: 'Complete project milestones', category: 'Productivity', done: false },
  { id: 2, task: 'Attend meetings & update team', category: 'Productivity', done: false },
  { id: 3, task: 'Review code and push commits', category: 'Productivity', done: false },
  { id: 4, task: "Plan next day's tasks", category: 'Productivity', done: false },
  { id: 5, task: 'Drink enough water', category: 'Wellness', done: false },
  { id: 6, task: 'Do 5-10 minutes stretching', category: 'Wellness', done: false },
  { id: 7, task: 'Take short breaks every hour', category: 'Wellness', done: false },
  { id: 8, task: 'Prepare and eat a healthy meal', category: 'Wellness', done: false },
  { id: 9, task: 'Avoid screen for 30 mins after work', category: 'Wellness', done: false },
  { id: 10, task: 'Sleep at least 8 hours', category: 'Wellness', done: false },
  { id: 11, task: 'Practice Kali Linux or related skills', category: 'Learning', done: false },
  { id: 12, task: 'Read a technical article or book', category: 'Learning', done: false },
  { id: 13, task: 'Watch tutorial or online course', category: 'Learning', done: false },
  { id: 14, task: 'Write a quick daily journal / notes', category: 'Mindfulness', done: false },
  { id: 15, task: 'Visualize your goals & stay positive', category: 'Mindfulness', done: false },
  { id: 16, task: 'Avoid unnecessary distractions', category: 'Mindfulness', done: false }
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
      newTasks = tasks.map(t => t.id === task.id ? { ...t, done: prevDone } : t);
      newPoints = points + (prevDone ? 10 : -10);
    }

    setTasks(newTasks);
    setPoints(newPoints);
    setUndoStack(null);
    clearTimeout(undoTimeoutRef.current);
  }, [undoStack, tasks, points]);

  const toggleDone = useCallback((id) => {
    setTasks(prevTasks =>
      prevTasks.map(t => {
        if (t.id === id) {
          const updatedTask = { ...t, done: !t.done };
          const prevDone = t.done;
          setPoints(prev => prev + (prevDone ? -10 : 10));
          setUndoStack({ action: 'toggle', task: updatedTask, prevDone });
          clearTimeout(undoTimeoutRef.current);
          undoTimeoutRef.current = setTimeout(() => setUndoStack(null), 5000);
          return updatedTask;
        }
        return t;
      })
    );
  }, []);

  const addTask = () => {
    if (newTask.trim() === '') return;
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const taskObj = { id: newId, task: newTask.trim(), category: 'Custom', done: false };
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

  const groupedTasks = tasks.reduce((acc, task) => {
    const category = task.category || 'Others';
    if (!acc[category]) acc[category] = [];
    acc[category].push(task);
    return acc;
  }, {});

  const radius = 50;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-progress-wrapper">
          <div className="progress-circle-container">
            <svg height={radius * 2} width={radius * 2} className="progress-ring">
              <circle
                stroke="#003344"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#00ffff"
                fill="transparent"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="progress-ring__circle"
              />
              <text
                x="50%"
                y="50%"
                className="progress-ring__text"
              >
                {progress}%
              </text>
            </svg>
          </div>
          <div className="points-display">Points: {points}</div>
        </div>

        <div className="dashboard-header">
          <h1>Welcome, {displayName}</h1>
          <button onClick={logout} className="logout-btn">Logout</button>
          <Link to="/about" className="profile-icon">
            <i className="fas fa-info-circle"></i>
          </Link>
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

        {Object.entries(groupedTasks).map(([category, taskList]) => (
          <div key={category} className="task-category-group">
            <h3 className="task-category-title">{category}</h3>
            <ul className="task-list">
              {taskList.map(t => (
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
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
