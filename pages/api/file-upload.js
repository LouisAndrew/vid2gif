import formidable from 'formidable-serverless'; // not sure if I can just use the regular formidable.
import path from 'path';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

dotenv.config();
ffmpeg.setFfmpegPath(ffmpegInstaller.path); // setting the path of ffmpeg

export const config = {
    api: {
        bodyParser: false, // setting body parser to false -> Or else it is not likely that formdata could be parsed.
    },
};

export default (req, res) => {
    const inProduction = process.env.NODE_ENV === 'production';

    const filePath = path.resolve(inProduction ? '/tmp' : './tmp');

    const form = formidable({ uploadDir: 'public' });
    form.keepExtensions = true;

    form.on('fileBegin', (_, file) => {
        file.path = path.resolve(filePath, 'in.mp4');
    });

    form.parse(req, async (err, fields, file) => {
        if (err) {
            console.error(err);
            // reject(null);
            res.status(400).send({ msg: 'Error loading file' });
            return;
        }

        const { flags } = fields;

        // conversion succesful..
        const outputFilePath =
            process.env === 'production' ? '/tmp/out.gif' : './tmp/out.gif';

        const [_, outputDuration, ...others] = flags.split(',');

        const command = ffmpeg(`${filePath}/in.mp4`)
            .inputOptions(others)
            .duration(outputDuration)
            .outputOption(['-f gif'])
            .save(outputFilePath);

        command.on('error', (err) => {
            console.log(err);
            res.status(400).send({ msg: 'Error converting video' });
            return;
        });

        command.on('end', () => {
            console.log('Finished');
            try {
                // upload the output file if the video is converted successfully
                cloudinary.v2.uploader.upload(
                    outputFilePath,
                    { public_id: 'out' }, // setting the filename
                    (err, result) => {
                        if (err) {
                            console.error({ err });
                            res.status(401).send({
                                msg:
                                    'Error uploading the file. It may be too large',
                            });
                            return;
                        }

                        if (result) {
                            const { secure_url } = result;

                            res.setHeader('Content-Type', 'image/gif');
                            res.status(200).send({ secure_url });
                            return;
                        }
                    }
                );
            } catch (err) {
                console.log(err);
                res.status(400).send({ msg: 'Error converting video' });
                return;
            }
        });
    });
};
