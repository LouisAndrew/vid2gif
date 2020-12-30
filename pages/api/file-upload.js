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
        form.keepExtensions = true;

        const publicPath =
            process.env.NODE_ENV === 'production' ? '/' : `${__dirname}/public`;

        const dir = path.resolve(publicPath);
        const form = formidable({ uploadDir: dir });

        const functionPath = path.resolve(publicPath, 'function/transcode.js');

        form.on('fileBegin', (name, file) => {
            file.path = dir;
        });

        form.parse(req, async (err, fields, file) => {
            if (err) {
                console.log('Erro parsing');
                res.status(400).send({ msg: 'Error loading file' });
                reject(null);
                return;
            }

            const { flags } = fields;

            const command = `FLAGS=${flags} DIR_PATH=${dir} node --experimental-wasm-threads --experimental-wasm-bulk-memory ${functionPath}`;

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
