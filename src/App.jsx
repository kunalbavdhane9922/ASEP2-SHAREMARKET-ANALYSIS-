import './App.css';
// import Home from './components/Home';
import PatternDashboard from "./components/PatternDashboard";
import ChatApp from './components/ChatApp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import FirstPage from './components/firstpage';
import News from './components/News';
import Watchlist from './components/Watchlist';
// import Navbar from './components/Navbar';
function App() {
  return (
    <>
    {/* <Navbar></Navbar> */}
      <Router>
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/chatbot" element={<ChatApp />} />
          <Route path="/prediction" element={<PatternDashboard />} />
          <Route path="/news" element={<News />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
