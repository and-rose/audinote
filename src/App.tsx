import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Home from "./pages/MainApp";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import ProtectedRoute from "./pages/PrivateRouter";

const defaultTheme = createTheme({
    palette: {
        background: {
            default: "#f5f5f5",
        },
    },
});

function App() {
    const auth = getAuth();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
    });

    return (
        <ThemeProvider theme={defaultTheme}>
            <BrowserRouter>
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
                    <Route path="/Landing" element={<Landing />} />
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
            </BrowserRouter>
        </ThemeProvider>
    );
}
export default App;
