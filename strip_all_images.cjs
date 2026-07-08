const fs = require('fs');
const files = ['public/exper.json', 'public/codings.json'];

files.forEach(f => {
  try {
      let data = JSON.parse(fs.readFileSync(f, 'utf8'));

      if (data.layers) {
          data.layers.forEach(layer => {
              if (layer.refId && layer.refId.startsWith('image_')) {
                  layer.ks.o.k = 0; 
              }
          });
      }
      if (data.assets) {
          data.assets.forEach(asset => {
              if (asset.layers) {
                   asset.layers.forEach(layer => {
                       if (layer.refId && layer.refId.startsWith('image_')) {
                           layer.ks.o.k = 0;
                       }
                   });
              }
          });
      }

      fs.writeFileSync(f, JSON.stringify(data));
      console.log(`Stripped images in ${f}!`);
  } catch(e) {}
});
