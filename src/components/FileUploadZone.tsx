import { useTheme } from "@mui/material";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUploadZone.sass";

export const FileUploadZone = (props: {
    newFileFound: (f: File) => void;
    children: React.ReactNode;
}) => {
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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
                style={{
                    position: "relative",
                    width: "100%",
                }}
            >
                {isDragActive ? (
                    <div
                        className="filedropzone"
                        style={{
                            display: "flex",
                            position: "absolute",
                            zIndex: 10,
                            opacity: 0.9,
                            justifyContent: "center",
                            verticalAlign: "middle",
                            backgroundColor: theme.palette.grey[300],
                            outlineColor: theme.palette.grey[400],
                            color: theme.palette.grey[700],
                        }}
                    >
                        <input {...getInputProps()} />
                        <p>Drop any audio file here!</p>
                    </div>
                ) : null}
                {props.children}
            </div>
        </section>
    );
};
