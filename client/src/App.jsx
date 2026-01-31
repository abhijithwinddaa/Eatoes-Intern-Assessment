import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/layout';
import { Dashboard, MenuManagement, OrdersDashboard, Analytics } from './pages';
import './styles/theme.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/orders" element={<OrdersDashboard />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            fontSize: '14px'
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#1a1a1a'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1a1a1a'
            }
          }
        }}
      />
    </BrowserRouter>
  );
}

export default App;
