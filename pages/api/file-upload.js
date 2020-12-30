import formidable from 'formidable-serverless';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

export const config = {
    api: {
        bodyParser: false,
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

// function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
//     return new Promise((resolve, reject) => {
//         fn(req, res, (result) => {
//             if (result instanceof Error) {
//                 return reject(result);
//             }

//             return resolve(result);
//         });
//     });
// }

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//     const a = await upload.single('in')(req as any, null, (err) => {
//         console.log(err);
//         console.log(req);
//     });
//     await res.send('Wut');
// };
