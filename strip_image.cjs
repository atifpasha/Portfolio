const fs = require('fs');
let data = JSON.parse(fs.readFileSync('public/contactus.json', 'utf8'));

// Find the layer that uses image_0 and hide it
if (data.layers) {
    data.layers.forEach(layer => {
        if (layer.refId === 'image_0') {
            layer.ks.o.k = 0; // set opacity to 0
        }
    });
}
if (data.assets) {
    data.assets.forEach(asset => {
        if (asset.layers) {
             asset.layers.forEach(layer => {
                 if (layer.refId === 'image_0') {
                     layer.ks.o.k = 0; 
                 }
             });
        }
    });
}

fs.writeFileSync('public/contactus.json', JSON.stringify(data));
console.log("Stripped image_0 opacity!");
