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
import { AudioCommentSortType } from "../pages/MainApp";

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
    updateSortBy: (sortValue: AudioCommentSortType | string) => void;
    sortByType: AudioCommentSortType | string;
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

    const [selectedCommentIndex, setSelectedCommentIndex] = useState(0);
    const [selectedComment, setSelectedComment] = useState<AudioComment>();
    const [dialogOpen, setDialogOpen] = useState(false);
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

    function openDeleteDialog(targetIndex: number) {
        setSelectedCommentIndex(targetIndex);
        setSelectedComment(props.comments[selectedCommentIndex]);
        handleDialogOpen();
    }

    function updateComment(index: number, newComment: AudioComment) {
        let shallowClone = [...props.comments];
        shallowClone[index] = newComment;
        props.updateComments([...shallowClone]);
    }

    function deleteComment(index: number) {
        let shallowClone = [...props.comments];
        shallowClone.splice(index, 1);
        props.updateComments([...shallowClone]);
    }

    return (
        <div className="commentListContainer">
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
                >
                    <MenuItem
                        value={"dateTime"}
                        onClick={() => {
                            props.updateSortBy("dateTime");
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
                            props.updateSortBy("timePosition");
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

            {/* Return Audio Tiles*/}
            <TransitionGroup>
                {props.comments.map((comment, index) => {
                    return (
                        <Collapse
                            key={index}
                            className="commentListContainer"
                            timeout={200}
                        >
                            <AudioCommentTile
                                commentDetails={comment}
                                key={comment.dateTime.getTime()}
                                listKey={index}
                                addCommentToArray={updateComment}
                                deleteCommentFromArray={deleteComment}
                                openDeleteDialog={openDeleteDialog}
                            />
                        </Collapse>
                    );
                })}
            </TransitionGroup>

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
                        ${selectedComment?.label}`}
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
                    {selectedComment?.label} removed.
                </Alert>
            </Snackbar>
        </div>
    );
};
