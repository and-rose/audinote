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
import { Box, IconButton, styled, Typography } from "@mui/material";
import CircularProgress, {
    CircularProgressProps,
} from "@mui/material/CircularProgress";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

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
                    <ListItem
                        key={track.title}
                        disablePadding
                        secondaryAction={
                            <IconButton>
                                <MoreHorizIcon />
                            </IconButton>
                        }
                    >
                        <ListItemButton
                            selected={selectedIndex === index}
                            onClick={(event) =>
                                handleListItemClick(event, index)
                            }
                        >
                            <ListItemIcon sx={{ alignContent: "center" }}>
                                {selectedIndex === index ? (
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
                            <TrackListItem track={track} uid={props.uid} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

const TrackListItem = (props: { track: any; uid: string }) => {
    const [commentCount, setCommentCount] = useState(0);

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
    );
};

export default TrackCollection;
