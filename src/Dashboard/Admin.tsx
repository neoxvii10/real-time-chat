import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Topbar from './scenes/global/Topbar';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Sidebar from './scenes/global/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './scenes/dashboard/Dashboard';
import Team from './scenes/team/Team';
import Contacts from './scenes/contacts/Contacts';
import "./Admin.css"
import Invoices from './scenes/invoices/Invoices';
import Form from './scenes/form/Form';
import Calendar from './scenes/calendar/Calendar';
import FAQ from './scenes/faq/FAQ';
import Bar from './scenes/bar/Bar';
import Pie from './scenes/pie/Pie';
import Line from './scenes/line/Line';
import Geography from './scenes/geography/Geography';
import AdminLogin from './authentications/AdminLogin';
import Report from './scenes/report/Report';
const AdminManagement = () => {
    const navigate = useNavigate();
    const isAuthenticated = () => {
        const accessToken = localStorage.getItem('accessToken');
        // Your authentication logic here, e.g., checking if the token is valid
        return accessToken;
    };

    useEffect(() => {
        // Check authentication before rendering the component
        if (!isAuthenticated()) {
            // Redirect to login if not authenticated
            navigate('/admin/login');
        }
    }, [navigate]);

    if(!isAuthenticated()) {
        return (
            <AdminLogin/>
        )
        }
    else {
        return (
            <Routes>
                <Route path="/login" element={<AdminLogin/>}/>
                <Route path="/*" element={<Admin/>}/>
            </Routes>
        )
    }
    }


const Admin= () => {
    const {theme, colorMode} = useMode();

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="admin">
                    <Sidebar />
                    <main className="content">
                        <Topbar/>
                        <Routes>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/team" element={<Team/>}/>
                            <Route path="/contacts" element={<Contacts/>}/>
                            <Route path="/invoices" element={<Invoices/>}/>
                            <Route path="/form" element={<Form/>}/>
                            <Route path="/bar" element={<Bar/>}/>
                            <Route path="/pie" element={<Pie/>}/>
                            <Route path="/line" element={<Line/>}/>
                            <Route path="/faq" element={<FAQ/>}/>
                            <Route path="/geography" element={<Geography/>}/>
                            <Route path="/calendar" element={<Calendar/>}/>
                            <Route path="/report" element={<Report/>}/>
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
};


export default AdminManagement;