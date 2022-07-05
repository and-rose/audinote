import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import {
    getAuth,
    setPersistence,
    signInWithEmailAndPassword,
    browserSessionPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

function Copyright(props: any) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://mui.com/">
                Audinote
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const paperStyle = {
    padding: 20,
    width: "40vmin",
    margin: "20px auto",
};

function Login() {
    const [errorMessage, setErrorMessage] = useState(null);
    const [loginLoading, setLoginLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const auth = getAuth();

        const data = new FormData(event.currentTarget);
        const username = data.get("email")!.toString();
        const password = data.get("password")!.toString();
        const remember = data.get("remember");
        console.log({
            email: username,
            password: password,
            remember: remember,
        });
        setPersistence(
            auth,
            remember === "on"
                ? browserLocalPersistence
                : browserSessionPersistence
        ).then(() => {
            setLoginLoading(true);
            signInWithEmailAndPassword(auth, username, password)
                .then(() => {
                    // Signed in
                    setLoginLoading(false);
                    navigate("/Home");
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    setErrorMessage(errorMessage);
                    setLoginLoading(false);
                });
        });
    };

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            height="90vh"
        >
            <Paper elevation={10} style={paperStyle}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ m: 3, bgcolor: "primary.main" }}>
                            <LoginIcon />
                        </Avatar>
                        <Typography component="h1" variant="h4">
                            Sign in
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{ mt: 1 }}
                        >
                            {errorMessage ? (
                                <Alert severity="error">{errorMessage}</Alert>
                            ) : null}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            <FormControlLabel
                                control={<Checkbox color="primary" />}
                                name="remember"
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loginLoading}
                                sx={{ mt: 2, mb: 3, p: 1 }}
                            >
                                {loginLoading ? (
                                    <CircularProgress
                                        color="inherit"
                                        size="1.8em"
                                    />
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/Register" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </Paper>
        </Grid>
    );
}

export default Login;
