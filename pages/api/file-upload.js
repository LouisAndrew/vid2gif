import { exec } from 'child_process';
import formidable from 'formidable-serverless'; // not sure if I can just use the regular formidable.
import path from 'path';
import fs from 'fs';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
// const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

export const config = {
    api: {
        bodyParser: false, // setting body parser to false -> Or else it is not likely that formdata could be parsed.
    },
};

export default (req, res) => {
    const publicPath = path.resolve('./public');
    const filePath = path.resolve(
        process.env === 'production' ? '/tmp' : './tmp'
    );
    const functionPath = path.resolve(publicPath, 'function/transcode.js');

    const form = formidable({ uploadDir: 'public' });
    form.keepExtensions = true;

    form.on('fileBegin', (name, file) => {
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

        const command = `FLAGS=${flags} DIR_PATH=${filePath} node --experimental-wasm-threads --experimental-wasm-bulk-memory ${functionPath}`;
        await exec(command, (err, stdout, stderr) => {
            console.log({ stdout });

            if (err) {
                res.status(400).send({
                    msg: 'Error loading ffmpeg library',
                });
                // reject(null);
                return;
            } else {
                // conversion succesful..
                const outputFilePath =
                    process.env === 'production'
                        ? '/tmp/out.gif'
                        : './tmp/out.gif';

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
            }
        });
    });
};
