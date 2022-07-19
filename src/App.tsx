import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Home from "./pages/MainApp";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import ProtectedRoute from "./pages/PrivateRouter";
import { useAuthState } from "react-firebase-hooks/auth";
import CssBaseline from "@mui/material/CssBaseline";

const defaultTheme = createTheme({
    palette: {
        background: {
            default: "#f5f5f5",
        },
    },
    components: {
        MuiListItem: {
            styleOverrides: {
                root: {
                    ".Mui-selected": {
                        backgroundColor: "rgba(25, 118, 210, 0.25)",
                    },
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                },
            },
        },
    },
});

function App() {
    const auth = getAuth();

    const [user, loading] = useAuthState(auth);
    const [collectionOpen, setCollectionOpen] = React.useState(false);

    const handleCollectionOpen = () => {
        setCollectionOpen(true);
    };

    const handleCollectionClose = () => {
        setCollectionOpen(false);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <HashRouter>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <Routes>
                        <Route
                            path={"/"}
                            element={
                                <ProtectedRoute user={user}>
                                    <CssBaseline />
                                    <NavBar currentUser={user} />
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={"/Home"}
                            element={
                                <ProtectedRoute user={user}>
                                    <CssBaseline />
                                    <NavBar currentUser={user} />
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/Landing"
                            element={<Landing user={user} />}
                        />
                        <Route
                            path="/Login"
                            element={
                                <>
                                    <CssBaseline />
                                    <NavBar currentUser={user} />
                                    <Login />
                                </>
                            }
                        />
                        <Route
                            path="/Register"
                            element={
                                <>
                                    <CssBaseline />
                                    <NavBar currentUser={user} />
                                    <Register />
                                </>
                            }
                        />
                    </Routes>
                )}
            </HashRouter>
        </ThemeProvider>
    );
}
export default App;
