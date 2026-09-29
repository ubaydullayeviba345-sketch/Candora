const fs = require('fs');

function fix(file) {
  let c = fs.readFileSync(file, 'utf8');
  
  // Replace all emerald-500/60 and emerald-600 with primary
  c = c.replace(/border-emerald-500\/60 focus:border-emerald-500/g, 'border-primary/60 focus:border-primary text-primary');
  c = c.replace(/text-emerald-600 dark:text-emerald-400/g, 'text-primary');
  c = c.replace(/border-destructive text-destructive focus:border-destructive/g, 'border-primary text-primary focus:border-primary');
  
  // Replace amber mismatched colors to just standard destructive or primary error
  // But wait, user wants matching state to be primary. 
  // What about mismatch state? If mismatch, they should be red (destructive).
  // "bir sariq biri yashi parollar mos kerldi degan ham yashi dizaynga candoraning dizayniga moslab ularniyam rangini uzgartr"
  // User just wants everything that represents success or error to match the design. Let's make error = red (destructive), success = gold (primary).
  c = c.replace(/border-amber-600\/60 text-amber-600 focus:border-amber-600 dark:border-amber-500\/60 dark:text-amber-500 dark:focus:border-amber-500/g, 'border-destructive text-destructive focus:border-destructive');
  
  fs.writeFileSync(file, c, 'utf8');
}

fix('src/app/components/AuthModal.tsx');
fix('src/app/pages/Account.tsx');
console.log('Fixed colors');
