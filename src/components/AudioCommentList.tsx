import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import { AudioComment } from "../Helpers";
import { AudioCommentTile } from "./AudioComment";
import "./AudioCommentList.sass";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Snackbar from "@mui/material/Snackbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faMusic } from "@fortawesome/free-solid-svg-icons";
import Fade from "@mui/material/Fade";
import Menu from "@mui/material/Menu";
import Sort from "@mui/icons-material/Sort";
import { TransitionGroup } from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import CircularProgress from "@mui/material/CircularProgress";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import ScrollFade from "@benestudioco/react-scrollfade";

type AudioCommentSortType = "dateTime" | "timePosition";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={24} ref={ref} {...props} />;
});

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AudioCommentList = (props: {
    comments: AudioComment[];
    updateComments: (comment: AudioComment[]) => void;
    commentLoading: boolean;
    uid: string;
    tid: string;
}) => {
    //Confirmation Dialog Handlers
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [selectedCommentIndex, setSelectedCommentIndex] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [sortBy, setSortBy] = useState<AudioCommentSortType>();
    const handleDialogOpen = () => setDialogOpen(true);
    const handleDialogClose = () => setDialogOpen(false);

    //Snackbar Handlers
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const handleSnackbarOpen = () => setSnackbarOpen(true);
    const handleSnackbarClose = (event) => {
        if (event.target.reason !== "clickaway") {
            setSnackbarOpen(false);
        }
    };

    function openDeleteDialog(targetId: string) {
        console.log(targetId);
        setSelectedCommentIndex(targetId);
        handleDialogOpen();
    }

    async function deleteComment(targetId: string) {
        await deleteDoc(
            doc(
                db,
                "user-tracks",
                props.uid,
                "tracks",
                props.tid,
                "comments",
                targetId
            )
        );
    }

    return (
        <Box
            className="commentListContainer"
            alignItems="center"
            justifyContent="center"
        >
            <div className="commentHeader">
                {/* Header Content */}
                <h2>Comments</h2>
                <Button
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    startIcon={<Sort />}
                >
                    Sort
                </Button>
                <Menu
                    id="fade-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "fade-button",
                    }}
                    TransitionComponent={Fade}
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
                >
                    <MenuItem
                        value={"dateTime"}
                        onClick={() => {
                            setSortBy("dateTime");
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faClockRotateLeft} />
                        </ListItemIcon>
                        <ListItemText>Recent</ListItemText>
                    </MenuItem>
                    <MenuItem
                        value={"timePosition"}
                        onClick={() => {
                            setSortBy("timePosition");
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faMusic} />
                        </ListItemIcon>
                        <ListItemText>Time</ListItemText>
                    </MenuItem>
                </Menu>
            </div>
            <Container
                className="commentsWrapper"
                maxWidth={false}
                sx={{
                    overflowY: "auto",
                    height: "43vh",
                }}
            >
                <ScrollFade />
                {!props.commentLoading ? (
                    <TransitionGroup>
                        {[...props.comments]
                            .sort((a, b) => {
                                if (sortBy === "dateTime") {
                                    return a.dateTime.getTime() >
                                        b.dateTime.getTime()
                                        ? 1
                                        : -1;
                                } else if (sortBy === "timePosition") {
                                    return a.timePosition > b.timePosition
                                        ? 1
                                        : -1;
                                } else {
                                    return 0;
                                }
                            })
                            .map((comment, index) => {
                                return (
                                    <Collapse
                                        key={index}
                                        className="commentListContainer"
                                        timeout={200}
                                    >
                                        <AudioCommentTile
                                            commentDetails={comment}
                                            key={index}
                                            listKey={index}
                                            uid={props.uid}
                                            tid={props.tid}
                                            deleteCommentFromArray={
                                                deleteComment
                                            }
                                            openDeleteDialog={openDeleteDialog}
                                        />
                                    </Collapse>
                                );
                            })}
                    </TransitionGroup>
                ) : (
                    <CircularProgress />
                )}
            </Container>

            {/* Pop-ups Below */}
            <Dialog
                open={dialogOpen}
                TransitionComponent={Transition}
                onClose={handleDialogClose}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {`Are you sure you want to delete 
                        ${selectedCommentIndex}`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color={"info"}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            deleteComment(selectedCommentIndex);
                            handleDialogClose();
                            handleSnackbarOpen();
                        }}
                        color={"error"}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                anchorOrigin={{
                    horizontal: "left",
                    vertical: "bottom",
                }}
                resumeHideDuration={6000}
                onClose={(event) => handleSnackbarClose(event)}
            >
                <Alert
                    onClose={(event) => handleSnackbarClose(event)}
                    severity="info"
                    sx={{ width: "100%" }}
                >
                    {selectedCommentIndex} removed.
                </Alert>
            </Snackbar>
        </Box>
    );
};
