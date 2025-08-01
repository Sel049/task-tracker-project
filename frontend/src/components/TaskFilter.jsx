function TaskFilter({ filter, setFilter }) {
  return (
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
  );
}

export default TaskFilter;
