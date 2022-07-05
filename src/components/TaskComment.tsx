import React, { useState } from "react";
import "./AudioComment.sass";
import { TaskComment, timeDifference, toTimeStamp } from "../Helpers";

import { TextField, Typography } from "@mui/material";

export const TaskCommentTile = (props: {
    commentDetails: TaskComment;
    updateArray: (index: number, newComment: TaskComment) => void;
    listKey: number;
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isComplete, setIsComplete] = useState(false);
    const [commentText, setCommentText] = useState(
        props.commentDetails.comment
    );
    const [isCommentTextFocused, setIsCommentTextFocused] = useState(false);

    setInterval(() => setCurrentDate(new Date()), 30000);

    return (
        <div className="commentTileContainer">
            <div
                className="colourTab"
                style={{
                    backgroundColor: isComplete ? "green" : "red",
                }}
            ></div>
            <div className="commentType">
                <h3>{"Task"}</h3>
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
                            onClick={() => {
                                setIsCommentTextFocused(true);
                            }}
                            style={{
                                whiteSpace: "pre-line",
                            }}
                        >
                            {commentText}
                        </Typography>
                    ) : (
                        <TextField
                            autoFocus
                            multiline
                            fullWidth
                            value={commentText}
                            minRows={1}
                            variant={"standard"}
                            onChange={(event) => {
                                const tweakedComment: TaskComment = {
                                    ...props.commentDetails,
                                };
                                tweakedComment.comment = event.target.value;
                                props.updateArray(
                                    props.listKey,
                                    tweakedComment
                                );
                                new setCommentText(tweakedComment.comment);
                            }}
                            onBlur={(event) => setIsCommentTextFocused(false)}
                        />
                    )}
                </div>
            </div>
            <div className="timeAgo">
                <p>
                    {timeDifference(currentDate, props.commentDetails.dateTime)}
                </p>
            </div>
        </div>
    );
};
