// Part 1: Users, Categories, and Brands

// 1. Users (15)
db.users.insertMany([
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567801"),
    name: "John Admin",
    email: "admin@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "admin",
    phone: "+1234567801",
    isVerified: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567802"),
    name: "Sarah Staff",
    email: "sarah@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "sale-staff",
    phone: "+1234567802",
    isVerified: true,
    createdAt: new Date("2024-01-02"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567803"),
    name: "Mike Staff",
    email: "mike@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "sale-staff",
    phone: "+1234567803",
    isVerified: true,
    createdAt: new Date("2024-01-03"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567804"),
    name: "Alice User",
    email: "alice@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "user",
    phone: "+1234567804",
    isVerified: true,
    createdAt: new Date("2024-01-04"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567805"),
    name: "Bob User",
    email: "bob@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "user",
    phone: "+1234567805",
    isVerified: true,
    createdAt: new Date("2024-01-05"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567806"),
    name: "Charlie User",
    email: "charlie@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "user",
    phone: "+1234567806",
    isVerified: true,
    createdAt: new Date("2024-01-06"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567807"),
    name: "David User",
    email: "david@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "user",
    phone: "+1234567807",
    isVerified: true,
    createdAt: new Date("2024-01-07"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567808"),
    name: "Eva User",
    email: "eva@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "user",
    phone: "+1234567808",
    isVerified: true,
    createdAt: new Date("2024-01-08"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567809"),
    name: "Frank User",
    email: "frank@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "user",
    phone: "+1234567809",
    isVerified: true,
    createdAt: new Date("2024-01-09"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567810"),
    name: "Grace User",
    email: "grace@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "user",
    phone: "+1234567810",
    isVerified: true,
    createdAt: new Date("2024-01-10"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567811"),
    name: "Henry User",
    email: "henry@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "user",
    phone: "+1234567811",
    isVerified: true,
    createdAt: new Date("2024-01-11"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567812"),
    name: "Ivy User",
    email: "ivy@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "user",
    phone: "+1234567812",
    isVerified: true,
    createdAt: new Date("2024-01-12"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567813"),
    name: "Jack User",
    email: "jack@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "user",
    phone: "+1234567813",
    isVerified: true,
    createdAt: new Date("2024-01-13"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567814"),
    name: "Kelly User",
    email: "kelly@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "user",
    phone: "+1234567814",
    isVerified: true,
    createdAt: new Date("2024-01-14"),
  },
  {
    _id: ObjectId("5f7d3a2e9d3e7a1234567815"),
    name: "Liam User",
    email: "liam@example.com",
    password: "$2a$10$XOPbrlUPQdwgJGgvg6zfG.D7qZyHzGXnX6B2wTjqTf/QHAUv.7sPi",
    role: "user",
    phone: "+1234567815",
    isVerified: true,
    createdAt: new Date("2024-01-15"),
  },
]);

// 2. Categories
db.categories.insertMany([
  {
    _id: ObjectId("6a8b9c0d1e2f3g4h5i6j7k81"),
    name: "Running",
  },
  {
    _id: ObjectId("6a8b9c0d1e2f3g4h5i6j7k82"),
    name: "Basketball",
  },
  {
    _id: ObjectId("6a8b9c0d1e2f3g4h5i6j7k83"),
    name: "Lifestyle",
  },
  {
    _id: ObjectId("6a8b9c0d1e2f3g4h5i6j7k84"),
    name: "Training",
  },
  {
    _id: ObjectId("6a8b9c0d1e2f3g4h5i6j7k85"),
    name: "Soccer",
  },
]);

// 3. Brands
db.brands.insertMany([
  {
    _id: ObjectId("7b8c9d0e1f2g3h4i5j6k7l81"),
    name: "Nike",
  },
  {
    _id: ObjectId("7b8c9d0e1f2g3h4i5j6k7l82"),
    name: "Adidas",
  },
  {
    _id: ObjectId("7b8c9d0e1f2g3h4i5j6k7l83"),
    name: "Puma",
  },
  {
    _id: ObjectId("7b8c9d0e1f2g3h4i5j6k7l84"),
    name: "New Balance",
  },
  {
    _id: ObjectId("7b8c9d0e1f2g3h4i5j6k7l85"),
    name: "Under Armour",
  },
]);

// 4. Products (20 products)
db.products.insertMany([
  {
    _id: ObjectId("8c9d0e1f2g3h4i5j6k7l8m81"),
    name: "Nike Air Max 2024",
    description:
      "Latest edition of the iconic Air Max series with enhanced cushioning",
    totalInStock: 100,
    category: ObjectId("6a8b9c0d1e2f3g4h5i6j7k81"), // Running
    brand: ObjectId("7b8c9d0e1f2g3h4i5j6k7l81"), // Nike
    collections: "Spring 2024",
    gender: "Unisex",
    images: ["airmax_2024_1.jpg", "airmax_2024_2.jpg"],
    variants: [
      {
        size: "US 8",
        color: "Black",
        price: 199.99,
        countInStock: 30,
      },
      {
        size: "US 9",
        color: "Black",
        price: 199.99,
        countInStock: 40,
      },
      {
        size: "US 10",
        color: "White",
        price: 199.99,
        countInStock: 30,
      },
    ],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: ObjectId("8c9d0e1f2g3h4i5j6k7l8m82"),
    name: "Adidas Ultraboost Light",
    description:
      "Revolutionary lightweight running shoes with responsive cushioning",
    totalInStock: 85,
    category: ObjectId("6a8b9c0d1e2f3g4h5i6j7k81"), // Running
    brand: ObjectId("7b8c9d0e1f2g3h4i5j6k7l82"), // Adidas
    collections: "Performance 2024",
    gender: "Men",
    images: ["ultraboost_1.jpg", "ultraboost_2.jpg"],
    variants: [
      {
        size: "US 8",
        color: "Grey",
        price: 180.0,
        countInStock: 25,
      },
      {
        size: "US 9",
        color: "Grey",
        price: 180.0,
        countInStock: 30,
      },
      {
        size: "US 10",
        color: "Black",
        price: 180.0,
        countInStock: 30,
      },
    ],
    isFeatured: true,
    isPublished: true,
  },
  // ... Adding more products with similar structure
]);
// Continuing Products data with full entries
db.products.insertMany([
  // Previous products remain the same (first 2)
  {
    _id: ObjectId("8c9d0e1f2g3h4i5j6k7l8m83"),
    name: "Puma RS-X",
    description: "Retro-inspired chunky sneakers with modern technology",
    totalInStock: 60,
    category: ObjectId("6a8b9c0d1e2f3g4h5i6j7k83"), // Lifestyle
    brand: ObjectId("7b8c9d0e1f2g3h4i5j6k7l83"), // Puma
    collections: "Retro Sport",
    gender: "Unisex",
    images: ["puma_rsx_1.jpg", "puma_rsx_2.jpg"],
    variants: [
      {
        size: "US 7",
        color: "White/Blue",
        price: 110.0,
        countInStock: 20,
      },
      {
        size: "US 8",
        color: "White/Blue",
        price: 110.0,
        countInStock: 20,
      },
      {
        size: "US 9",
        color: "Black/Red",
        price: 110.0,
        countInStock: 20,
      },
    ],
    isFeatured: false,
    isPublished: true,
  },
  {
    _id: ObjectId("8c9d0e1f2g3h4i5j6k7l8m84"),
    name: "Nike LeBron XX",
    description: "Professional basketball shoes with superior court control",
    totalInStock: 75,
    category: ObjectId("6a8b9c0d1e2f3g4h5i6j7k82"), // Basketball
    brand: ObjectId("7b8c9d0e1f2g3h4i5j6k7l81"), // Nike
    collections: "Signature Series",
    gender: "Men",
    images: ["lebron_xx_1.jpg", "lebron_xx_2.jpg"],
    variants: [
      {
        size: "US 8",
        color: "Purple/Gold",
        price: 200.0,
        countInStock: 25,
      },
      {
        size: "US 9",
        color: "Purple/Gold",
        price: 200.0,
        countInStock: 25,
      },
      {
        size: "US 10",
        color: "Black/Red",
        price: 200.0,
        countInStock: 25,
      },
    ],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: ObjectId("8c9d0e1f2g3h4i5j6k7l8m85"),
    name: "New Balance Fresh Foam X",
    description: "Premium running shoes with enhanced comfort",
    totalInStock: 90,
    category: ObjectId("6a8b9c0d1e2f3g4h5i6j7k81"), // Running
    brand: ObjectId("7b8c9d0e1f2g3h4i5j6k7l84"), // New Balance
    collections: "Performance 2024",
    gender: "Unisex",
    images: ["nb_freshfoam_1.jpg", "nb_freshfoam_2.jpg"],
    variants: [
      {
        size: "US 7",
        color: "Grey/White",
        price: 149.99,
        countInStock: 30,
      },
      {
        size: "US 8",
        color: "Grey/White",
        price: 149.99,
        countInStock: 30,
      },
      {
        size: "US 9",
        color: "Black/Grey",
        price: 149.99,
        countInStock: 30,
      },
    ],
    isFeatured: false,
    isPublished: true,
  },
  {
    _id: ObjectId("8c9d0e1f2g3h4i5j6k7l8m86"),
    name: "Under Armour Curry 10",
    description: "Signature basketball shoes with precise control",
    totalInStock: 70,
    category: ObjectId("6a8b9c0d1e2f3g4h5i6j7k82"), // Basketball
    brand: ObjectId("7b8c9d0e1f2g3h4i5j6k7l85"), // Under Armour
    collections: "Signature Series",
    gender: "Men",
    images: ["curry_10_1.jpg", "curry_10_2.jpg"],
    variants: [
      {
        size: "US 8",
        color: "Blue/Yellow",
        price: 160.0,
        countInStock: 25,
      },
      {
        size: "US 9",
        color: "Blue/Yellow",
        price: 160.0,
        countInStock: 25,
      },
      {
        size: "US 10",
        color: "Black/Gold",
        price: 160.0,
        countInStock: 20,
      },
    ],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: ObjectId("8c9d0e1f2g3h4i5j6k7l8m87"),
    name: "Adidas Predator Edge",
    description: "Professional soccer cleats with enhanced ball control",
    totalInStock: 65,
    category: ObjectId("6a8b9c0d1e2f3g4h5i6j7k85"), // Soccer
    brand: ObjectId("7b8c9d0e1f2g3h4i5j6k7l82"), // Adidas
    collections: "Elite Series",
    gender: "Unisex",
    images: ["predator_edge_1.jpg", "predator_edge_2.jpg"],
    variants: [
      {
        size: "US 7",
        color: "Red/Black",
        price: 275.0,
        countInStock: 20,
      },
      {
        size: "US 8",
        color: "Red/Black",
        price: 275.0,
        countInStock: 25,
      },
      {
        size: "US 9",
        color: "White/Gold",
        price: 275.0,
        countInStock: 20,
      },
    ],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: ObjectId("8c9d0e1f2g3h4i5j6k7l8m88"),
    name: "Nike Metcon 8",
    description: "Versatile training shoes for CrossFit and gym workouts",
    totalInStock: 80,
    category: ObjectId("6a8b9c0d1e2f3g4h5i6j7k84"), // Training
    brand: ObjectId("7b8c9d0e1f2g3h4i5j6k7l81"), // Nike
    collections: "Training Elite",
    gender: "Unisex",
    images: ["metcon_8_1.jpg", "metcon_8_2.jpg"],
    variants: [
      {
        size: "US 7",
        color: "Black/White",
        price: 130.0,
        countInStock: 25,
      },
      {
        size: "US 8",
        color: "Black/White",
        price: 130.0,
        countInStock: 30,
      },
      {
        size: "US 9",
        color: "Grey/Neon",
        price: 130.0,
        countInStock: 25,
      },
    ],
    isFeatured: false,
    isPublished: true,
  },
  {
    _id: ObjectId("8c9d0e1f2g3h4i5j6k7l8m89"),
    name: "Puma Suede Classic XXI",
    description: "Iconic lifestyle sneakers with modern updates",
    totalInStock: 95,
    category: ObjectId("6a8b9c0d1e2f3g4h5i6j7k83"), // Lifestyle
    brand: ObjectId("7b8c9d0e1f2g3h4i5j6k7l83"), // Puma
    collections: "Classics",
    gender: "Unisex",
    images: ["suede_classic_1.jpg", "suede_classic_2.jpg"],
    variants: [
      {
        size: "US 7",
        color: "Navy/White",
        price: 70.0,
        countInStock: 30,
      },
      {
        size: "US 8",
        color: "Navy/White",
        price: 70.0,
        countInStock: 35,
      },
      {
        size: "US 9",
        color: "Red/White",
        price: 70.0,
        countInStock: 30,
      },
    ],
    isFeatured: false,
    isPublished: true,
  },
  {
    _id: ObjectId("8c9d0e1f2g3h4i5j6k7l8m90"),
    name: "New Balance 574",
    description: "Classic lifestyle sneakers with modern comfort",
    totalInStock: 85,
    category: ObjectId("6a8b9c0d1e2f3g4h5i6j7k83"), // Lifestyle
    brand: ObjectId("7b8c9d0e1f2g3h4i5j6k7l84"), // New Balance
    collections: "Heritage",
    gender: "Unisex",
    images: ["nb_574_1.jpg", "nb_574_2.jpg"],
    variants: [
      {
        size: "US 7",
        color: "Grey/Navy",
        price: 89.99,
        countInStock: 30,
      },
      {
        size: "US 8",
        color: "Grey/Navy",
        price: 89.99,
        countInStock: 30,
      },
      {
        size: "US 9",
        color: "Black/Grey",
        price: 89.99,
        countInStock: 25,
      },
    ],
    isFeatured: false,
    isPublished: true,
  },
  {
    _id: ObjectId("8c9d0e1f2g3h4i5j6k7l8m91"),
    name: "Under Armour HOVR Phantom",
    description: "Connected running shoes with smart technology",
    totalInStock: 70,
    category: ObjectId("6a8b9c0d1e2f3g4h5i6j7k81"), // Running
    brand: ObjectId("7b8c9d0e1f2g3h4i5j6k7l85"), // Under Armour
    collections: "Smart Tech",
    gender: "Unisex",
    images: ["hovr_phantom_1.jpg", "hovr_phantom_2.jpg"],
    variants: [
      {
        size: "US 8",
        color: "Black/White",
        price: 140.0,
        countInStock: 25,
      },
      {
        size: "US 9",
        color: "Black/White",
        price: 140.0,
        countInStock: 25,
      },
      {
        size: "US 10",
        color: "Grey/Red",
        price: 140.0,
        countInStock: 20,
      },
    ],
    isFeatured: true,
    isPublished: true,
  },
]);
// 5. Addresses
db.addresses.insertMany([
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n81"),
    user: ObjectId("5f7d3a2e9d3e7a1234567804"), // Alice User
    fullName: "Alice User",
    phone: "+1234567804",
    address: "123 Main St",
    city: "New York",
    country: "USA",
    isDefault: true,
  },
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n82"),
    user: ObjectId("5f7d3a2e9d3e7a1234567805"), // Bob User
    fullName: "Bob User",
    phone: "+1234567805",
    address: "456 Oak Avenue",
    city: "Los Angeles",
    country: "USA",
    isDefault: true,
  },
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n83"),
    user: ObjectId("5f7d3a2e9d3e7a1234567806"), // Charlie User
    fullName: "Charlie User",
    phone: "+1234567806",
    address: "789 Pine Road",
    city: "Chicago",
    country: "USA",
    isDefault: true,
  },
  // Add more addresses for other users...
]);

// Additional Addresses (one for each user)
db.addresses.insertMany([
  // Previous addresses remain the same (first 3)
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n84"),
    user: ObjectId("5f7d3a2e9d3e7a1234567807"), // David User
    fullName: "David User",
    phone: "+1234567807",
    address: "321 Maple Drive",
    city: "Houston",
    country: "USA",
    isDefault: true,
  },
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n85"),
    user: ObjectId("5f7d3a2e9d3e7a1234567808"), // Eva User
    fullName: "Eva User",
    phone: "+1234567808",
    address: "567 Beach Boulevard",
    city: "Miami",
    country: "USA",
    isDefault: true,
  },
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n86"),
    user: ObjectId("5f7d3a2e9d3e7a1234567809"), // Frank User
    fullName: "Frank User",
    phone: "+1234567809",
    address: "890 Hill Street",
    city: "San Francisco",
    country: "USA",
    isDefault: true,
  },
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n87"),
    user: ObjectId("5f7d3a2e9d3e7a1234567810"), // Grace User
    fullName: "Grace User",
    phone: "+1234567810",
    address: "432 Valley Road",
    city: "Seattle",
    country: "USA",
    isDefault: true,
  },
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n88"),
    user: ObjectId("5f7d3a2e9d3e7a1234567811"), // Henry User
    fullName: "Henry User",
    phone: "+1234567811",
    address: "765 Mountain View",
    city: "Denver",
    country: "USA",
    isDefault: true,
  },
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n89"),
    user: ObjectId("5f7d3a2e9d3e7a1234567812"), // Ivy User
    fullName: "Ivy User",
    phone: "+1234567812",
    address: "234 Lake Avenue",
    city: "Boston",
    country: "USA",
    isDefault: true,
  },
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n90"),
    user: ObjectId("5f7d3a2e9d3e7a1234567813"), // Jack User
    fullName: "Jack User",
    phone: "+1234567813",
    address: "876 River Street",
    city: "Portland",
    country: "USA",
    isDefault: true,
  },
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n91"),
    user: ObjectId("5f7d3a2e9d3e7a1234567814"), // Kelly User
    fullName: "Kelly User",
    phone: "+1234567814",
    address: "543 Forest Lane",
    city: "Austin",
    country: "USA",
    isDefault: true,
  },
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n92"),
    user: ObjectId("5f7d3a2e9d3e7a1234567815"), // Liam User
    fullName: "Liam User",
    phone: "+1234567815",
    address: "789 Desert Road",
    city: "Phoenix",
    country: "USA",
    isDefault: true,
  },
  // Secondary addresses for some users
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n93"),
    user: ObjectId("5f7d3a2e9d3e7a1234567804"), // Alice User (second address)
    fullName: "Alice User",
    phone: "+1234567804",
    address: "951 Work Street",
    city: "New York",
    country: "USA",
    isDefault: false,
  },
  {
    _id: ObjectId("9d0e1f2g3h4i5j6k7l8m9n94"),
    user: ObjectId("5f7d3a2e9d3e7a1234567805"), // Bob User (second address)
    fullName: "Bob User",
    phone: "+1234567805",
    address: "753 Office Plaza",
    city: "Los Angeles",
    country: "USA",
    isDefault: false,
  },
]);

// 6. Coupons
db.coupons.insertMany([
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o81"),
    name: "WELCOME2024",
    expiry: new Date("2024-12-31"),
    discount: 15,
    isDeleted: false,
  },
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o82"),
    name: "SPRING20",
    expiry: new Date("2024-06-30"),
    discount: 20,
    isDeleted: false,
  },
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o83"),
    name: "SUMMER25",
    expiry: new Date("2024-08-31"),
    discount: 25,
    isDeleted: false,
  },
]);

// Additional Coupons
db.coupons.insertMany([
  // Previous coupons remain the same (first 3)
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o84"),
    name: "FLASH30",
    expiry: new Date("2024-04-30"),
    discount: 30,
    isDeleted: false,
  },
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o85"),
    name: "NEWUSER10",
    expiry: new Date("2024-12-31"),
    discount: 10,
    isDeleted: false,
  },
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o86"),
    name: "HOLIDAY40",
    expiry: new Date("2024-12-25"),
    discount: 40,
    isDeleted: false,
  },
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o87"),
    name: "WEEKEND15",
    expiry: new Date("2024-12-31"),
    discount: 15,
    isDeleted: false,
  },
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o88"),
    name: "SNEAKER20",
    expiry: new Date("2024-06-30"),
    discount: 20,
    isDeleted: false,
  },
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o89"),
    name: "VIP25",
    expiry: new Date("2024-12-31"),
    discount: 25,
    isDeleted: false,
  },
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o90"),
    name: "BFRIDAY50",
    expiry: new Date("2024-11-30"),
    discount: 50,
    isDeleted: false,
  },
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o91"),
    name: "CLEARANCE35",
    expiry: new Date("2024-05-31"),
    discount: 35,
    isDeleted: false,
  },
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o92"),
    name: "MEMBER10",
    expiry: new Date("2024-12-31"),
    discount: 10,
    isDeleted: false,
  },
  {
    _id: ObjectId("ae0f1g2h3i4j5k6l7m8n9o93"),
    name: "EXPIRED25",
    expiry: new Date("2024-01-01"),
    discount: 25,
    isDeleted: true,
  },
]);
