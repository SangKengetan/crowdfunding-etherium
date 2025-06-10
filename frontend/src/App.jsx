import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateCampaignForm from './pages/CreateCampaignForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-campaign" element={<CreateCampaignForm />} />
      </Routes>
    </Router>
  );
}

export default App;
