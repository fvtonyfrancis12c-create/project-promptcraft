import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('PromptCraft AI: Initializing application...');

const rootElement = document.getElementById('root');
const heartbeat = document.getElementById('deployment-heartbeat');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    // Remove heartbeat after internal React cycle has likely started
    if (heartbeat) heartbeat.style.display = 'none';
    console.log('PromptCraft AI: Application rendered successfully.');
  } catch (error) {
    console.error('PromptCraft AI: Critical Initialization Error:', error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red; background: white; position: fixed; inset: 0; z-index: 9999;"><h1>Frontend Crash</h1><pre>${error.stack || error.message}</pre></div>`;
  }
} else {
  console.error('PromptCraft AI: Root element not found!');
  document.body.innerHTML += '<div style="color: red; padding: 20px;">CRITICAL ERROR: No #root element found.</div>';
}
