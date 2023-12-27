import { BrowserRouter as Router, Routes, Route , Navigate} from 'react-router-dom';
import { publicRoutes, privateRoutes } from './Routes/Routes';
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

      </Routes>
    </Router>

  );
}

export default App;
