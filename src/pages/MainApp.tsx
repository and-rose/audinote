import React, { useEffect, useState } from "react";
import "../App.css";
import { AudioCommentList } from "../components/AudioCommentList";
import { AudioPlayer } from "../components/AudioPlayer";
import { FileUploadZone } from "../components/FileUploadZone";
import { AudioComment, TaskComment } from "../Helpers";
import { Paper } from "@mui/material";

export type AudioCommentSortType = "dateTime" | "timePosition";

const paperStyle = {
    padding: 20,
    margin: "20px auto",
};

const App = () => {
    const [audioFile, setAudioFile] = useState<File>();
    const [audioComments, setAudioComments] = useState<
        (AudioComment | TaskComment)[]
    >([]);
    const [sortCommentBy, setSortCommentBy] = useState("dateTime");

    function verifyFile(file: File) {
        setAudioFile(file);
    }

    function getSortFunc(type: String) {
        switch (type) {
            case "dateTime":
                return (a, b) => {
                    return b.dateTime - a.dateTime;
                };
            case "timePosition":
                return (a, b) => {
                    return a.timePosition - b.timePosition;
                };
        }
    }

    useEffect(() => {
        adjustComments(audioComments);
    }, [sortCommentBy]);

    function adjustComments(commentList: (AudioComment | TaskComment)[]) {
        const sortedList = [...commentList];
        sortedList.sort(getSortFunc(sortCommentBy));
        console.log(sortedList);
        setAudioComments(sortedList);
    }

    return (
        <div className="App">
            <FileUploadZone newFileFound={(f: File) => verifyFile(f)} />
            <Paper elevation={5} style={paperStyle}>
                <AudioPlayer
                    audioFile={audioFile}
                    comments={audioComments}
                    updateComments={adjustComments}
                />
            </Paper>
            <AudioCommentList
                comments={audioComments}
                updateComments={adjustComments}
                updateSortBy={setSortCommentBy}
                sortByType={sortCommentBy}
            />
        </div>
    );
};

export default App;
