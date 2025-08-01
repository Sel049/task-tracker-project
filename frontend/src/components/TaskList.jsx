import TaskItem from './TaskItem';

function TaskList({ filteredTasks, handleToggleComplete, handleDeleteTask }) {
  return (
    <ul className="w-full space-y-4">
      {filteredTasks.length === 0 && (
        <li className="text-gray-400 text-center py-8">No tasks yet. Add your first task!</li>
      )}
      {filteredTasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          handleToggleComplete={handleToggleComplete}
          handleDeleteTask={handleDeleteTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;
