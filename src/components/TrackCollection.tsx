import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Box, IconButton, styled, Toolbar, useTheme } from "@mui/material";
import CircularProgress, {
    CircularProgressProps,
} from "@mui/material/CircularProgress";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const drawerWidth = 300;

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

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
}));

const TrackCollection = () => {
    const [selectedIndex, setSelectedIndex] = useState(1);

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
                    <Inventory2OutlinedIcon />
                    <Typography variant={"h5"} sx={{ fontWeight: 400, ml: 1 }}>
                        Collection
                    </Typography>
                </div>
            </DrawerHeader>
            <Divider />

            <List>
                {[
                    "Track 1",
                    "Track 2",
                    "Track 3",
                    "Track 4",
                    "Track 1",
                    "Track 2",
                    "Track 3",
                    "Track 4",
                    "Track 1",
                    "Track 2",
                    "Track 3",
                    "Track 4",
                    "Track 1",
                    "Track 2",
                    "Track 3",
                    "Track 4",
                ].map((text, index) => (
                    <ListItem
                        key={text}
                        disablePadding
                        secondaryAction={
                            <CircularProgressWithLabel
                                value={Math.random() * 100}
                            />
                        }
                    >
                        <ListItemButton
                            selected={selectedIndex === index}
                            onClick={(event) =>
                                handleListItemClick(event, index)
                            }
                        >
                            <ListItemIcon>
                                <MusicNoteIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={text}
                                secondary={"5 comments"}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default TrackCollection;
