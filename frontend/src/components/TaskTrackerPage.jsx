import { useEffect, useState } from 'react';
import Header from './Header';
import TaskForm from './TaskForm';
import MotivationMessage from './MotivationMessage';
import TaskFilter from './TaskFilter';
import TaskList from './TaskList';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TaskTrackerPage() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [motivation, setMotivation] = useState('');

  const motivationalMessages = [
    "Great job! Keep up the good work!",
    "Another task down, you're on a roll!",
    "You're making awesome progress!",
    "Way to go! Every step counts.",
    "Fantastic! Keep crushing those tasks!",
    "Success is built one task at a time!",
    "You did it! Celebrate your wins!"
  ];

  // ✅ Fetch tasks on load
  useEffect(() => {
    fetch(`${BASE_URL}/tasks`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.error("Expected array but got:", data);
          setError("Unexpected response format.");
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load tasks.');
      });
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskName.trim() || !taskDescription.trim()) {
      setError('Task name and description cannot be empty.');
      return;
    }
    if (taskName.length > 50) {
      setError('Task name is too long (max 50 characters).');
      return;
    }

    const newTask = {
      title: taskName,
      description: taskDescription,
      completed: false
    };

    fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    })
      .then(res => res.json())
      .then(addedTask => {
        setTasks(prev => [...prev, addedTask]);
        setTaskName('');
        setTaskDescription('');
        setError('');
      })
      .catch(err => setError('Failed to add task.'));
  };

  const handleToggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updated = { ...task, completed: !task.completed };

    fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(res => res.json())
      .then(data => {
        setTasks(tasks.map(t => t.id === id ? data : t));
        if (!task.completed) {
          const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
          setMotivation(msg);
          setTimeout(() => setMotivation(''), 2500);
        }
      });
  };

  const handleDeleteTask = (id) => {
    fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id));
      });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center py-10 px-2">
      <Header />
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 border border-blue-100">
        <TaskForm
          taskName={taskName}
          setTaskName={setTaskName}
          taskDescription={taskDescription}
          setTaskDescription={setTaskDescription}
          handleAddTask={handleAddTask}
          error={error}
        />
        <MotivationMessage motivation={motivation} />
        <TaskFilter filter={filter} setFilter={setFilter} />
        <h2 className="text-xl font-bold mb-4 text-gray-700">Task List</h2>
        <TaskList
          filteredTasks={filteredTasks}
          handleToggleComplete={handleToggleComplete}
          handleDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}

export default TaskTrackerPage;
