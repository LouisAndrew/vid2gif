import { exec } from 'child_process';
import formidable from 'formidable-serverless'; // not sure if I can just use the regular formidable.
import path from 'path';

export const config = {
    api: {
        bodyParser: false, // setting body parser to false -> Or else it is not likely that formdata could be parsed.
    },
};

export default (req, res) =>
    new Promise((resolve, reject) => {
        const form = formidable({ uploadDir: 'files' });
        form.keepExtensions = true;

        form.on('fileBegin', (name, file) => {
            file.path = path.join('files', 'in.mp4');
        });

        form.parse(req, async (err, fields, file) => {
            if (err) {
                console.log('Erro parsing');
                res.status(400).send({ msg: 'Error loading file' });
                reject(null);
                return;
            }

            const { flags } = fields;

            const command = `FLAGS=${flags} node --experimental-wasm-threads --experimental-wasm-bulk-memory src/functions/transcode.js`;

            await exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    console.log('Error exec');
                    res.status(400).send({
                        msg: 'Error loading ffmpeg library',
                    });
                    reject(null);
                    return;
                } else {
                    res.status(200).send({ msg: 'Success' });
                    resolve(null);
                    return;
                }
            });
        });
    });
