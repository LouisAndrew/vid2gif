# Vid-To-GIF 📹
Simple web based video (specifically mp4) to GIF converter. Built using React and ffmpeg webassembly library.

This applicatoion is highly inspired by a webassembly tutorial by fireship.io https://www.youtube.com/watch?v=-OTc0Ki7Sv0&t=393s&ab_channel=Fireship. Support on browsers other than chrome based browsers were done using the Next JS API (Serverless function) and the output image would then uploaded into cloudinary hosting service with some limitations such as: 
- Output GIF should not be larger than ~10MB
- Slower conversion
- Input video should not really be too large, up to 1.5 GB (`JavaScript heap out of memory` Error). Reference about NodeJS memory limitation click (here)[https://medium.com/@ashleydavis75/node-js-memory-limitations-30d3fe2664c0]

###Ffmpeg library used here
- @ffmpeg/core
- @ffmpeg/ffmpeg
- fluent-ffmpeg
- @ffmpeg-instaler/ffmpeg
