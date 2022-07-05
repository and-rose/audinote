import { useTheme } from "@mui/material";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUploadZone.sass";

export const FileUploadZone = (props: { newFileFound: (f: File) => void }) => {
    const theme = useTheme();
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file: File) => {
            const reader = new FileReader();

            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = () => {
                console.log("new file detected!");
                props.newFileFound(file);
            };
            reader.readAsArrayBuffer(file);
        });
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            "audio/example": [".mp3", ".wav"],
        },
    });
    return (
        <section>
            <div
                {...getRootProps()}
                className="filedropzone"
                style={{
                    backgroundColor: theme.palette.grey[300],
                    outlineColor: theme.palette.grey[400],
                    color: theme.palette.grey[700],
                }}
            >
                <input {...getInputProps()} />
                <p>Drop any audio file here!</p>
            </div>
        </section>
    );
};
