const fs = require('fs');
let data = JSON.parse(fs.readFileSync('public/contactus.json', 'utf8'));
if(data.assets) {
    data.assets.forEach(a => {
        if(a.p) {
            console.log("Asset ID:", a.id);
            console.log("Image length:", a.p.length);
        }
    });
}
