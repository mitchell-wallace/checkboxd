import './App.css'
import { TaskServiceProvider } from './contexts/TaskServiceContext';
import { Layout } from './Layout';

function App() {
  return (
    <TaskServiceProvider>
        <Layout />
    </TaskServiceProvider>
  );
}

export default App;
