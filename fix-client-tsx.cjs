const fs = require('fs');
const path = require('path');

const directories = ['src/components'];

const replacements = [
  { regex: /\btext-white\b/g, replacement: 'text-[var(--theme-text-main)]' },
  { regex: /\bbg-slate-900(?:\/[0-9]+)?\b/g, replacement: 'bg-[var(--theme-bg-main)]' },
  { regex: /\bbg-slate-800\/(?:50|80|90)\b/g, replacement: 'bg-[var(--theme-bg-surface)]' },
  { regex: /\bbg-slate-800\b/g, replacement: 'bg-[var(--theme-bg-surface)]' },
  { regex: /\bbg-slate-700(?:\/[0-9]+)?\b/g, replacement: 'bg-[var(--theme-bg-soft)]' },
  { regex: /\bbg-zinc-800(?:\/[0-9]+)?\b/g, replacement: 'bg-[var(--theme-bg-surface)]' },
  { regex: /\bbg-zinc-700(?:\/[0-9]+)?\b/g, replacement: 'bg-[var(--theme-bg-soft)]' },
  { regex: /\bbg-zinc-900(?:\/[0-9]+)?\b/g, replacement: 'bg-[var(--theme-bg-main)]' },
  { regex: /\bborder-slate-[78]00(?:\/[0-9]+)?\b/g, replacement: 'border-[var(--theme-border)]' },
  { regex: /\btext-slate-[23]00\b/g, replacement: 'text-[var(--theme-text-muted)]' },
  { regex: /\btext-slate-[45]00\b/g, replacement: 'text-[var(--theme-text-soft)]' },
  { regex: /\bplaceholder:text-gray-[56]00\b/g, replacement: 'placeholder-[var(--theme-text-soft)]' }
];

function processDirectory(directory) {
  if (!fs.existsSync(directory)) return;
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  processDirectory(dir);
}
console.log('Fixed Tailwind colors in Client JSX');