import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    styled,
    Typography,
} from "@mui/material";
import CircularProgress, {
    CircularProgressProps,
} from "@mui/material/CircularProgress";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number }
) {
    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

const drawerWidth = 450;
const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
}));

const TrackCollection = (props: { tracks: any; uid: string }) => {
    const auth = getAuth();
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number
    ) => {
        setSelectedIndex(index);
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            PaperProps={{
                sx: {
                    mt: "70px",
                },
            }}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >
            <DrawerHeader>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Inventory2OutlinedIcon color={"inherit"} />
                    <Typography variant={"h5"} sx={{ fontWeight: 400, ml: 1 }}>
                        Collection
                    </Typography>
                </div>
            </DrawerHeader>
            <Divider />
            <List>
                {props.tracks.map((track, index) => (
                    <TrackListItem
                        track={track}
                        uid={props.uid}
                        index={index}
                        selected={selectedIndex === index}
                        handleSelectFunc={handleListItemClick}
                    />
                ))}
            </List>
        </Drawer>
    );
};

const TrackListItem = (props: {
    track: any;
    uid: string;
    index: number;
    selected: boolean;
    handleSelectFunc: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number
    ) => void;
}) => {
    const [commentCount, setCommentCount] = useState(0);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [profileMenu, setProfileMenu] = useState<null | HTMLElement>(null);

    function getCommentCount() {
        const q = collection(
            db,
            "user-tracks",
            props.uid,
            "tracks",
            props.track.tid,
            "comments"
        );
        getDocs(q)
            .then((response) => {
                const docs = response.docs.map((doc) => ({
                    id: doc.id,
                }));
                setCommentCount(docs.length);
            })
            .catch((error) => {
                console.log(error.message);
                setCommentCount(0);
            });
    }

    useEffect(() => {
        getCommentCount();
    }, [props.track]);

    return (
        <>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={profileMenu}
                open={Boolean(profileMenu)}
                onClose={() => setProfileMenu(null)}
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
                            transform: "translateY(-50%) rotate(45deg)",
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
                <MenuItem onClick={() => setProfileMenu(null)}>
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText>Info</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => setProfileMenu(null)}>
                    <ListItemIcon>
                        <DeleteIcon color={"error"} />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
            <ListItem
                key={props.track.title}
                disablePadding
                secondaryAction={
                    <IconButton
                        onClick={(e) => setProfileMenu(e.currentTarget)}
                    >
                        <MoreHorizIcon />
                    </IconButton>
                }
            >
                <ListItemButton
                    selected={props.selected}
                    onClick={(event) =>
                        props.handleSelectFunc(event, props.index)
                    }
                >
                    <ListItemIcon sx={{ alignContent: "center" }}>
                        {props.selected ? (
                            <MusicNoteIcon
                                color={"primary"}
                                fontSize={"large"}
                            />
                        ) : (
                            <CircularProgressWithLabel
                                value={Math.random() * 100}
                            />
                        )}
                    </ListItemIcon>
                    <ListItemText
                        primary={props.track.title}
                        primaryTypographyProps={{
                            width: "90%",
                            style: {
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            },
                        }}
                        secondary={commentCount + " comments"}
                    />
                </ListItemButton>
            </ListItem>
        </>
    );
};

export default TrackCollection;
