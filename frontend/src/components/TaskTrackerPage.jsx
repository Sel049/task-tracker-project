import { useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL; 

// Statistics Card Component
function StatsCard({ icon, title, value, color, percentage }) {
  return (
    <div className="bg-white/90 rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {percentage !== undefined && (
            <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Progress Bar Component
function ProgressBar({ percentage, color = 'blue' }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div 
        className={`bg-${color}-600 h-3 rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}

// Welcome Message Component
function WelcomeMessage({ username, tasksCount, completedCount }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    if (tasksCount === 0) return "Ready to start your productive day?";
    if (completedCount === 0) return "Let's tackle those tasks!";
    if (completedCount === tasksCount) return "Amazing! You've completed all tasks! 🎉";
    const percentage = Math.round((completedCount / tasksCount) * 100);
    if (percentage >= 75) return "You're almost there! Keep it up! 💪";
    if (percentage >= 50) return "Great progress so far! 👏";
    return "Every step counts. You've got this! 🚀";
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
      <h1 className="text-2xl font-bold mb-2">
        {getGreeting()}, {username}! 👋
      </h1>
      <p className="text-blue-100 text-lg">
        {getMotivationalMessage()}
      </p>
    </div>
  );
}

// Main Dashboard Component
function EnhancedTaskTracker() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({ username: 'User' });
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [motivation, setMotivation] = useState('');
  const [loading, setLoading] = useState(true);

  const motivationalMessages = [
    "Great job! Keep up the good work!",
    "Another task down, you're on a roll!",
    "You're making awesome progress!",
    "Way to go! Every step counts.",
    "Fantastic! Keep crushing those tasks!",
    "Success is built one task at a time!",
    "You did it! Celebrate your wins!"
  ];

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Fetch user info and tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user info 
        const userResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
          credentials: 'include'
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser({
            username: userData.username || 'User' 
          });
        } else {
          console.error('Profile fetch failed:', userResponse.status);
        }

        // Fetch tasks
        const tasksResponse = await fetch(`${BASE_URL}/api/tasks`, {
          credentials: 'include'
        });
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          if (Array.isArray(tasksData)) {
            setTasks(tasksData);
          }
        } else if (tasksResponse.status === 401) {
          window.location.href = '/';
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTask = async (e) => {
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

    try {
      const response = await fetch(`${BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newTask)
      });

      if (response.ok) {
        const addedTask = await response.json();
        setTasks(prev => [...prev, addedTask]);
        setTaskName('');
        setTaskDescription('');
        setError('');
      } else {
        setError('Failed to add task.');
      }
    } catch (err) {
      setError('Failed to add task.');
    }
  };

  const handleToggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updated = { ...task, completed: !task.completed };

    try {
      const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updated)
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(tasks.map(t => t.id === id ? data : t));
        if (!task.completed) {
          const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
          setMotivation(msg);
          setTimeout(() => setMotivation(''), 2500);
        }
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      window.location.href = '/';
    } catch (err) {
      window.location.href = '/';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Task Tracker</h1>
              <p className="text-sm text-gray-600">Stay organized and motivated</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <WelcomeMessage 
          username={user.username} 
          tasksCount={totalTasks}
          completedCount={completedTasks}
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title="Total Tasks"
            value={totalTasks}
            color="text-blue-600"
          />
          <StatsCard
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
            title="Completed"
            value={completedTasks}
            color="text-green-600"
            percentage={completionPercentage}
          />
          <StatsCard
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>}
            title="Pending"
            value={pendingTasks}
            color="text-orange-600"
          />
          <StatsCard
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>}
            title="Progress"
            value={`${completionPercentage}%`}
            color="text-purple-600"
          />
        </div>

        {/* Progress Bar */}
        {totalTasks > 0 && (
          <div className="bg-white/90 rounded-xl shadow-md p-6 mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-700">Overall Progress</h3>
              <span className="text-sm font-medium text-gray-500">{completedTasks} of {totalTasks} completed</span>
            </div>
            <ProgressBar percentage={completionPercentage} color="blue" />
          </div>
        )}

        {/* Main Content Area */}
        <div className="bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 border border-blue-100">
          {/* Task Form */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Add New Task</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Task Name"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength="50"
              />
              <input
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Description"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddTask}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
              >
                Add Task
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Motivation Message */}
          {motivation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-pulse">
              <p className="text-green-700 font-medium">{motivation}</p>
            </div>
          )}

          {/* Task Filter */}
          <div className="flex gap-2 mb-6 justify-center">
            {['all', 'completed', 'pending'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                  filter === filterType
                    ? filterType === 'all' ? 'bg-blue-500 text-white border-blue-500'
                      : filterType === 'completed' ? 'bg-green-500 text-white border-green-500'
                      : 'bg-yellow-500 text-white border-yellow-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-700">Task List</h2>
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-gray-400 text-center py-12">
                  {filter === 'all' ? 'No tasks yet. Add your first task!' : 
                   filter === 'completed' ? 'No completed tasks yet.' : 
                   'No pending tasks. Great job!'}
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl shadow-sm bg-gray-50 border-l-4 transition-all hover:shadow-md ${
                      task.completed ? 'border-green-500 opacity-70' : 'border-blue-400'
                    }`}
                  >
                    <div className="flex-1">
                      <div className={`font-bold text-lg mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </div>
                      <div className={`mb-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {task.description}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleComplete(task.id)}
                        className={`px-3 py-1 rounded-lg font-medium transition-all shadow-sm ${
                          task.completed 
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {task.completed ? "Mark Pending" : "Mark Completed"}
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition-all shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedTaskTracker;