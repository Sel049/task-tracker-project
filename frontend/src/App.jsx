
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskTrackerPage from './components/TaskTrackerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskTrackerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
