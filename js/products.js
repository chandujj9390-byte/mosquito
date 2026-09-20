/**
 * MOSQUITO Editorial Catalog Database
 * Curated luxury apparel featuring exact Men and Women category hierarchies
 */

const CURRENCIES = {
  INR: { symbol: '₹', rate: 1.0, label: 'INR (₹)', decimals: 0 }
};

const MEN_CATEGORIES = [
  'Embroidered Shirts',
  'Shirts',
  'T-Shirts',
  'Hoodies',
  'Formal Pants',
  'Jeans'
];

const WOMEN_CATEGORIES = [
  'Crop Tops',
  'T-Shirts',
  'Short Anarkali\'s',
  'Jeans',
  'Korean Pants',
  'Bodycon',
  'Checked Shirts',
  'Short Kurtis',
  'Formal Shirts'
];

if (typeof window !== 'undefined') {
  window.MEN_CATEGORIES = MEN_CATEGORIES;
  window.WOMEN_CATEGORIES = WOMEN_CATEGORIES;
}

const PRODUCTS = [
  // ================= MEN'S COLLECTION =================
  {
    id: 'm-01',
    name: 'MOSQUITO EMBROIDERED SHIRT',
    collection: 'men',
    category: 'Embroidered Shirts',
    price: 849,
    fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'MSQ PICK',
    description: 'Fine Egyptian cotton featuring intricate tonal gold Mosquito embroidery on back and collar points. Relaxed silhouette with spread collar.',
    composition: '100% Giza Long-Staple Cotton',
    care: 'Cold Gentle Wash or Dry Clean',
    modelInfo: 'Model is 6\'1" / 185cm wearing size L',
    images: [
      '/assets/men/Embroided Shirts.jpg',
      '/assets/men/Embroided Shirts.avif'
    ],
    colors: [
      { name: 'Oatmeal Beige', hex: '#D7D0C5' },
      { name: 'Onyx Noir', hex: '#161616' }
    ]
  },
  {
    id: 'm-02',
    name: 'EMBROIDERED RESORT SHIRT',
    collection: 'men',
    category: 'Embroidered Shirts',
    price: 849,
    fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'BESTSELLER',
    description: 'Bespoke artisanal embroidery on breathable woven cotton. Structured cuban collar with custom engraved horn buttons.',
    composition: '100% Premium Bio-Washed Cotton',
    care: 'Machine Wash Cold, Hang Dry',
    modelInfo: 'Model is 6\'0" / 183cm wearing size M',
    images: [
      '/assets/men/Embroided Shirts (2).avif',
      '/assets/men/Embroided Shirts.jpg'
    ],
    colors: [
      { name: 'Ivory Cream', hex: '#F3EFE6' },
      { name: 'Mocha Tan', hex: '#8B6B4F' }
    ]
  },
  {
    id: 'm-03',
    name: 'CLASSIC COTTON SHIRT',
    collection: 'men',
    category: 'Shirts',
    price: 799,
    fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'NEW DROP',
    description: 'Clean Scandinavian silhouette cut from smooth high-density cotton. Features a structured point collar and tailored cuffs.',
    composition: '100% Cotton Poplin',
    care: 'Machine Wash Cold, Warm Iron',
    modelInfo: 'Model is 6\'2" / 188cm wearing size L',
    images: [
      '/assets/men/shirts.png',
      '/assets/men/shirts (2).png'
    ],
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Sky Blue', hex: '#87CEEB' }
    ]
  },
  {
    id: 'm-04',
    name: 'TAILORED CASUAL SHIRT',
    collection: 'men',
    category: 'Shirts',
    price: 799,
    fit: 'Slim',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'CORE',
    description: 'Versatile smart-casual button-down shirt designed with modern minimalist lines and curved hemline.',
    composition: '100% Combed Cotton',
    care: 'Machine Wash Cold, Hang Dry',
    modelInfo: 'Model is 6\'1" / 185cm wearing size M',
    images: [
      '/assets/men/shirts (2).png',
      '/assets/men/shirts.jpg'
    ],
    colors: [
      { name: 'Charcoal Slate', hex: '#3E424B' },
      { name: 'Olive Green', hex: '#556B2F' }
    ]
  },
  {
    id: 'm-05',
    name: 'OVERSIZED POPLIN SHIRT',
    collection: 'men',
    category: 'Shirts',
    price: 799,
    fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    badge: 'POPULAR',
    description: 'Dropped shoulder oversized shirt with relaxed fluid drape and matte buttons for effortless styling.',
    composition: '100% Japanese High-Density Cotton',
    care: 'Machine Wash Cold, Hang Dry',
    modelInfo: 'Model is 6\'2" / 188cm wearing size XL',
    images: [
      '/assets/men/shirts.jpg',
      '/assets/men/shirts.png'
    ],
    colors: [
      { name: 'Warm Taupe', hex: '#B38B6D' },
      { name: 'Jet Black', hex: '#111111' }
    ]
  },
  {
    id: 'm-06',
    name: 'CHILL OVERSIZED T-SHIRT',
    collection: 'men',
    category: 'T-Shirts',
    price: 999,
    fit: 'Oversized',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    badge: 'MSQ PICK',
    description: '280 GSM heavyweight combed cotton tee with boxy dropped-shoulder silhouette and ribbed neckband.',
    composition: '100% Ring-Spun Heavyweight Cotton (280 GSM)',
    care: 'Machine Wash Cold Inside-Out',
    modelInfo: 'Model is 6\'1" / 185cm wearing size L',
    images: [
      '/assets/men/T-shirts.jpg',
      '/assets/men/T-shirts.avif'
    ],
    colors: [
      { name: 'Mustard Honey', hex: '#C28E32' },
      { name: 'Onyx Noir', hex: '#161616' }
    ]
  },
  {
    id: 'm-07',
    name: 'HEAVYWEIGHT CREW T-SHIRT',
    collection: 'men',
    category: 'T-Shirts',
    price: 999,
    fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'ESSENTIAL',
    description: 'Substantial 260 GSM single-jersey cotton knit with reinforced neck seam and clean minimal stitch lines.',
    composition: '100% Bio-Washed Combed Cotton (260 GSM)',
    care: 'Cold Machine Wash',
    modelInfo: 'Model is 6\'0" / 183cm wearing size M',
    images: [
      '/assets/men/T-shirts.avif',
      '/assets/men/T-shirts.jpg'
    ],
    colors: [
      { name: 'Slate Teal', hex: '#2A5D67' },
      { name: 'Off-White', hex: '#FAF9F6' }
    ]
  },
  {
    id: 'm-08',
    name: 'SIGNATURE BOX T-SHIRT',
    collection: 'men',
    category: 'T-Shirts',
    price: 999,
    fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'HOT',
    description: 'Wide boxy cut streetwear tee with subtle tonal branding and soft pre-shrunk cotton touch.',
    composition: '100% Pre-Shrunk Jersey Cotton (250 GSM)',
    care: 'Machine Wash Cold',
    modelInfo: 'Model is 6\'1" / 185cm wearing size L',
    images: [
      '/assets/men/T- shirts.avif',
      '/assets/men/T- shirts (2).avif'
    ],
    colors: [
      { name: 'Washed Olive', hex: '#5A6351' },
      { name: 'Charcoal Black', hex: '#222222' }
    ]
  },
  {
    id: 'm-09',
    name: 'MINIMALIST STREET T-SHIRT',
    collection: 'men',
    category: 'T-Shirts',
    price: 999,
    fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'NEW',
    description: 'Architectural relaxed fit crewneck with clean hems and breathable cotton texture for everyday luxury.',
    composition: '100% Combed Compact Cotton',
    care: 'Cold Gentle Wash',
    modelInfo: 'Model is 5\'11" / 180cm wearing size M',
    images: [
      '/assets/men/T- shirts (2).avif',
      '/assets/men/T- shirts.avif'
    ],
    colors: [
      { name: 'Desert Sand', hex: '#D2B48C' },
      { name: 'Pitch Black', hex: '#0B0B0B' }
    ]
  },
  {
    id: 'm-10',
    name: 'OVERSIZED FRENCH TERRY HOODIE',
    collection: 'men',
    category: 'Hoodies',
    price: 1299,
    fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'BESTSELLER',
    description: '450 GSM ultra-heavy loopback fleece hoodie with crossover double-layered hood and kangaroo pocket.',
    composition: '100% French Terry Cotton (450 GSM)',
    care: 'Cold Machine Wash on Gentle',
    modelInfo: 'Model is 6\'2" / 188cm wearing size L',
    images: [
      '/assets/men/Hoodies.jpg',
      '/assets/men/Hoodies (2).jpg'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0F0F10' },
      { name: 'Stone Heather', hex: '#8A8D91' }
    ]
  },
  {
    id: 'm-11',
    name: 'SIGNATURE FLEECE HOODIE',
    collection: 'men',
    category: 'Hoodies',
    price: 1299,
    fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'WINTER DROP',
    description: 'Heavyweight brushed fleece hoodie with custom ribbed cuffs, dropped shoulders, and metal eyelets.',
    composition: '100% Brushed Fleece Cotton (480 GSM)',
    care: 'Cold Machine Wash, Line Dry',
    modelInfo: 'Model is 6\'1" / 185cm wearing size L',
    images: [
      '/assets/men/Hoodies (2).jpg',
      '/assets/men/Hoodies.jpg'
    ],
    colors: [
      { name: 'Forest Night', hex: '#1F2A24' },
      { name: 'Vintage Black', hex: '#1C1C1E' }
    ]
  },
  {
    id: 'm-12',
    name: 'MEN FORMAL TROUSERS',
    collection: 'men',
    category: 'Formal Pants',
    price: 999,
    fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'TAILORED',
    description: 'High-waisted tailored trousers featuring deep inverted pleats, waistband adjusters, and fluid straight leg break.',
    composition: '70% Worsted Wool, 28% Viscose, 2% Spandex',
    care: 'Dry Clean or Gentle Cold Cycle',
    modelInfo: 'Model is 6\'0" / 183cm wearing size M (32)',
    images: [
      '/assets/men/Formal trousers.avif'
    ],
    colors: [
      { name: 'Muted Taupe', hex: '#7D756C' },
      { name: 'Jet Black', hex: '#191919' }
    ]
  },
  {
    id: 'm-13',
    name: 'RELAXED FIT JEANS',
    collection: 'men',
    category: 'Jeans',
    price: 1499,
    fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    badge: 'RAW DENIM',
    description: '14.5oz authentic shuttle-loom selvedge denim. Mid-rise with clean front creases designed to evolve unique fade patterns.',
    composition: '100% Japanese Selvedge Cotton (14.5 oz)',
    care: 'Wash inside-out in cold water',
    modelInfo: 'Model is 6\'1" / 185cm wearing size 32 (M)',
    images: [
      '/assets/men/jeans pants.avif'
    ],
    colors: [
      { name: 'Deep Indigo', hex: '#1C273A' },
      { name: 'Washed Grey', hex: '#3E4146' }
    ]
  },

  // ================= WOMEN'S COLLECTION =================
  {
    id: 'w-01',
    name: 'SIGNATURE CROPPED TOP',
    collection: 'women',
    category: 'Crop Tops',
    price: 899,
    fit: 'Oversized',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    badge: 'MSQ PICK',
    description: 'Cropped boxy silhouette cut from 260 GSM combed cotton. Rolled cuffs and soft gold mosquito signature emblem.',
    composition: '100% Bio-Washed Combed Cotton (260 GSM)',
    care: 'Cold Machine Wash inside-out',
    modelInfo: 'Model is 5\'9" / 175cm wearing size S (Oversized Crop)',
    images: [
      '/assets/women/Crop Top.avif',
      '/assets/women/Crop Top 2.avif'
    ],
    colors: [
      { name: 'Mustard Honey', hex: '#C28E32' },
      { name: 'Dusty Sky', hex: '#6D8EA0' }
    ]
  },
  {
    id: 'w-02',
    name: 'RELAXED STREET CROP TOP',
    collection: 'women',
    category: 'Crop Tops',
    price: 899,
    fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    badge: 'NEW DROP',
    description: 'Effortless minimalist crop top crafted with clean hems and breathable lightweight jersey cotton.',
    composition: '100% Ring-Spun Cotton',
    care: 'Machine Wash Cold',
    modelInfo: 'Model is 5\'8" / 173cm wearing size S',
    images: [
      '/assets/women/Crop Top 3.avif',
      '/assets/women/Crop top 4.avif'
    ],
    colors: [
      { name: 'Chalk White', hex: '#F5F5F3' },
      { name: 'Jet Black', hex: '#111111' }
    ]
  },
  {
    id: 'w-03',
    name: 'CLASSIC CREW T-SHIRT',
    collection: 'women',
    category: 'T-Shirts',
    price: 799,
    fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'CORE ESSENTIAL',
    description: 'Everyday relaxed crewneck crafted from featherweight ring-spun cotton with clean bound neckline.',
    composition: '100% Ring-Spun Cotton (200 GSM)',
    care: 'Cold Machine Wash',
    modelInfo: 'Model is 5\'9" / 175cm wearing size S',
    images: [
      '/assets/women/t shirts.avif',
      '/assets/women/t shirts 2.avif'
    ],
    colors: [
      { name: 'Chalk White', hex: '#F4F4F2' },
      { name: 'Pitch Black', hex: '#111111' }
    ]
  },
  {
    id: 'w-04',
    name: 'OVERSIZED GRAPHIC T-SHIRT',
    collection: 'women',
    category: 'T-Shirts',
    price: 799,
    fit: 'Oversized',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'HOT DROP',
    description: 'Trendy boxy cut streetwear tee with dropped shoulders and signature artistic tonal branding.',
    composition: '100% Combed Heavy Cotton (240 GSM)',
    care: 'Machine Wash Cold Inside-Out',
    modelInfo: 'Model is 5\'9" / 175cm wearing size M',
    images: [
      '/assets/women/t shirts 3.avif',
      '/assets/women/t shirts 4.avif'
    ],
    colors: [
      { name: 'Onyx Noir', hex: '#161616' },
      { name: 'Sage Mist', hex: '#9EAA9A' }
    ]
  },
  {
    id: 'w-05',
    name: 'CHILL ESSENTIAL TEE',
    collection: 'women',
    category: 'T-Shirts',
    price: 799,
    fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    badge: 'MSQ PICK',
    description: 'Ultra-soft bio-washed cotton essential for all-day comfort and easy layering.',
    composition: '100% Bio-Washed Cotton (220 GSM)',
    care: 'Cold Gentle Wash',
    modelInfo: 'Model is 5\'8" / 173cm wearing size S',
    images: [
      '/assets/women/t shirts 5.avif',
      '/assets/women/t shirts 6.avif'
    ],
    colors: [
      { name: 'Ivory Cream', hex: '#F3EFE6' },
      { name: 'Muted Mauve', hex: '#9B7E88' }
    ]
  },
  {
    id: 'w-06',
    name: 'HANDCRAFTED SHORT ANARKALI',
    collection: 'women',
    category: 'Short Anarkali\'s',
    price: 1699,
    fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'MSQ PICK',
    description: 'Flared tiered short anarkali dress with delicate gold gota patti neckline trim and breathable chanderi silk-cotton blend.',
    composition: '70% Chanderi Cotton, 30% Mulberry Silk',
    care: 'Dry Clean Only',
    modelInfo: 'Model is 5\'8" / 173cm wearing size S',
    images: [
      '/assets/women/Short Anarkali.avif',
      '/assets/women/Short Anarkali 2.avif'
    ],
    colors: [
      { name: 'Emerald Teal', hex: '#1B4D47' },
      { name: 'Wine Plum', hex: '#582136' }
    ]
  },
  {
    id: 'w-07',
    name: 'RAW DENIM WIDE-LEG JEANS',
    collection: 'women',
    category: 'Jeans',
    price: 1499,
    fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'NEW DROP',
    description: 'High-rise wide-leg silhouette in premium 13.5 oz organic washed denim with clean seam finishes.',
    composition: '100% GOTS Organic Denim (13.5 oz)',
    care: 'Cold Wash Inside Out',
    modelInfo: 'Model is 5\'10" / 178cm wearing size 28 (S)',
    images: [
      '/assets/women/Jeans.avif',
      '/assets/women/Jeans 2.avif'
    ],
    colors: [
      { name: 'Vintage Blue', hex: '#415D7A' },
      { name: 'Washed Grey', hex: '#484A50' }
    ]
  },
  {
    id: 'w-08',
    name: 'VINTAGE STRAIGHT JEANS',
    collection: 'women',
    category: 'Jeans',
    price: 1499,
    fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'BESTSELLER',
    description: 'Classic 90s vintage straight-cut denim with comfortable mid-rise and subtle faded wash.',
    composition: '100% Cotton Denim (13 oz)',
    care: 'Cold Machine Wash',
    modelInfo: 'Model is 5\'9" / 175cm wearing size 28',
    images: [
      '/assets/women/Jeans 3.avif',
      '/assets/women/Jeans.avif'
    ],
    colors: [
      { name: 'Light Indigo', hex: '#6388A5' },
      { name: 'Charcoal Wash', hex: '#333333' }
    ]
  },
  {
    id: 'w-09',
    name: 'HIGH-WAIST KOREAN PLEATED PANTS',
    collection: 'women',
    category: 'Korean Pants',
    price: 1199,
    fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'MSQ PICK',
    description: 'Minimalist Korean-cut tailored trousers with double inverted front pleats and flowy wide-leg drape.',
    composition: '80% Korean Polyester Blend, 20% Rayon',
    care: 'Machine Wash Gentle Cold',
    modelInfo: 'Model is 5\'10" / 178cm wearing size S',
    images: [
      '/assets/women/Formal Pants.avif',
      '/assets/women/Formal Pants 2.avif'
    ],
    colors: [
      { name: 'Charcoal Black', hex: '#1E1E1E' },
      { name: 'Cream Bone', hex: '#EAE6DF' }
    ]
  },
  {
    id: 'w-10',
    name: 'SCULPTURAL BODYCON MINI DRESS',
    collection: 'women',
    category: 'Bodycon',
    price: 1599,
    fit: 'Slim',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    badge: 'MSQ PICK',
    description: 'Sculptural silhouette hugging bodycon dress designed with premium stretch rib knit fabric.',
    composition: '90% Sandwashed Knit, 10% Elastane',
    care: 'Hand Wash Cold or Eco Dry Clean',
    modelInfo: 'Model is 5\'10" / 178cm wearing size S',
    images: [
      '/assets/women/Bodycon.avif',
      '/assets/women/Bodycon 2.avif'
    ],
    colors: [
      { name: 'Midnight Noir', hex: '#141416' },
      { name: 'Champagne Pearl', hex: '#EAE5DB' }
    ]
  },
  {
    id: 'w-11',
    name: 'RUCHED EVENING BODYCON DRESS',
    collection: 'women',
    category: 'Bodycon',
    price: 1699,
    fit: 'Slim',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    badge: 'PARTY DROP',
    description: 'Sophisticated ruched side detailing with elegant square neckline for evening celebrations.',
    composition: '92% Double-Knit Cotton, 8% Spandex',
    care: 'Gentle Cold Wash',
    modelInfo: 'Model is 5\'9" / 175cm wearing size S',
    images: [
      '/assets/women/Bodycon 3.avif',
      '/assets/women/Bodycon 4.avif'
    ],
    colors: [
      { name: 'Burgundy Crimson', hex: '#58111A' },
      { name: 'Mocha Bronze', hex: '#634735' }
    ]
  },
  {
    id: 'w-12',
    name: 'OVERSIZED FLANNEL CHECKED SHIRT',
    collection: 'women',
    category: 'Checked Shirts',
    price: 999,
    fit: 'Oversized',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'NEW DROP',
    description: 'Soft brushed cotton twill checked shirt with relaxed dropped shoulders and dual chest utility pockets.',
    composition: '100% Brushed Twill Cotton',
    care: 'Cold Wash, Tumble Dry Low',
    modelInfo: 'Model is 5\'9" / 175cm wearing size S',
    images: [
      '/assets/women/Checked Shirt.avif',
      '/assets/women/Checked Shirt 2.avif'
    ],
    colors: [
      { name: 'Emerald Plaid', hex: '#21473E' },
      { name: 'Burgundy Check', hex: '#4E1E2B' }
    ]
  },
  {
    id: 'w-13',
    name: 'VINTAGE PLAID BOYFRIEND SHIRT',
    collection: 'women',
    category: 'Checked Shirts',
    price: 999,
    fit: 'Oversized',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'TRENDING',
    description: 'Relaxed boyfriend-fit plaid shirt featuring curved hemline and tortoiseshell buttons.',
    composition: '100% Pure Woven Cotton',
    care: 'Machine Wash Cold',
    modelInfo: 'Model is 5\'8" / 173cm wearing size M',
    images: [
      '/assets/women/Checked Shirt 3.avif',
      '/assets/women/Checked Shirt 4.avif'
    ],
    colors: [
      { name: 'Navy Tartan', hex: '#1F2E47' },
      { name: 'Coffee Brown', hex: '#4A3326' }
    ]
  },
  {
    id: 'w-14',
    name: 'PRINTED COTTON SHORT KURTI',
    collection: 'women',
    category: 'Short Kurtis',
    price: 899,
    fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'MSQ PICK',
    description: 'Modern straight-cut short kurti with delicate ethnic motifs and split mandarin collar.',
    composition: '100% Handloom Cotton',
    care: 'Hand Wash Cold',
    modelInfo: 'Model is 5\'8" / 173cm wearing size S',
    images: [
      '/assets/women/Printed Cotton Kurti.avif',
      '/assets/women/Printed Cotton Kurti 2.avif'
    ],
    colors: [
      { name: 'Indigo Flora', hex: '#2B3D52' },
      { name: 'Terracotta Rust', hex: '#B85D43' }
    ]
  },
  {
    id: 'w-15',
    name: 'ARTISANAL FLORAL SHORT KURTI',
    collection: 'women',
    category: 'Short Kurtis',
    price: 899,
    fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'POPULAR',
    description: 'Artisanal block-printed breathable cotton tunic with 3/4th sleeves and side slits.',
    composition: '100% Pure Organic Cotton',
    care: 'Machine Wash Cold',
    modelInfo: 'Model is 5\'9" / 175cm wearing size S',
    images: [
      '/assets/women/Printed Cotton Kurti 3.avif',
      '/assets/women/Printed Cotton Kurti.avif'
    ],
    colors: [
      { name: 'Mustard Honey', hex: '#D29E4C' },
      { name: 'Ivory White', hex: '#F6F5F2' }
    ]
  },
  {
    id: 'w-16',
    name: 'SILK-BLEND TAILORED FORMAL SHIRT',
    collection: 'women',
    category: 'Formal Shirts',
    price: 1199,
    fit: 'Slim',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    badge: 'NEW DROP',
    description: 'Sleek concealed placket tailored formal shirt crafted from silk-viscose crepe for a fluid professional drape.',
    composition: '60% Viscose Crepe, 40% Mulberry Silk',
    care: 'Dry Clean or Hand Wash Cold',
    modelInfo: 'Model is 5\'10" / 178cm wearing size S',
    images: [
      '/assets/women/Women formal Shirt.avif',
      '/assets/women/Women formal Shirt 2.avif'
    ],
    colors: [
      { name: 'Onyx Black', hex: '#161616' },
      { name: 'Porcelain White', hex: '#F8F8F7' }
    ]
  },
  {
    id: 'w-17',
    name: 'CRISP EXECUTIVE FORMAL SHIRT',
    collection: 'women',
    category: 'Formal Shirts',
    price: 1199,
    fit: 'Slim',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'EXECUTIVE',
    description: 'Structured high-thread-count cotton shirt with French cuffs and precision dart tailoring.',
    composition: '100% Giza Long-Staple Cotton',
    care: 'Machine Wash Warm, Iron Smooth',
    modelInfo: 'Model is 5\'9" / 175cm wearing size S',
    images: [
      '/assets/women/Women formal Shirt 3.avif',
      '/assets/women/Women formal Shirt 4.avif'
    ],
    colors: [
      { name: 'Powder Blue', hex: '#B0C4DE' },
      { name: 'Crisp White', hex: '#FFFFFF' }
    ]
  },
  {
    id: 'w-18',
    name: 'MINIMALIST SPREAD COLLAR SHIRT',
    collection: 'women',
    category: 'Formal Shirts',
    price: 1199,
    fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    badge: 'ATELIER CUT',
    description: 'Modern relaxed formal shirt with clean architectural collar line and mother-of-pearl buttons.',
    composition: '100% Compact Poplin Cotton',
    care: 'Machine Wash Cold',
    modelInfo: 'Model is 5\'10" / 178cm wearing size M',
    images: [
      '/assets/women/Women formal Shirt 5.avif',
      '/assets/women/Women formal Shirt 6.avif'
    ],
    colors: [
      { name: 'Soft Sand', hex: '#E2DAC8' },
      { name: 'Midnight Navy', hex: '#182030' }
    ]
  },
  {
    id: 'w-19',
    name: 'MODERN RELAXED OFFICE SHIRT',
    collection: 'women',
    category: 'Formal Shirts',
    price: 1199,
    fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    badge: 'BESTSELLER',
    description: 'Contemporary everyday business shirt with breathable drape and curved tail hem.',
    composition: '100% Soft Cotton Broadcloth',
    care: 'Machine Wash Cold, Hang Dry',
    modelInfo: 'Model is 5\'9" / 175cm wearing size S',
    images: [
      '/assets/women/Women formal Shirt 7.avif',
      '/assets/women/Women formal Shirt 8.avif'
    ],
    colors: [
      { name: 'Blush Rose', hex: '#E8CCD7' },
      { name: 'Classic Slate', hex: '#4A5568' }
    ]
  }
];

const LOOKBOOK = {
  men: {
    heroTitle: 'AUTUMN / WINTER 2026',
    heroSubtitle: 'MONOLITHIC DRAPE & ARCHITECTURAL SILHOUETTES',
    heroTag: 'EDITION NO. 09 • INDIA',
    heroImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=90',
    editorialQuote: '"Form follows silence. Precision cuts crafted for the modern metropolitan."',
    curator: 'Designed in Stockholm. Flagship Stores: Mumbai & New Delhi.'
  },
  women: {
    heroTitle: 'SPRING / RESORT 2026',
    heroSubtitle: 'BIAS-CUT SILK & TIMELESS SCANDINAVIAN PURITY',
    heroTag: 'EDITION NO. 10 • INDIA',
    heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=90',
    editorialQuote: '"Sensorial weightlessness meets high-tension tailoring."',
    curator: 'Designed in Copenhagen. Flagship Stores: Mumbai & Bengaluru.'
  }
};

if (typeof window !== 'undefined') {
  window.PRODUCTS = PRODUCTS;
  window.LOOKBOOK = LOOKBOOK;
}
