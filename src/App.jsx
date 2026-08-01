import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PaginaCita from './pages/PaginaCita'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaCita />} />
        <Route path="/admin" element={<Navigate to="/admin/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
