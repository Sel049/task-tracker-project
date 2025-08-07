function TaskItem({ task, handleToggleComplete, handleDeleteTask }) {
  return (
    <li
      className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl shadow-sm bg-gray-50 border-l-4 ${task.completed ? 'border-green-500 opacity-70' : 'border-blue-400'}`}
    >
      <div className="flex-1">
        <div className="font-bold text-lg text-gray-900 mb-1">{task.title}</div>
        <div className="text-gray-700 mb-1">{task.description}</div>
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
  );
}

export default TaskItem;
