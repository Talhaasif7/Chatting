import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
    },
    typography: {
        fontFamily: 'Arial',
        button: {
            textTransform: 'none',
        },
    },
});

export default theme;