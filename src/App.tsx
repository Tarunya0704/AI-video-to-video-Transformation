import React from 'react';
import TransformPage from './pages/TransformPage';
import { VideoProvider } from './context/VideoContext';

function App() {
  return (
    <VideoProvider>
      <TransformPage />
    </VideoProvider>
  );
}

export default App;