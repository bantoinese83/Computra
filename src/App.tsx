import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <div key={location.pathname} className="animate-in fade-in duration-300">
      <Routes location={location}>
        <Route path="/" element={<Navigate to="/step/1" replace />} />
        <Route path="/step/:stepId" element={<Questionnaire />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
};

export default App;


