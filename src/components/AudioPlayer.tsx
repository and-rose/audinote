import React, { Fragment, useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import CursorPlugin from "wavesurfer.js/src/plugin/cursor/index.js";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers/index.js";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions/index.js";
import { AudioComment, TaskComment, toShortTimeStamp } from "../Helpers";
import "./AudioPlayer.sass";
import useTheme from "@mui/material/styles/useTheme";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RepeatIcon from "@mui/icons-material/Repeat";
import PauseIcon from "@mui/icons-material/Pause";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import StopIcon from "@mui/icons-material/Stop";
import Slider from "@mui/material/Slider";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import CircularProgress from "@mui/material/CircularProgress";

const DynamicVolumeIcon = (props: { volume: number }) => {
    if (props.volume === 0) {
        return <VolumeOffIcon />;
    } else if (props.volume < 33) {
        return <VolumeMuteIcon />;
    } else if (props.volume < 66) {
        return <VolumeDownIcon />;
    } else {
        return <VolumeUpIcon />;
    }
};

export const AudioPlayer = (props: {
    audioFile: File | undefined;
    comments: (AudioComment | TaskComment)[];
    updateComments: (comment: (AudioComment | TaskComment)[]) => void;
}) => {
    // let [isPlaying, setIsPlaying] = useState(false);
    const theme = useTheme();
    const wavesurferRef = useRef(null);
    const [ws, setWs] = useState<WaveSurfer>();
    const [trackTime, setTrackTime] = useState(0);
    const [trackLength, setTrackLength] = useState(0);
    const [volume, setVolume] = useState<number>(50);
    const [isMuted, setIsMuted] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isLoading, setisLoading] = useState(false);

    const handleChange = (event: Event, newValue: number | number[]) => {
        const outputVol = isMuted ? 0 : newValue;

        setVolume(outputVol as number);
    };

    useEffect(() => {
        const outputVol = isMuted ? 0 : volume;
        ws?.setVolume((outputVol as number) / 100);
    }, [volume, isMuted]);

    useEffect(() => {
        let wsInstance;
        if (wavesurferRef.current) {
            wsInstance = WaveSurfer.create({
                plugins: [
                    MarkersPlugin.create({
                        markers: [
                            {
                                draggable: true,
                            },
                        ],
                    }),
                    CursorPlugin.create(),
                    RegionsPlugin.create(),
                ],
                progressColor: theme.palette.primary.main,
                waveColor: theme.palette.grey[500],
                responsive: true,
                container: wavesurferRef.current,
                // barWidth: 2,
                barHeight: 0.65,
                height: 100,
                barGap: 2,
                cursorWidth: 1,
            });
            setWs(wsInstance);

            wsInstance.on("seek", () => {
                setTrackTime(wsInstance.getCurrentTime());
            });

            wsInstance.on("ready", () => {
                setTrackLength(wsInstance.getDuration());
                setisLoading(false);
            });

            wsInstance.on("loading", () => {
                setisLoading(true);
            });

            wsInstance.on("audioprocess", () => {
                setTrackTime(wsInstance.getCurrentTime());
            });

            wsInstance.on("marker-drop", function (marker) {
                console.log(wsInstance.markers);
                console.log("marker drop", marker);
            });
        }

        return () => wsInstance.destroy();
    }, []);

    useEffect(() => {
        ws?.on("finish", () => {
            console.log(isLooping);
            if (isLooping) {
                console.log("looping");
                ws?.seekTo(0);
                ws?.play();
            } else {
                ws?.stop();
            }
        });

        ws?.on("seek", () => {
            setTrackTime(ws?.getCurrentTime());
        });

        ws?.on("ready", () => {
            setTrackLength(ws?.getDuration());
            setisLoading(false);
        });

        ws?.on("loading", () => {
            setisLoading(true);
        });

        ws?.on("audioprocess", () => {
            setTrackTime(ws?.getCurrentTime());
        });

        ws?.on("marker-drop", function (marker) {
            console.log(ws?.markers);
            console.log("marker drop", marker);
        });

        return () => ws?.unAll();
    }, [isLooping]);

    useEffect(() => {
        ws?.markers.clear();
        props.comments.map((comment, index) => {
            return ws?.addMarker({
                index: index,
                time: comment.timePosition,
                label: comment.comment,
                draggable: true,
                color:
                    comment instanceof TaskComment
                        ? comment.complete
                            ? theme.palette.success.main
                            : theme.palette.error.main
                        : theme.palette.primary.main,
            });
        });
        console.log("redrawing markers");
    }, [props.comments]);

    useEffect(() => {
        if (props.audioFile) {
            ws?.loadBlob(props.audioFile);
        }
    }, [props.audioFile]);

    function addComment(newComment: AudioComment | TaskComment) {
        props.updateComments([...props.comments, newComment]);
    }

    return (
        <Fragment>
            {isLoading ? (
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="left"
                >
                    <h1 style={{ color: theme.palette.grey[500] }}>
                        Loading...
                    </h1>
                    <CircularProgress
                        id="waveform-loader"
                        thickness={2.5}
                        size="2em"
                        style={{ color: theme.palette.grey[500] }}
                    />
                </Stack>
            ) : (
                <h1>
                    {props.audioFile?.name
                        ? props.audioFile?.name
                        : "No File Loaded"}
                </h1>
            )}

            <div className="player-container">
                <div>{toShortTimeStamp(trackTime)}</div>
                <div ref={wavesurferRef} className="wavesurferContainer"></div>
                <div>{toShortTimeStamp(trackLength)}</div>
            </div>

            <Stack direction="row" spacing={2} justifyContent={"center"}>
                <ButtonGroup variant="contained" size="medium">
                    <Tooltip title="Play/Pause" placement="top">
                        <Button onClick={() => ws?.playPause()}>
                            {ws?.isPlaying() ? (
                                <PauseIcon />
                            ) : (
                                <PlayArrowIcon />
                            )}
                        </Button>
                    </Tooltip>
                    <Tooltip title="Stop" placement="top">
                        <Button onClick={() => ws?.stop()}>
                            <StopIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Repeat" placement="top">
                        <ToggleButton
                            value="repeat"
                            selected={isLooping}
                            onChange={() => setIsLooping(!isLooping)}
                            color="primary"
                        >
                            <RepeatIcon />
                        </ToggleButton>
                    </Tooltip>
                </ButtonGroup>
                <Stack
                    spacing={2}
                    direction="row"
                    sx={{ mb: 5 }}
                    alignItems="center"
                    width={250}
                >
                    <IconButton
                        onClick={() => {
                            setIsMuted(!isMuted);
                        }}
                    >
                        <DynamicVolumeIcon volume={isMuted ? 0 : volume} />
                    </IconButton>

                    <Slider
                        aria-label="Volume"
                        valueLabelDisplay="auto"
                        value={isMuted ? 0 : volume}
                        max={100}
                        min={0}
                        onChange={handleChange}
                    />
                </Stack>
                <ButtonGroup variant="contained">
                    <Tooltip
                        title="Insert note at cursor position"
                        placement="top"
                    >
                        <Button
                            onClick={() => {
                                addComment(
                                    new AudioComment(
                                        "Note Label",
                                        new Date(),
                                        ws?.getCurrentTime()!
                                    )
                                );
                            }}
                        >
                            <InsertCommentIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        title="Insert task at cursor position"
                        placement="top"
                    >
                        <Button
                            onClick={() => {
                                addComment(
                                    new TaskComment(
                                        "Task Label",
                                        new Date(),
                                        ws?.getCurrentTime()!,
                                        false
                                    )
                                );
                            }}
                        >
                            <AssignmentTurnedInIcon />
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Stack>
        </Fragment>
    );
};

export default AudioPlayer;
