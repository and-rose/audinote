import Box from "@mui/material/Box";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Typography from "@mui/material/Typography";
import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { User } from "@firebase/auth";

const Landing = (props: { user: User | null | undefined }) => {
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
                {!props.user ? (
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
                            sx={{ my: 2 }}
                        >
                            Login
                        </Button>
                        <Button
                            href={"/Register"}
                            variant={"contained"}
                            size={"large"}
                            sx={{ my: 2 }}
                        >
                            Sign Up
                        </Button>
                    </Stack>
                ) : (
                    <Button
                        href={"/Home"}
                        variant={"contained"}
                        size={"large"}
                        sx={{ my: 2 }}
                        endIcon={<ArrowForwardIcon />}
                    >
                        Go to app
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default Landing;
