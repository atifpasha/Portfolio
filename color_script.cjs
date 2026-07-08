const fs = require('fs');
const files = ['public/exper.json', 'public/codings.json', 'public/contactus.json'];

files.forEach(f => {
  try {
    let data = fs.readFileSync(f, 'utf8');
    let colorMatches = data.match(/\"k\":\[([\d.]+,[\d.]+,[\d.]+,[\d.]+)\]/g);
    if(colorMatches) {
        let counts = {};
        colorMatches.forEach(c => {
           counts[c] = (counts[c] || 0) + 1;
        });
        let sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 10);
        console.log(`Top colors in ${f}:`);
        console.log(sorted);
    }
  } catch(e) { }
});
