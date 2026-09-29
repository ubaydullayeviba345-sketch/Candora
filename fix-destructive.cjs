const fs = require('fs');
function fix(file) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/border-primary text-primary focus:border-primary/g, 'border-destructive text-destructive focus:border-destructive');
  fs.writeFileSync(file, c, 'utf8');
}
fix('src/app/components/AuthModal.tsx');
fix('src/app/pages/Account.tsx');
