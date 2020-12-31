// import gif from '../../../files/out.gif'; // files/out.gif must exist and next-images deps must be installed

type Props = {
    /**
     * Url of the output gif
     */
    gifUrl: string;
    /**
     * Function to show the initial vido input.
     */
    showVideo: () => void;
};

/**
 * Component where the gif result of the conversion is shown.
 */
const Gif: React.FC<Props> = ({ gifUrl, showVideo }) => {
    const createUrl = () => {};

    return (
        <div className="w-full flex-shrink-0">
            <div className="flex flex-row justify-between">
                <h4 className="font-sans font-medium text-xl">GIF Output</h4>
                <button
                    className="btn font-medium text-indigo-500"
                    onClick={showVideo}
                >
                    Show Video
                </button>
            </div>
            <img
                className="rounded-md shadow-2xl overflow-hidden my-2"
                src={gifUrl}
                alt="output GIF"
            />
            <a
                href={gifUrl}
                download={true}
                target={gifUrl.indexOf('http') !== -1 ? '_blank' : ''} // checking if the gif URL is not served from local filesystem
                className="w-full block btn rounded-md bg-indigo-600 text-white px-4 py-3 mt-5"
            >
                Download GIF
            </a>
        </div>
    );
};

export { Gif };
