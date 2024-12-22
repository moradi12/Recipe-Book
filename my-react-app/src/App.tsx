// src/App.tsx
import { BrowserRouter as Router } from 'react-router-dom';
import { MainLayout } from './Layout/MainLayout/MainLayout';

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
