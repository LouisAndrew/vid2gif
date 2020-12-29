import formidable from 'formidable-serverless';
import multer from 'multer';

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
        bodyParser: {
            sizeLimit: '100mb',
        },
    },
};

export default (req, res) =>
    new Promise((resolve, reject) => {
        console.log('Executing promise.');

        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) reject(err);

            console.log({ fields, files });
            res.send('Success');
            resolve({ fields, files });
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
