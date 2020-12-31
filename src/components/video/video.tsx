import { FC, useRef, useState, useEffect } from 'react';
import Settings, { ConvertionSettings } from './settings';

type Props = {
    /**
     * Uploaded video (mp4)
     */
    video: File;
    /**
     * Function to actually convert the video into gif with flags provided from ConvertionSettings
     */
    convert: (flags: string[]) => void;
    /**
     * Function to show the gif output (available to call after an output is converted)
     */
    showGif?: () => void;
};

/**
 * Video component, used to display the user's uploaded video
 */
const Video: FC<Props> = ({ video, convert, showGif }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [videoDuration, setVideoDuration] = useState(0);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [showSettings, setShowSettings] = useState(showGif === undefined);

    /**
     * To be called when to convert the video into gif with given setting(s)
     * @param settings
     */
    const convertWithSettings = (settings: ConvertionSettings) => {
        let flags: string[] = [];
        let videoDurationSeeked = videoDuration;
        const { speed, seekStart, seekEnd } = settings;
        // calls convert method with given flags.

        // ss means starting second (seek start)
        if (seekStart !== 0) {
            flags = [...flags, '-ss', seekStart.toString()];
            videoDurationSeeked -= seekStart;
        }

        // ssof starting seconds from the end of the video. (seek end)
        if (
            seekEnd !== videoDuration &&
            Math.floor(seekEnd) !== Math.floor(videoDuration)
        ) {
            flags = [...flags, '-sseof', (seekEnd - videoDuration).toString()];
            videoDurationSeeked += seekEnd - videoDuration;
        }

        // t means time/length of the gif output
        const videoLength =
            speed === 1 ? videoDurationSeeked : videoDurationSeeked / speed; // https://www.quora.com/How-long-will-it-take-to-watch-a-10-minute-video-if-I-watch-it-at-1-5-speed#:~:text=Because%20if%20you%20watch%20it,10%2F4%20%3D%207.5%20minutes.
        flags = ['-t', videoLength.toFixed(1).toString(), ...flags];

        convert(flags);
    };

    useEffect(() => {
        // wait unti the video is ready
        const videoEl = videoRef.current;
        if (videoEl) {
            setLoadingVideo(true);

            videoEl.addEventListener('loadedmetadata', (e) => {
                setVideoDuration((e.target as HTMLVideoElement).duration);
                setLoadingVideo(false);
            });
        }
    }, [video]);

    return (
        <div className="px-2 flex-shrink-0 w-full">
            {!loadingVideo ? (
                <>
                    <div className="flex flex-row justify-between">
                        <h4 className="font-sans font-medium text-xl">Video</h4>
                        {showGif && (
                            <button
                                className="btn font-bold text-indigo-500"
                                onClick={showGif}
                            >
                                Show GIF
                            </button>
                        )}
                    </div>
                    <div className="rounded-md shadow-lg overflow-hidden my-2">
                        <video
                            preload="metadata"
                            controls={true}
                            width={500}
                            height={250}
                            src={URL.createObjectURL(video)}
                            ref={videoRef}
                            className="w-full"
                            id="uploaded-video"
                        />
                    </div>
                    {showSettings && (
                        <Settings
                            convertWithSettings={convertWithSettings}
                            videoDuration={Math.floor(videoDuration) || 0} // rounded to bottom -> 11.9s -> 11s
                        />
                    )}
                    {!showSettings && (
                        <button
                            className="w-full btn rounded-md bg-indigo-600 text-white px-4 py-3 mt-5 font-bold"
                            onClick={() => {
                                setShowSettings(true);
                            }}
                        >
                            Show settings
                        </button>
                    )}
                </>
            ) : (
                <h2>Loading video</h2>
            )}
        </div>
    );
};

export { Video };
