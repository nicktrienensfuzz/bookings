import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import { PublicClientApplication } from '@azure/msal-browser';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
     <Routes>
      <Route path="/" element={<MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
     } />
     <Route path="/msauth" element={<MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
     } />
    </Routes>
   </Router>  
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
