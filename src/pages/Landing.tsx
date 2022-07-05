import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Typography from "@mui/material/Typography";
import React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";

const Landing = () => {
    return (
        <Box display="flex">
            <Box
                sx={{ width: "70vw", height: "100vh", bgcolor: "primary.main" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Stack direction={"row"} spacing={50}>
                    <Typography
                        variant="h1"
                        noWrap
                        component="a"
                        sx={{
                            display: { xs: "none", md: "flex" },
                            fontFamily: "Roboto",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            letterSpacing: ".7rem",
                            color: "white",
                            textDecoration: "none",
                        }}
                    >
                        Audinote <MusicNoteIcon fontSize="inherit" />
                    </Typography>
                </Stack>
            </Box>
            <Box
                sx={{
                    width: "30vw",
                    height: "100vh",
                    bgcolor: "#f5f5f5",
                }}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Stack
                    direction={"row"}
                    justifyContent="center"
                    alignItems="center"
                    spacing={5}
                >
                    <Button
                        href={"/Login"}
                        variant={"contained"}
                        size={"large"}
                        sx={{ my: 2, display: "block" }}
                    >
                        Login
                    </Button>
                    <Button
                        href={"/Register"}
                        variant={"contained"}
                        size={"large"}
                        sx={{ my: 2, display: "block" }}
                    >
                        Sign Up
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default Landing;
