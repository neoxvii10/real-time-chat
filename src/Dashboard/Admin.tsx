import Topbar from './scenes/global/Topbar';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
const Admin= () => {
    const {theme, colorMode} = useMode();

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="admin">
                    <main className="content">
                        <Topbar/>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
};


export default Admin;