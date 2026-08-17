import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard   from './pages/Dashboard'
import AnalyzePage from './pages/AnalyzePage'
import AlertsPage  from './pages/AlertsPage'
import HistoryPage from './pages/HistoryPage'
import MarketPage  from './pages/MarketPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/mandi" element={<Layout><MarketPage /></Layout>} />
      <Route path="/analyze" element={<Layout><AnalyzePage /></Layout>} />
      <Route path="/alerts" element={<Layout><AlertsPage /></Layout>} />
      <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
      
      {/* Catch-all redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}