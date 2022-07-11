import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
    createUserWithEmailAndPassword,
    getAuth,
    updateProfile,
} from "firebase/auth";
import Alert from "@mui/material/Alert";
import validator from "validator";
import CircularProgress from "@mui/material/CircularProgress";
import passwordValidator from "password-validator";
import { useNavigate } from "react-router-dom";

const passwordSchema = new passwordValidator();
passwordSchema
    .is()
    .min(7)
    .is()
    .max(100)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits();

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

function Register() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [registerLoading, setRegisterLoading] = useState(false);

    const navigate = useNavigate();

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        confirmPasswordMatch();
        validatePassword(e);
    }

    function handleConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value);
        confirmPasswordMatch();
    }

    function confirmPasswordMatch() {
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
        } else {
            setErrorMessage(null);
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        const data = new FormData(event.currentTarget);
        const auth = getAuth();
        const email = data.get("email")!.toString();
        const displayName = data.get("displayName")!.toString().trim();
        const password = data.get("password")!.toString();

        console.log({
            email: email,
            password: password,
        });

        setRegisterLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: displayName,
                })
                    .then(() => {
                        // Profile updated!
                        setRegisterLoading(false);
                    })
                    .catch((error) => {
                        // An error occurred
                        setRegisterLoading(false);
                    });
                console.log(user);
                navigate("/Home");
                // ...
            })
            .catch((error) => {
                const errorMessage = error.message;
                setErrorMessage(errorMessage);
                setRegisterLoading(false);
            });
    };

    const validateEmail = (e: any) => {
        if (validator.isEmail(e.target.value)) {
            setErrorMessage(null);
        } else {
            setErrorMessage("Invalid email");
        }
    };

    const validatePassword = (e: any) => {
        const validateResults = passwordSchema.validate(e.target.value, {
            details: true,
            list: true,
        }) as any[];
        console.log(validateResults);
        if (validateResults.length === 0) {
            setErrorMessage(null);
        } else {
            setErrorMessage(validateResults[0].message);
        }
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
                        <Avatar sx={{ m: 3, bgcolor: "secondary.main" }}>
                            <AppRegistrationIcon />
                        </Avatar>
                        <Typography component="h1" variant="h4">
                            Register
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate={false}
                            sx={{ mt: 1 }}
                        >
                            {errorMessage ? (
                                <Alert severity="error">{errorMessage}</Alert>
                            ) : null}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="displayName"
                                label="Display Name"
                                name="displayName"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                onChange={validateEmail}
                                name="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                value={password}
                                required
                                fullWidth
                                label="Password"
                                onChange={handlePasswordChange}
                                name="password"
                                type="password"
                                id="password"
                            />
                            <TextField
                                margin="normal"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                                fullWidth
                                name="Confirm password"
                                label="Confirm password"
                                type="password"
                                id="confirmPassword"
                            />

                            <Button
                                type="submit"
                                disabled={registerLoading}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {registerLoading ? (
                                    <CircularProgress
                                        color="inherit"
                                        size="1.8em"
                                    />
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
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

export default Register;
