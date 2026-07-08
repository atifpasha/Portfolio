const https = require('https');
const fs = require('fs');

const download = (url, path) => {
  https.get(url, (res) => {
    const file = fs.createWriteStream(path);
    res.pipe(file);
    file.on('finish', () => file.close());
  });
};

download('https://raw.githubusercontent.com/LottieFiles/lottie-react/master/example/src/assets/developer.json', 'public/experience.json');
