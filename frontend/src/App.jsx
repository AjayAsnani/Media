import './App.css'
import RegisterPage from './Screens/RegisterPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Screens/HomePage';
import AdminPage from './Screens/AdminPage';
import LoginPage from './Screens/LoginPage';
import ForgotePassword from './Screens/ForgotPassword';
import AccountPage from './Screens/AccountPage';
import PlanPage from './Screens/PlanPage';
import LegalDocumentPage from './Screens/LegalDocumentPage';
import NotFound from './components/NotFound';
import UploadImage from './Components/UploadImage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          // Changing the route from /image-converter to /image
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/image" element={<UploadImage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/Admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgotPassword" element={<ForgotePassword />} />
          <Route path="/accountPage" element={<AccountPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/legalDocument" element={<LegalDocumentPage />} />
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </Router>
    </>
  )
}

export default App
