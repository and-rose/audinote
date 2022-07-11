import React, { useEffect, useState } from "react";
import "../App.css";
import { AudioCommentList } from "../components/AudioCommentList";
import { AudioPlayer } from "../components/AudioPlayer";
import { FileUploadZone } from "../components/FileUploadZone";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { AudioComment, TaskComment } from "../Helpers";
import { Paper } from "@mui/material";
import { db } from "../firebase";

const paperStyle = {
    padding: 20,
    margin: "20px auto",
};

const App = () => {
    const [audioFile, setAudioFile] = useState<File>();
    const [commentLoading, setCommentLoading] = useState(false);
    const [uid, setUid] = useState<string>("WKYrTEUbgVuKxoT9SYmi");
    const [tid, setTid] = useState<string>();
    const [sortCommentBy, setSortCommentBy] = useState("dateTime");
    const [audioComments, setAudioComments] = useState<
        (AudioComment | TaskComment)[]
    >([]);

    function getStore() {
        const docRef = collection(db, "user-tracks");
        getDocs(docRef)
            .then((response) => {
                const docs = response.docs.map((doc) => ({
                    data: doc.data(),
                    id: doc.id,
                }));
                const tracksRef = collection(
                    db,
                    "user-tracks",
                    docs[0].id,
                    "tracks"
                );
                getDocs(tracksRef)
                    .then((response) => {
                        const tracks = response.docs.map((doc) => ({
                            data: doc.data(),
                            id: doc.id,
                        }));
                        console.log(tracks);
                        const commentsRef = collection(
                            db,
                            "user-tracks",
                            docs[0].id,
                            "tracks",
                            tracks[0].id,
                            "comments"
                        );
                        getDocs(commentsRef)
                            .then((response) => {
                                const comments = response.docs.map((doc) => ({
                                    data: doc.data(),
                                    id: doc.id,
                                }));
                                console.log(comments);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                console.log(docs);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    function findTrackId(name: string) {
        const q = query(
            collection(db, "user-tracks", uid, "tracks"),
            where("title", "==", name)
        );
        getDocs(q)
            .then((response) => {
                console.log(response.docs.length);
                if (response.docs.length > 0) {
                    const docs = response.docs.map((doc) => ({
                        id: doc.id,
                    }));
                    setTid(docs[0].id);
                } else {
                    setTid("NOT FOUND");
                }
            })
            .catch((error) => {
                console.log(error);
                setCommentLoading(false);
            });
    }

    function verifyFile(file: File) {
        setCommentLoading(true);
        setAudioComments([]);
        setAudioFile(file);
        findTrackId(file.name);
    }

    useEffect(() => {
        if (audioFile) {
            const commentsRef = collection(
                db,
                "user-tracks",
                uid,
                "tracks",
                tid!,
                "comments"
            );
            getDocs(commentsRef)
                .then((response) => {
                    const comments = response.docs.map((doc) => ({
                        data: doc.data(),
                        id: doc.id,
                    }));
                    setAudioComments(
                        comments.map((comment) => {
                            return new AudioComment(
                                comment.data.text,
                                comment.data.dateAdded.toDate(),
                                comment.data.position,
                                comment.data.text
                            );
                        })
                    );
                    setCommentLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setCommentLoading(false);
                });
        }
    }, [tid]);

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
        setAudioComments(audioComments);
    }, [sortCommentBy]);

    return (
        <div className="App">
            <FileUploadZone newFileFound={(f: File) => verifyFile(f)} />
            <Paper elevation={5} style={paperStyle}>
                <AudioPlayer
                    audioFile={audioFile}
                    comments={audioComments}
                    updateComments={setAudioComments}
                />
            </Paper>
            <AudioCommentList
                comments={audioComments}
                updateComments={setAudioComments}
                commentLoading={commentLoading}
            />
        </div>
    );
};

export default App;
