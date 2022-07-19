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
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const pages = ["Home", "Help"];

const ResponsiveAppBar = (props: { currentUser: User | null | undefined }) => {
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
        <>
            <AppBar
                position="sticky"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    height: 69,
                }}
            >
                <Container maxWidth={false}>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#/Landing"
                            sx={{
                                mr: 5,
                                display: { xs: "none", md: "flex" },
                                fontFamily: "Roboto",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                                flexGrow: props.currentUser ? 0 : 1,
                            }}
                        >
                            Audinote
                        </Typography>
                        {props.currentUser ? (
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: { md: "flex" },
                                }}
                            >
                                {pages.map((page) => (
                                    <Button
                                        key={page}
                                        href={`#/${page}`}
                                        sx={{
                                            my: 2,
                                            color: "white",
                                            display: "block",
                                        }}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </Box>
                        ) : null}
                        {props.currentUser ? (
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Account settings">
                                    <IconButton
                                        sx={{ p: 0 }}
                                        onClick={handleClick}
                                    >
                                        <StringAvatar
                                            emailName={
                                                props.currentUser.displayName ??
                                                ""
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
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: "visible",
                                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                            mt: 1.5,
                                            "& .MuiAvatar-root": {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            "&:before": {
                                                content: '""',
                                                display: "block",
                                                position: "absolute",
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: "background.paper",
                                                transform:
                                                    "translateY(-50%) rotate(45deg)",
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{
                                        horizontal: "right",
                                        vertical: "top",
                                    }}
                                    anchorOrigin={{
                                        horizontal: "right",
                                        vertical: "bottom",
                                    }}
                                >
                                    <MenuItem onClick={handleClose}>
                                        <ListItemIcon>
                                            <AccountCircleIcon />
                                        </ListItemIcon>
                                        <ListItemText>Profile</ListItemText>
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
                                        <ListItemIcon>
                                            <LogoutIcon />
                                        </ListItemIcon>
                                        <ListItemText>Logout</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        ) : (
                            <>
                                <Button
                                    href={"#/Login"}
                                    sx={{
                                        my: 2,
                                        color: "white",
                                        display: "block",
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    href={"#/Register"}
                                    sx={{
                                        my: 2,
                                        color: "white",
                                        display: "block",
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};
export default ResponsiveAppBar;
