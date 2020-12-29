import { FC, useState } from 'react';
// import styling libs
import InputRange, { Range } from 'react-input-range';
import 'react-input-range/lib/css/index.css';
// import local components

/**
 * Types of available speed option
 */
export type Speed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

/**
 * Convertion settings for the uploaded video
 */
export type ConvertionSettings = {
    /**
     * Speed of the output gif after converted
     */
    speed: Speed;
    /**
     * Offset of the video from start point
     * ⚠ negative value if this flag should not be applied
     */
    seekStart: number;
    /**
     * Offset of the video from end point
     * ⚠ negative value if this flag should not be applied
     */
    seekEnd: number;
};

type Props = {
    /**
     * Duration of the video
     */
    videoDuration: number;
    /**
     * Convert the given video to a gif with the settings provided by this component,
     */
    convertWithSettings: (settings: ConvertionSettings) => void;
};

/**
 * Simple converter to convert video duration from second(s) format to minutes.
 * @param seconds
 */
const secondToMins = (seconds: number) => {
    /**
     * Function to add padding / add a 0 before the number if it is smaller than 10
     * @param num to be formatted number
     */
    const pad = (num: number) => (num > 9 ? num : `0${num}`);

    const secondsPerMin = 60;
    return `${Math.floor(seconds / secondsPerMin)}:${pad(
        seconds % secondsPerMin
    )}`;
};

/**
 * Component that render settings for the convertion that should be done for the video.
 */
const Settings: FC<Props> = ({ videoDuration, convertWithSettings }) => {
    // const { speed, seekStart, seekEnd } = currSettings;
    const [
        convertionSettings,
        setConvertionSettings,
    ] = useState<ConvertionSettings>({
        speed: 1,
        seekStart: 0,
        seekEnd: videoDuration,
    });

    const { seekEnd, seekStart } = convertionSettings;

    /**
     * Set the speed of the output video.
     * @param newSpeed
     */
    const setSpeed = (newSpeed: Speed) => {
        setConvertionSettings((prev) => ({
            ...prev,
            speed: newSpeed,
        }));
    };

    /**
     * Function to set start-and end offset of the video.
     * @param value an array containing percentage of start and end offset of the video
     */
    const seek = (value: number | Range) => {
        if (typeof value !== 'number') {
            const { min, max } = value;

            setConvertionSettings((prev) => ({
                ...prev,
                seekStart: min,
                seekEnd: max,
            }));
        }
    };

    const options = [
        { label: '0.5', value: 0.5 },
        { label: '0.75', value: 0.75 },
        { label: '1', value: 1 },
        { label: '1.25', value: 1.25 },
        { label: '1.5', value: 1.5 },
        { label: '2', value: 2 },
    ];

    return (
        <div className="wrapper">
            <h4 className="font-sans font-medium text-xl text-left py-4">
                Conversion settings
            </h4>
            <div className="font-sans block pb-2 text-l text-left text-gray-500 font-medium">
                ⚡ Speed:
                <br />
                {options.map((op) => (
                    <label
                        htmlFor={op.value.toString()}
                        className="mr-4 font-normal mt-3 cursor-pointer inline-block"
                    >
                        <input
                            type="radio"
                            name="speed"
                            id={op.value.toString()}
                            defaultChecked={op.value === 1}
                            value={op.value}
                            className="mr-2 cursor-pointer"
                            onChange={(e) => {
                                setSpeed((e.target.value as unknown) as Speed);
                            }}
                        />
                        {op.label} x
                    </label>
                ))}
            </div>

            <div className="py-3">
                <h5 className="font-sans block pb-5 text-l text-left text-gray-500 font-medium">
                    👀 Seek
                </h5>
                <div className="px-3 mt-2">
                    <InputRange
                        step={1}
                        minValue={0}
                        maxValue={videoDuration}
                        value={{ max: seekEnd, min: seekStart }}
                        onChange={seek}
                        formatLabel={(value) => secondToMins(value)}
                    />
                </div>
            </div>

            <button
                className="w-full btn rounded-md bg-indigo-600 text-white px-4 py-3 mt-5"
                onClick={() => {
                    convertWithSettings(convertionSettings);
                }}
            >
                convert to GIF
            </button>
        </div>
    );
};

export { Settings };

/* <Range
                step={1}
                min={0}
                max={videoDuration || 1}
                values={[seekStart, videoDuration - seekEnd]}
                onChange={seek}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '6px',
                            width: '200px',
                            backgroundColor: '#ccc',
                        }}
                    >
                        {children}
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '14px',
                            width: '14px',
                            backgroundColor: '#999',
                        }}
                    />
                )}
            /> */
