import formidable from 'formidable-serverless'; // not sure if I can just use the regular formidable.
import path from 'path';

export const config = {
    api: {
        bodyParser: false, // setting body parser to false -> Or else it is not likely that formdata could be parsed.
    },
};

export default (req, res) =>
    new Promise((resolve, reject) => {
        console.log('Executing promise.');

        const form = formidable({ uploadDir: 'uploads' });
        form.keepExtensions = true;

        form.on('fileBegin', (name, file) => {
            file.path = path.join('uploads', 'in.mp4');
        });

        form.parse(req, (err, fields, file) => {
            console.log('fields:', fields);
            console.log('files:', file);

            res.send('Done');
            resolve(null);
        });
    });
