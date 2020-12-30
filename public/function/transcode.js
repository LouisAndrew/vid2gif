const fs = require('fs');
const path = require('path');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');

const ffmpeg = createFFmpeg();

/**
 * Function to actually transcode the mp4 video into gif and then writing into a file into the public directory with the filename of out.gif
 */
const run = async () => {
    const { FLAGS, DIR_PATH } = process.env;

    console.log({ DIR_PATH });

    const flags = FLAGS.split(',');
    const [timeFlag, outputDuration, ...others] = flags;

    const video = fs.readFileSync(`${DIR_PATH}/in.mp4`);
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'in.mp4', await fetchFile(video));

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

    const result = await ffmpeg.FS('readFile', 'out.gif', (err, thumb) => {
        console.log({ err, thumb });
    }); // fetch data from fs.
    await fs.promises.writeFile(`${DIR_PATH}/out.gif`, result);
    process.exit(0);
};

run();
