import { FC, useState } from 'react';
import Input from './input';
// import styling libs
// import local components

type Props = {
    /**
     * Identifier to show if the video is already uploaded by the user
     */
    isVideoIn: boolean;
    /**
     * Identifier when the upload operation should be disabled
     */
    disableUpload: boolean;
    /**
     * Name of the file uploaded
     */
    fileName?: string;

    /**
     * Function to set the state of app into the video actually uploaded by the user.
     */
    setVideo: (file: File) => void;
};

/**
 * Component that asks user for a video input
 */
const VideoInput: FC<Props> = ({
    isVideoIn,
    fileName,
    disableUpload,
    setVideo,
}) => {
    const [errMsg, setErrMsg] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files; // get the file list from the inputElment

        if (fileList) {
            const file = fileList[0]; // get the file uploaded by the user

            if (!file) return;

            if (file.type !== 'video/mp4') {
                setErrMsg('Please upload a mp4 video file');
            } else {
                // set err msg to none, if available
                if (errMsg) {
                    setErrMsg('');
                }
                // calls setVideo from props
                setVideo(file);
                return;
            }
        }
    };

    return (
        <div className="w-full pb-6 flex-shrink-0">
            <Input
                fileName={fileName}
                isVideoIn={isVideoIn}
                handleChange={handleChange}
                disableUpload={disableUpload}
            />
            {errMsg && (
                <h5
                    className={`mt-4 text-red-400 text-sm ${
                        isVideoIn ? 'md:text-left' : 'md:text-center'
                    } md:ml-4`}
                >
                    ⛔ {errMsg}
                </h5>
            )}
        </div>
    );
};

export { VideoInput };
