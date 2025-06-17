import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateCampaignForm from './pages/CreateCampaignForm';
import CampaignList from './pages/CampaignList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-campaign" element={<CreateCampaignForm />} />
        <Route path="/all-campaigns" element={<CampaignList />} />
      </Routes>
    </Router>
  );
}

export default App;
