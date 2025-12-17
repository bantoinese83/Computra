import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/step/1" replace />} />
        <Route path="/step/:stepId" element={<Questionnaire />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </HashRouter>
  );
};

export default App;


