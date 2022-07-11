import React, { useEffect, useRef, useState } from "react";
import "./AudioComment.sass";
import {
    AudioComment,
    TaskComment,
    timeDifference,
    toTimeStamp,
} from "../Helpers";

import {
    TextField,
    Typography,
    debounce,
    useTheme,
    Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import MessageIcon from "@mui/icons-material/Message";

export const AudioCommentTile = (props: {
    commentDetails: AudioComment;
    addCommentToArray: (index: number, newComment: AudioComment) => void;
    deleteCommentFromArray: (index: number) => void;
    listKey: number;
    openDeleteDialog: (targetIndex: number) => void;
}) => {
    const theme = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isComplete, setIsComplete] = useState(false);
    const [commentType, setCommentType] = useState(false);
    const [commentText, setCommentText] = useState<String>(
        props.commentDetails.comment ?? ""
    );
    const [isCommentTextFocused, setIsCommentTextFocused] = useState(false);

    const submitChangedComment = (commentText: String) => {
        let tc;
        if (commentType) {
            tc = {
                ...props.commentDetails,
            };
            props.addCommentToArray(
                props.listKey,
                new TaskComment(
                    tc.label,
                    tc.dateTime,
                    tc.timePosition,
                    tc.complete,
                    commentText
                )
            );
        } else {
            tc = {
                ...props.commentDetails,
            };
            props.addCommentToArray(
                props.listKey,
                new AudioComment(
                    tc.label,
                    tc.dateTime,
                    tc.timePosition,
                    commentText
                )
            );
        }
    };

    const submitCommentCheck = (checked: boolean) => {
        let tc = {
            ...props.commentDetails,
        };
        props.addCommentToArray(
            props.listKey,
            new TaskComment(
                tc.label,
                tc.dateTime,
                tc.timePosition,
                checked,
                tc.comment
            )
        );
    };

    function saveCommentAndFinish() {
        submitChangedComment(commentText);
        setIsCommentTextFocused(false);
    }

    function cancelCommentEdit() {
        setIsCommentTextFocused(false);
        setCommentText(props.commentDetails.comment ?? "");
    }

    function updateCommentComplete(event) {
        setIsComplete(event.target.checked);
        submitCommentCheck(event.target.checked);
    }

    useEffect(() => {
        const intervaldId = setInterval(() => setCurrentDate(new Date()), 5000);
        setIsCommentTextFocused(false);
        inputRef.current?.focus();

        return clearInterval(intervaldId);
    }, []);

    useEffect(() => {
        setCommentType(props.commentDetails instanceof TaskComment);
    }, [props.commentDetails]);

    return (
        <div className="commentTileContainer">
            <div
                className="colourTab"
                style={{
                    backgroundColor: commentType
                        ? isComplete
                            ? theme.palette.success.main
                            : theme.palette.error.main
                        : theme.palette.primary.main,
                }}
            ></div>
            <div className="commentType">
                {commentType ? (
                    <Checkbox
                        color="success"
                        value={isComplete}
                        onChange={updateCommentComplete}
                        size={"medium"}
                    />
                ) : (
                    <MessageIcon
                        color={"primary"}
                        fontSize={"medium"}
                        style={{ padding: 9 }}
                    />
                )}
            </div>
            <div className="commentContent">
                <div className="commentTimestamp">
                    <p>{toTimeStamp(props.commentDetails.timePosition)}</p>
                </div>
                <div className="commentText">
                    {!isCommentTextFocused ? (
                        <Typography
                            variant={"body1"}
                            paragraph={true}
                            style={{
                                whiteSpace: "pre-line",
                            }}
                        >
                            {commentText}
                        </Typography>
                    ) : (
                        <TextField
                            placeholder={"Enter your notes here"}
                            autoFocus
                            onFocus={(event) => {
                                event.target.select();
                            }}
                            multiline
                            fullWidth
                            defaultValue={props.commentDetails.comment}
                            minRows={1}
                            inputRef={inputRef}
                            variant={"standard"}
                            onKeyUp={(e) => {
                                if (e.ctrlKey && e.key === "Enter") {
                                    saveCommentAndFinish();
                                } else if (e.key === "Escape") {
                                    cancelCommentEdit();
                                }
                            }}
                            onChange={debounce((event) => {
                                setCommentText(event.target.value);
                            }, 400)}
                        />
                    )}
                </div>
            </div>
            <div className="comment-controls">
                {!isCommentTextFocused && (
                    <IconButton
                        aria-label="edit"
                        onClick={() => {
                            setIsCommentTextFocused(true);
                            inputRef.current?.focus();
                        }}
                    >
                        <EditIcon color={"action"} />
                    </IconButton>
                )}

                {isCommentTextFocused && (
                    <IconButton
                        onClick={() => {
                            saveCommentAndFinish();
                        }}
                    >
                        <SaveIcon color={"primary"} />
                    </IconButton>
                )}
                {isCommentTextFocused && (
                    <IconButton
                        onClick={() => {
                            cancelCommentEdit();
                        }}
                    >
                        <CancelIcon color={"action"} />
                    </IconButton>
                )}

                <IconButton
                    aria-label="delete"
                    disabled={isCommentTextFocused}
                    onClick={() => props.openDeleteDialog(props.listKey)}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
            <div className="timeAgo">
                <p>
                    {timeDifference(currentDate, props.commentDetails.dateTime)}
                </p>
            </div>
        </div>
    );
};
