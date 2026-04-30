const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
};

const mapValues = {
  '\\[#050816\\]': 'theme-bg',
  '\\[#0b1220\\]': 'theme-card',
  '\\[#111827\\]': 'theme-surface',
  '\\[#f8fafc\\]': 'theme-text',
  '\\[#94a3b8\\]': 'theme-muted',
  '\\[#22d3ee\\]': 'theme-accent',
  '\\[#1f2937\\]': 'theme-border',
  '\\[#2dd4bf\\]': 'theme-accent-sec', // teal
  '\\[#03050c\\]': 'theme-footer',
};

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [key, value] of Object.entries(mapValues)) {
    const regex = new RegExp(key, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, value);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
