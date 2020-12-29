import { useRef, useState, ChangeEvent } from 'react';

// import { TweenLite } from 'gsap';

import Archive from './assets/archive';
import './index.css';

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
     * Function to handle changes on input component
     */
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * custom input component.
 */
const Input: React.FC<Props> = ({
    isVideoIn,
    fileName,
    disableUpload,
    handleChange,
}) => {
    const topRef = useRef<HTMLOrSVGElement>(null);
    const [dragging, setDragging] = useState(false);

    /**
     * Handler function to handle when user drag a file into the label
     */
    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!dragging) {
            setDragging(true);
        }
    };
    /**
     * Handler function to handle when user is exiting the label while still dragging the file
     */
    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (dragging) {
            setDragging(false);
        }
    };
    /**
     * Handler function to handle when user is dropping a file after dragging it into the label
     * @param event: user drag event.
     */
    const handleDragDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (dragging) {
            setDragging(false);
        }

        if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
            const file = event.dataTransfer.items[0].getAsFile();

            if (file) {
                // risky? Mocking event object from the browser, so that no new function should be introduced
                const mockEvent = ({
                    target: {
                        files: [file],
                    },
                } as unknown) as ChangeEvent<HTMLInputElement>;

                handleChange(mockEvent);
            }
        }
    };

    return (
        <label
            onDragEnter={disableUpload ? undefined : handleDragEnter}
            onDragLeave={disableUpload ? undefined : handleDragLeave}
            onDragOver={disableUpload ? undefined : handleDragEnter}
            onDrop={disableUpload ? undefined : handleDragDrop}
            className={`${dragging ? 'on-drag' : ''} relative w-full flex ${
                isVideoIn
                    ? 'flex-row items-start px-0 sm:items-center'
                    : 'flex-col items-center px-4 xl:flex-row xl:items-start'
            } ${disableUpload ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <Archive
                topRef={topRef}
                isVideoIn={isVideoIn}
                className={`stroke-current  ${
                    isVideoIn
                        ? 'h-20 w-20 flex-shrink-0 text-indigo-600'
                        : 'h-40 w-40 text-gray-400'
                }`}
            />
            <div
                className={`flex flex-col ${
                    isVideoIn
                        ? 'items-start ml-2 mt-3 sm:flex-row sm:items-center sm:w-full sm:justify-between sm:ml-3 md:w-max md:mr-5'
                        : 'items-center mt-5 xl:pl-12 xl:ml-4 xl:border-l-2 xl:border-gray-200 xl:border-solid'
                } `}
            >
                {isVideoIn ? (
                    <p className="text-gray-500 font-sans font-medium mb-3 text-left flex-shrink-0 sm:mr-3 sm:mb-0 md:mr-5">
                        Uploaded: <br />
                        {fileName}
                    </p>
                ) : (
                    <>
                        <p className="text-gray-500 font-sans font-medium">
                            Drag and drop an MP4 File
                        </p>
                        <div className="flex flex-row items-center justify-between w-full my-5">
                            <span className="h-px w-1/3 bg-black" />
                            <div className="text-color-black font-bold font-sans">
                                OR
                            </div>
                            <span className="h-px w-1/3 bg-black" />
                        </div>
                    </>
                )}
                <button className="btn bg-indigo-100 border-2 border-solid border-indigo-400 text-indigo-400 px-4 py-3 rounded-md xl:w-full">
                    Select {isVideoIn && 'Another'} File
                </button>
            </div>
            <input
                type="file"
                className={`opacity-0 w-full h-full absolute ${
                    disableUpload ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                accept="video/*"
                onChange={handleChange}
                disabled={disableUpload}
            />
        </label>
    );
};

export { Input };
