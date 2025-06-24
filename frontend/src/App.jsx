import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateCampaignForm from './pages/CreateCampaignForm';
import CampaignList from './pages/CampaignList';
import MyCampaigns from './pages/MyCampaign';
import CampaignDetail from './pages/CampaignDetail';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-campaign" element={<CreateCampaignForm />} />
        <Route path="/all-campaigns" element={<CampaignList />} />
        <Route path="/my-campaigns" element={<MyCampaigns />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
