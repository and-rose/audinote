import React, { useEffect, useState } from "react";
import "../App.sass";
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
import { Box, Paper, Stack } from "@mui/material";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import TrackCollection from "../components/TrackCollection";
import { getBlob, getStorage, ref } from "firebase/storage";

const paperStyle = {
    padding: 20,
};

const App = () => {
    const auth = getAuth();
    const storage = getStorage();
    const [audioFile, setAudioFile] = useState<File | string>();
    const [commentLoading, setCommentLoading] = useState(false);
    const [uid, setUid] = useState<string>(auth.currentUser?.uid ?? "");
    const [tid, setTid] = useState<string>();
    const [tracks, setTracks] = useState<any>([]);
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

    function loadTrackFromStorage(tid: string, trackName: string) {
        console.log(`attempting ${uid}/${tid}/${trackName}`);
        const pathReference = ref(storage, `${uid}/${tid}/${trackName}`);
        getBlob(pathReference)
            .then((url) => {
                console.log(url);
                const file = new File([url], trackName);
                setAudioFile(file);
                findTrackId(trackName);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    function getUserTracks() {
        const q = collection(db, "user-tracks", uid, "tracks");
        getDocs(q)
            .then((response) => {
                const docs = response.docs.map((doc) => ({
                    title: doc.data().title,
                    tid: doc.id,
                }));
                setTracks(docs);
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
        let unsubRef = () => {};
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
            unsubRef = onSnapshot(
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
                                    comment.id,
                                    comment.data.text
                                );
                            } else {
                                return new TaskComment(
                                    comment.data.text,
                                    comment.data.dateAdded.toDate(),
                                    comment.data.position,
                                    comment.data.isComplete,
                                    comment.id,
                                    comment.data.text
                                );
                            }
                        })
                    );
                    console.log("comment changed!");
                    setCommentLoading(false);
                }
            );
        }
        return () => unsubRef();
    }, [tid]);

    useEffect(() => {
        let unsubRef = () => {};
        if (uid == undefined || uid !== null) {
            getUserTracks();
            unsubRef = onSnapshot(
                collection(db, "user-tracks", uid, "tracks"),
                { includeMetadataChanges: true },
                (response) => {
                    const docs = response.docs.map((doc) => ({
                        title: doc.data().title,
                        tid: doc.id,
                    }));
                    setTracks(docs);
                }
            );
        }
        return () => unsubRef();
    }, [uid]);

    return (
        <Box
            sx={{
                display: "flex",
                height: "calc(100vh - 69px)",
            }}
        >
            <TrackCollection
                tracks={tracks}
                uid={uid}
                verifyFile={verifyFile}
                loadTrackFromStorage={loadTrackFromStorage}
            />
            <Box className="App" width={"100%"} m={2}>
                <Stack spacing={2}>
                    <Paper elevation={2} style={paperStyle}>
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
                </Stack>
            </Box>
        </Box>
    );
};

export default App;
