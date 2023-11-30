import HomePage from './HomePage/HomePage';
import Signup from './Authentications/Signup/Signup'
import Signin from './Authentications/Signin/Signin'
import Redirect from './Authentications/Redirect/Redirect'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './Dashboard/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:username" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/redirect/:username" element={<Redirect />} />
        <Route path="/admin" element = {<Admin/>} />
      </Routes>
    </Router>
  );
}

export default App;
