import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Home from "./pages/MainApp";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import ProtectedRoute from "./pages/PrivateRouter";
import { useAuthState } from "react-firebase-hooks/auth";

const defaultTheme = createTheme({
    palette: {
        background: {
            default: "#f5f5f5",
        },
    },
});

function App() {
    const auth = getAuth();

    const [user, loading] = useAuthState(auth);

    return (
        <ThemeProvider theme={defaultTheme}>
            <BrowserRouter>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <Routes>
                        <Route
                            path={"/"}
                            element={
                                <ProtectedRoute user={user}>
                                    <NavBar currentUser={user} />
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={"/Home"}
                            element={
                                <ProtectedRoute user={user}>
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
                                    <NavBar currentUser={user} />
                                    <Login />
                                </>
                            }
                        />
                        <Route
                            path="/Register"
                            element={
                                <>
                                    <NavBar currentUser={user} />
                                    <Register />
                                </>
                            }
                        />
                    </Routes>
                )}
            </BrowserRouter>
        </ThemeProvider>
    );
}
export default App;
