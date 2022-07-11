import React, { useEffect, useState } from "react";
import "../App.css";
import { AudioCommentList } from "../components/AudioCommentList";
import { AudioPlayer } from "../components/AudioPlayer";
import { FileUploadZone } from "../components/FileUploadZone";
import {
    collection,
    getDocs,
    onSnapshot,
    query,
    setDoc,
    doc,
    where,
    addDoc,
} from "firebase/firestore";
import { AudioComment, TaskComment } from "../Helpers";
import { Paper } from "@mui/material";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

const paperStyle = {
    padding: 20,
    margin: "20px auto",
};

const App = () => {
    const auth = getAuth();
    const [audioFile, setAudioFile] = useState<File>();
    const [commentLoading, setCommentLoading] = useState(false);
    const [uid, setUid] = useState<string>(auth.currentUser?.uid ?? "");
    const [tid, setTid] = useState<string>();
    const [audioComments, setAudioComments] = useState<
        (AudioComment | TaskComment)[]
    >([]);

    function findTrackId(name: string) {
        const q = query(
            collection(db, "user-tracks", uid, "tracks"),
            where("title", "==", name)
        );
        console.log(audioFile);
        getDocs(q)
            .then((response) => {
                if (response.docs.length > 0) {
                    const docs = response.docs.map((doc) => ({
                        id: doc.id,
                    }));
                    setTid(docs[0].id);
                } else {
                    const docRef = collection(db, "user-tracks", uid, "tracks");
                    addDoc(docRef, {
                        title: name,
                    });
                    setTid(docRef.id);
                }
            })
            .catch((error) => {
                console.log(error.message);
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

            const path = ["user-tracks", uid, "tracks", tid!, "comments"];

            console.log(path.join("/"));
            onSnapshot(
                commentsRef,
                { includeMetadataChanges: true },
                (response) => {
                    const comments = response.docs.map((doc) => ({
                        data: doc.data(),
                        id: doc.id,
                    }));
                    setAudioComments(
                        comments.map((comment) => {
                            if (!comment.data.isTask) {
                                return new AudioComment(
                                    comment.data.text,
                                    comment.data.dateAdded.toDate(),
                                    comment.data.position,
                                    comment.id
                                );
                            } else {
                                return new TaskComment(
                                    comment.data.text,
                                    comment.data.dateAdded.toDate(),
                                    comment.data.position,
                                    comment.data.isComplete,
                                    comment.id
                                );
                            }
                        })
                    );
                    console.log("comment changed!");
                    setCommentLoading(false);
                }
            );
        }
    }, [tid]);

    return (
        <div className="App">
            <FileUploadZone newFileFound={(f: File) => verifyFile(f)} />
            <Paper elevation={5} style={paperStyle}>
                <AudioPlayer
                    audioFile={audioFile}
                    comments={audioComments}
                    uid={uid}
                    tid={tid!}
                    updateComments={setAudioComments}
                />
            </Paper>
            <AudioCommentList
                comments={audioComments}
                updateComments={setAudioComments}
                commentLoading={commentLoading}
                tid={tid!}
                uid={uid}
            />
        </div>
    );
};

export default App;
