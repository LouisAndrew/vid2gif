import { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import axios from 'axios';

import { CSSTransition } from 'react-transition-group';
import Loader from 'react-loader-spinner';

import Text from './components/text';
import VideoInput from './components/video-input';
import Video from './components/video';
import Gif from './components/gif';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

/**
 * Enumeration for the state of the app. used as a message between components
 */
export enum AppState {
    /**
     * When nothing happens in the app (no gif, no loading and no video)
     */
    DEFAULT = 0,
    /**
     * When user uploaded the video
     */
    VIDEO_IN = 1,
    /**
     * When the app is converting video to gif.
     */
    CONVERTING = 2,
    /**
     * When the convertion is done
     */
    DONE = 3,
    /**
     * When there's an error in the app
     */
    ERROR = 99,
    /**
     * If there's an error while uploading output image on the cloudinary
     */
    ERROR_UPLOAD = 401,
    /**
     * Error while converting on the server side.
     */
    ERROR_SERVER_CONVERSION = 404,
}

enum FFMPEGLoadState {
    /**
     * App is ready to use,
     */
    READY = 0,
    /**
     * When the ffmpeg library is loading (app is not yet ready to use.)
     */
    LOADING = 1,
    /**
     * When the ffmpeg library is not even loaded (app is not yet ready to use.)
     */
    NOT_LOADED = 2,
    /**
     * When the ffmpeg library is not loaded (browser is incompatible)
     */
    ERROR = 99,
}

const ffmpeg = createFFmpeg({ log: true });

function App() {
    const [state, setState] = useState(AppState.DEFAULT);
    const [ffmpegLoadState, setFfmpegLoadState] = useState(
        FFMPEGLoadState.NOT_LOADED
    );
    const [video, setVideo] = useState<File | null>(null);
    const [gifUrl, setGifUrl] = useState('');
    const [showGif, setShowGif] = useState(false);

    // Boolean identifier to identify if the video should be converted on server.
    const [convertWithApi, setConvertWithApi] = useState(false);

    const debugFallback = false; // debug purposes for firefox.

    /**
     * Loads the ffmpeg library
     */
    const load = async () => {
        if (!debugFallback) {
            try {
                await ffmpeg.load();
            } catch (e) {
                setConvertWithApi(true);
            } finally {
                setFfmpegLoadState(FFMPEGLoadState.READY);
            }
        } else {
            setConvertWithApi(true);
            setFfmpegLoadState(FFMPEGLoadState.READY);
        }
    };
    /**
     * Function to be called when the user uploads a video
     * @param file video file uploaded by the user
     */
    const handleChangeVideo = (file: File) => {
        setVideo(file);
    };

    /**
     * Function to call server-side conversion
     * @param flags flags that should be added to the ffmpeg command
     */
    const convertServerSide = async (flags: string[]) => {
        if (!video) {
            setState(AppState.ERROR);
            return;
        }

        // formdata: enables file uploading
        const formData = new FormData();
        formData.append('video', video);
        formData.append('flags', flags.join(','));

        try {
            // hitting the api route from next js.
            const res = await axios({
                method: 'POST',
                url: '/api/file-upload',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const {
                data: { secure_url },
            } = await res;

            await setGifUrl(secure_url);

            await setState(AppState.DONE);
            await setShowGif(true);
        } catch (e) {
            const { response } = e;

            if (response) {
                const { status } = response;
                if (status === 401) {
                    setState(AppState.ERROR_UPLOAD);
                } else {
                    setState(AppState.ERROR_SERVER_CONVERSION);
                }
            } else {
                setState(AppState.ERROR);
            }
        }
    };

    /**
     * Function to convert the given video file into a GIF
     * @param flags flags that should be added to the ffmpeg command
     */
    const convert = async (flags: string[]) => {
        await setState(AppState.CONVERTING);

        if (convertWithApi) {
            convertServerSide(flags);
            return;
        }

        if (video) {
            const [timeFlag, outputDuration, ...others] = flags;

            await ffmpeg.FS('writeFile', 'in.mp4', await fetchFile(video)); // write file to memory

            await ffmpeg.run(
                ...others,
                '-i',
                'in.mp4',
                timeFlag,
                outputDuration,
                '-f',
                'gif',
                'out.gif'
            ); // run ffmpeg cli command
            const result = await ffmpeg.FS(
                'readFile',
                'out.gif',
                (err: any, thumb: any) => {
                    console.log({ err, thumb });
                }
            ); // fetch data from fs.

            // basically cteating an URL object for this file.
            const url = await URL.createObjectURL(
                new Blob([result.buffer], { type: 'image/gif' }) // taken from https://www.youtube.com/watch?v=-OTc0Ki7Sv0&t=376s -> fireship.io tutorial
            );

            await setGifUrl(url);

            await setState(AppState.DONE);
            await setShowGif(true);
        } else {
            // handle errors here.
            setState(AppState.ERROR);
        }
    };

    useEffect(() => {
        setFfmpegLoadState(FFMPEGLoadState.LOADING);
        load();
    }, []);

    useEffect(() => {
        // apply changes to app-state when video state chanegs
        if (video) {
            // check if the current view-window is gif!
            if (showGif) {
                setShowGif(false); // bug cause.
                setGifUrl('');
            }
            setState(AppState.VIDEO_IN);
        } else {
            setState(AppState.DEFAULT);
        }
        // eslint-disable-next-line
    }, [video]);

    return (
        <div className="app relative w-full min-h-screen bg-gray-100 flex items-center justify-center p-5">
            <div className="wrapper w-full sm:w-4/5 md:max-w-xl">
                {
                    ffmpegLoadState === FFMPEGLoadState.LOADING ? (
                        <div className="flex flex-col items-center">
                            <Loader
                                type="Oval"
                                color="#4F46E5"
                                height={100}
                                width={100}
                            />
                            <h2 className="text-xl mt-5 font-bold">
                                Loading FFMPEG Library
                            </h2>
                        </div> // shows loading page
                    ) : (
                        <div className="wrapper text-center w-full ">
                            <Text state={state} />
                            <div className="data-wrapper p-3 bg-white shadow-2xl rounded-md w-full transition-all sm:p-5">
                                <VideoInput
                                    isVideoIn={video !== null}
                                    setVideo={handleChangeVideo}
                                    fileName={video?.name}
                                    disableUpload={
                                        state === AppState.CONVERTING
                                    }
                                />
                                <div className="flex flex-nowrap overflow-hidden transition-all relative">
                                    {state === AppState.CONVERTING && (
                                        <>
                                            <div className="w-full h-full absolute z-50 left-0 top-0 flex  flex-col items-center justify-center loading-screen">
                                                <Loader
                                                    type="Oval"
                                                    color="#4F46E5"
                                                    height={100}
                                                    width={100}
                                                />
                                                <h2 className="text-xl mt-5 font-bold">
                                                    Converting..
                                                    {video?.size &&
                                                    video?.size > 10000000 ? ( // check if the size of the video is more than 10MB
                                                        <>
                                                            <br />
                                                            <span className="text-base font-medium text-gray-600">
                                                                The size of the
                                                                uploaded video
                                                                is more than
                                                                10MB. It would
                                                                take longer than
                                                                usual.
                                                            </span>
                                                        </>
                                                    ) : null}
                                                </h2>
                                            </div>
                                        </>
                                    )}

                                    {state !== AppState.DEFAULT &&
                                    state !== AppState.ERROR &&
                                    video ? (
                                        <CSSTransition
                                            in={!showGif}
                                            unmountOnExit={true}
                                            timeout={200}
                                            classNames="video"
                                        >
                                            <>
                                                <Video
                                                    video={video}
                                                    convert={convert}
                                                    showGif={
                                                        gifUrl
                                                            ? () => {
                                                                  setShowGif(
                                                                      true
                                                                  );
                                                              }
                                                            : undefined
                                                    }
                                                />
                                            </>
                                        </CSSTransition>
                                    ) : null}
                                    {state === AppState.DONE && (
                                        <CSSTransition
                                            in={showGif}
                                            unmountOnExit={true}
                                            timeout={200}
                                            classNames="gif"
                                        >
                                            <Gif
                                                gifUrl={gifUrl}
                                                showVideo={() => {
                                                    setShowGif(false);
                                                }}
                                            />
                                        </CSSTransition>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                    /*
                    ERROR COMPONENT SNIPPET
                    (
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl mb-5 font-bold">
                            FFMPEG Library cannot be loaded. 😞
                        </h1>
                        <p>
                            This browser is incompatible with the library needed
                            to convert the video. Try using google chrome on
                            laptops / PC
                        </p>
                        <button
                            className="w-full btn rounded-md bg-indigo-600 text-white px-4 py-3 mt-6"
                            onClick={() => {
                                window.location.reload();
                            }}
                        >
                            Reload the page
                        </button>
                    </div>
                    //Show error page
                ) */
                }
            </div>
        </div>
    );
}

export default App;
