import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { MainRoute } from './Pages/Route/MainRoute/MainRoute';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MainRoute />
    </BrowserRouter>
  );
};

export default App;
