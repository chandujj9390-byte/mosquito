const fs = require('fs');

const files = [
  'js/products.js',
  'index.html',
  'checkout.html',
  'payment.html',
  'order-success.html',
  '404.html',
  'js/app.js',
  'js/cart.js',
  'js/checkout.js',
  'js/slider.js'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace relative assets/ with /assets/
  content = content.replace(/(['"])\.\/assets\//g, '$1/assets/');
  content = content.replace(/(['"])assets\//g, '$1/assets/');
  content = content.replace(/src="assets\//g, 'src="/assets/');
  content = content.replace(/src="\.\/assets\//g, 'src="/assets/');
  content = content.replace(/href="styles\//g, 'href="/styles/');
  content = content.replace(/src="js\//g, 'src="/js/');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated root-relative paths in ${file}`);
});
