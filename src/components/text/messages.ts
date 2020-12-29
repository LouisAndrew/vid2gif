/**
 * Map object: Displays appropriate message for the appropriate state of the app
 */
const messages = {
    /**
     * When nothing happens in the app (no gif, no loading and no video)
     */
    0: {
        headerMsg: 'Welcome to Vid-To-GIF! 📹',
        bodyMsg: 'Please upload an mp4 video to continue',
    },
    /**
     * When user uploaded the video
     */
    1: {
        headerMsg: 'A video is uploaded 👍',
        bodyMsg:
            'You could set the speed of the output GIF in comparison to its input mp4 video and set the start / end of where the GIF file should be converted into.',
    },
    /**
     * When the app is converting video to gif.
     */
    2: {
        headerMsg: 'Converting your video into GIF.. ⌛',
        bodyMsg: "Please wait. This won't take long...",
    },
    /**
     * When the convertion is done
     */
    3: {
        headerMsg: 'Your conversion is done! ✅',
        bodyMsg:
            "Here's your brand new GIF. You could download the GIF image by clicking the button below",
    },
    /**
     * When there's an error in the app
     */
    99: {
        headerMsg: 'Oh no! 🚫',
        bodyMsg:
            'An error occurred. Please refresh the page. Sorry for the inconvenience',
    },
};

export default messages;
