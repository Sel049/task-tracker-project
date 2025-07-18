import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
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
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      priority: "Medium",
      completed: false
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setTaskName('');
    setTaskDescription('');
    setError('');
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    const toggledTask = tasks.find(task => task.id === id);
    if (toggledTask && !toggledTask.completed) {
      const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setMotivation(msg);
      setTimeout(() => setMotivation(''), 2500);
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center py-10 px-2">
      {/* Modern Header */}
      <header className="w-full max-w-2xl mb-8">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight drop-shadow">Task Tracker</h1>
        </div>
        <p className="text-gray-500 text-lg">Stay organized and motivated. Track your tasks with ease!</p>
      </header>
      {/* Card Container */}
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 border border-blue-100">
        {error && <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded border border-red-300 w-full text-center">{error}</div>}
        <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4 mb-6 w-full">
          <input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Task Name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
          />
          <input
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Description"
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
          />
          <button
            type="submit"
            disabled={!taskName.trim() || !taskDescription.trim() || taskName.length > 50}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow"
          >
            Add Task
          </button>
        </form>
        {motivation && (
          <div className="mb-4 px-4 py-2 bg-green-100 text-green-700 rounded border border-green-300 w-full text-center animate-fade-in">
            {motivation}
          </div>
        )}
        <div className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg border font-medium ${filter === 'all' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'} transition`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg border font-medium ${filter === 'completed' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 border-gray-300'} transition`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg border font-medium ${filter === 'pending' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-700 border-gray-300'} transition`}
          >
            Pending
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4 text-gray-700">Task List</h2>
        <ul className="w-full space-y-4">
          {filteredTasks.length === 0 && (
            <li className="text-gray-400 text-center py-8">No tasks yet. Add your first task!</li>
          )}
          {filteredTasks.map(task => (
            <li
              key={task.id}
              className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl shadow-sm bg-gray-50 border-l-4 ${task.completed ? 'border-green-500 opacity-70' : 'border-blue-400'}`}
            >
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-900 mb-1">{task.name}</div>
                <div className="text-gray-700 mb-1">{task.description}</div>
                <div className="text-sm text-gray-500">(Priority: {task.priority})</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className={`px-3 py-1 rounded-lg font-medium transition shadow-sm ${task.completed ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
                >
                  {task.completed ? "Mark Pending" : "Mark Completed"}
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition shadow-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
