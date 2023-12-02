import HomePage from './HomePage/HomePage';
import Signup from './Authentications/Signup/Signup'
import Signin from './Authentications/Signin/Signin'
import Redirect from './Authentications/Redirect/Redirect'
import ResetPassword from './Authentications/ResetPassword/ResetPassword';
import InputEmail from './Authentications/ResetPassword/InputEmail/InputEmail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:username" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/redirect/:username" element={<Redirect />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/email" element={<InputEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
