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
                            <Route path="/form" element={<Dashboard/>}/>
                            <Route path="/bar" element={<Dashboard/>}/>
                            <Route path="/pie" element={<Dashboard/>}/>
                            <Route path="/line" element={<Dashboard/>}/>
                            <Route path="/faq" element={<Dashboard/>}/>
                            <Route path="/geography" element={<Dashboard/>}/>
                            <Route path="/calendar" element={<Dashboard/>}/>
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
};


export default Admin;