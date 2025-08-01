function TaskForm({ taskName, setTaskName, taskDescription, setTaskDescription, handleAddTask, error }) {
  return (
    <>
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
    </>
  );
}

export default TaskForm;
