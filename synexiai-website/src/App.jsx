import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
// Future: import AboutPage, ProjectPage, VisionPage

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Future routes */}
      </Routes>
      <Footer />
    </Router>
  );
}
