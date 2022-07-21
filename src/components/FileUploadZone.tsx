import { Backdrop, Box, useTheme } from "@mui/material";
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
        noClick: true,
        maxFiles: 1,
        accept: {
            "audio/example": [".mp3", ".wav"],
        },
    });
    return (
        <div {...getRootProps()}>
            {isDragActive ? (
                <Backdrop
                    sx={{
                        color: "#000000",
                        zIndex: (theme) => theme.zIndex.drawer + 2,
                    }}
                    open={true}
                >
                    <Box
                        className="filedropzone"
                        style={{
                            display: "flex",
                            position: "fixed",
                            opacity: 1,
                            backgroundColor: theme.palette.background.default,
                            outlineColor: theme.palette.grey[400],
                            color: theme.palette.grey[700],
                        }}
                    >
                        <input {...getInputProps()} />
                        <h2>Drop any audio file here!</h2>
                    </Box>
                </Backdrop>
            ) : null}
            {props.children}
        </div>
    );
};
