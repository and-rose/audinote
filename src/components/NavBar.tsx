import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { getAuth, User, signOut } from "firebase/auth";
import StringAvatar from "./StringAvatar";
import { useNavigate } from "react-router-dom";

const pages = ["Home", "Collection"];

const ResponsiveAppBar = (props: { currentUser: User | null }) => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth={false}>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/Landing"
                        sx={{
                            mr: 5,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "Roboto",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        Audinote
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { md: "flex" },
                        }}
                    >
                        {pages.map((page) => (
                            <Button
                                key={page}
                                href={`/${page}`}
                                sx={{ my: 2, color: "white", display: "block" }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    {props.currentUser ? (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Account settings">
                                <IconButton sx={{ p: 0 }} onClick={handleClick}>
                                    <StringAvatar
                                        emailName={
                                            props.currentUser.displayName ?? ""
                                        }
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                            >
                                <MenuItem onClick={handleClose}>
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    My account
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        signOut(auth)
                                            .then(() => {
                                                // Sign-out successful.
                                                navigate("/Landing");
                                            })
                                            .catch((error) => {
                                                // An error happened.
                                            });
                                        handleClose();
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <>
                            <Button
                                href={"/Login"}
                                sx={{ my: 2, color: "white", display: "block" }}
                            >
                                Login
                            </Button>
                            <Button
                                href={"/Register"}
                                sx={{ my: 2, color: "white", display: "block" }}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;
