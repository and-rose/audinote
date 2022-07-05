import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Home from "./pages/MainApp";
import Register from "./pages/Register";
import Landing from "./pages/Landing";

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
                <NavBar currentUser={user} />
                <Routes>
                    <Route path={"/"} element={<Home />} />
                    <Route path={"/Home"} element={<Home />} />
                    <Route path="/Landing" element={<Landing />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Register" element={<Register />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
export default App;
