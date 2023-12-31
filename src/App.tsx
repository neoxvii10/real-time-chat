import { BrowserRouter as Router, Routes, Route , Navigate} from 'react-router-dom';
import { publicRoutes, privateRoutes } from './Routes/Routes';
import AdminManagement from './Dashboard/Admin';
import Signin from './Authentications/Signin/Signin'
import { useAuth } from './Hooks/AuthContext';

function App() {
  const {isLoggedIn} = useAuth();

  return (
    <Router>
      <Routes>
        {publicRoutes.map((router, index) => {
          const Page = router.component;
          return (
            <Route 
              key={index}
              path={router.path}
              element={<Page/>}
            />
          )
        })}
        {privateRoutes.map((router, index) => {
          const Page = router.component;
          return (
            <Route 
              key={index}
              path={router.path}
              element={isLoggedIn ? (
                <Page/>
              ) : (
                <Navigate to='/signin' />
              )}
            />
          )
        })}
        <Route path="/admin" element = {isLoggedIn ? <AdminManagement/> : <Navigate to='/admin/login' />}>
          <Route path='*'/>
        </Route>
      </Routes>
    </Router>

  );
}

export default App;
