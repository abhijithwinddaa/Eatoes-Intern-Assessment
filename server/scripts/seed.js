require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const menuItems = [
    // Appetizers (Starters)
    {
        name: 'Paneer Tikka',
        description: 'Marinated cottage cheese cubes grilled in tandoor with spices',
        category: 'Appetizer',
        price: 299,
        ingredients: ['Paneer', 'Yogurt', 'Spices', 'Bell Peppers', 'Onions'],
        isAvailable: true,
        preparationTime: 15,
        imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80'
    },
    {
        name: 'Chicken Seekh Kebab',
        description: 'Minced chicken kebabs with aromatic spices, cooked on skewers',
        category: 'Appetizer',
        price: 349,
        ingredients: ['Chicken Mince', 'Onions', 'Ginger', 'Garlic', 'Garam Masala'],
        isAvailable: true,
        preparationTime: 20,
        imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80'
    },
    {
        name: 'Samosa (2 pcs)',
        description: 'Crispy pastry filled with spiced potatoes and peas',
        category: 'Appetizer',
        price: 99,
        ingredients: ['Potatoes', 'Peas', 'Cumin', 'Coriander', 'Green Chili'],
        isAvailable: true,
        preparationTime: 10,
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80'
    },
    {
        name: 'Tandoori Chicken',
        description: 'Half chicken marinated in yogurt and spices, roasted in clay oven',
        category: 'Appetizer',
        price: 399,
        ingredients: ['Chicken', 'Yogurt', 'Tandoori Masala', 'Lemon', 'Kashmiri Chili'],
        isAvailable: true,
        preparationTime: 25,
        imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&q=80'
    },
    {
        name: 'Aloo Tikki Chaat',
        description: 'Crispy potato patties topped with chutneys, yogurt, and sev',
        category: 'Appetizer',
        price: 149,
        ingredients: ['Potatoes', 'Chickpeas', 'Tamarind Chutney', 'Mint Chutney', 'Sev'],
        isAvailable: true,
        preparationTime: 12,
        imageUrl: 'https://images.unsplash.com/photo-1626132647523-66d00ac63ed7?w=400&q=80'
    },

    // Main Courses
    {
        name: 'Butter Chicken',
        description: 'Tender chicken in rich tomato-butter gravy with cream',
        category: 'Main Course',
        price: 449,
        ingredients: ['Chicken', 'Tomatoes', 'Butter', 'Cream', 'Kasuri Methi'],
        isAvailable: true,
        preparationTime: 30,
        imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80'
    },
    {
        name: 'Paneer Butter Masala',
        description: 'Cottage cheese cubes in creamy tomato gravy',
        category: 'Main Course',
        price: 349,
        ingredients: ['Paneer', 'Tomatoes', 'Cream', 'Butter', 'Cashews'],
        isAvailable: true,
        preparationTime: 25,
        imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80'
    },
    {
        name: 'Dal Makhani',
        description: 'Black lentils slow-cooked with butter and cream overnight',
        category: 'Main Course',
        price: 299,
        ingredients: ['Black Urad Dal', 'Kidney Beans', 'Butter', 'Cream', 'Tomatoes'],
        isAvailable: true,
        preparationTime: 20,
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80'
    },
    {
        name: 'Mutton Rogan Josh',
        description: 'Kashmiri style slow-cooked mutton in aromatic spices',
        category: 'Main Course',
        price: 549,
        ingredients: ['Mutton', 'Kashmiri Chili', 'Fennel', 'Ginger', 'Yogurt'],
        isAvailable: true,
        preparationTime: 45,
        imageUrl: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&q=80'
    },
    {
        name: 'Hyderabadi Biryani',
        description: 'Fragrant basmati rice layered with spiced chicken and saffron',
        category: 'Main Course',
        price: 399,
        ingredients: ['Basmati Rice', 'Chicken', 'Saffron', 'Fried Onions', 'Mint'],
        isAvailable: true,
        preparationTime: 35,
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80'
    },
    {
        name: 'Palak Paneer',
        description: 'Fresh cottage cheese in creamy spinach gravy',
        category: 'Main Course',
        price: 329,
        ingredients: ['Paneer', 'Spinach', 'Onions', 'Garlic', 'Cream'],
        isAvailable: true,
        preparationTime: 20,
        imageUrl: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=400&q=80'
    },

    // Breads
    {
        name: 'Butter Naan',
        description: 'Soft leavened bread brushed with butter, baked in tandoor',
        category: 'Appetizer',
        price: 69,
        ingredients: ['Flour', 'Yeast', 'Butter', 'Yogurt'],
        isAvailable: true,
        preparationTime: 8,
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80'
    },
    {
        name: 'Garlic Naan',
        description: 'Naan topped with fresh garlic and coriander',
        category: 'Appetizer',
        price: 79,
        ingredients: ['Flour', 'Garlic', 'Butter', 'Coriander'],
        isAvailable: true,
        preparationTime: 8,
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80'
    },

    // Desserts
    {
        name: 'Gulab Jamun (2 pcs)',
        description: 'Deep-fried milk dumplings soaked in rose-flavored sugar syrup',
        category: 'Dessert',
        price: 129,
        ingredients: ['Khoya', 'Sugar', 'Cardamom', 'Rose Water', 'Saffron'],
        isAvailable: true,
        preparationTime: 10,
        imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400&q=80'
    },
    {
        name: 'Rasmalai',
        description: 'Soft cottage cheese patties in sweetened saffron milk',
        category: 'Dessert',
        price: 149,
        ingredients: ['Paneer', 'Milk', 'Saffron', 'Cardamom', 'Pistachios'],
        isAvailable: true,
        preparationTime: 8,
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80'
    },
    {
        name: 'Kulfi Falooda',
        description: 'Traditional Indian ice cream with vermicelli and rose syrup',
        category: 'Dessert',
        price: 169,
        ingredients: ['Milk', 'Pistachios', 'Vermicelli', 'Rose Syrup', 'Basil Seeds'],
        isAvailable: true,
        preparationTime: 10,
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80'
    },
    {
        name: 'Gajar Ka Halwa',
        description: 'Warm carrot pudding with ghee, nuts, and khoya',
        category: 'Dessert',
        price: 139,
        ingredients: ['Carrots', 'Milk', 'Ghee', 'Sugar', 'Almonds'],
        isAvailable: true,
        preparationTime: 12,
        imageUrl: 'https://images.unsplash.com/photo-1605197181587-c27385f0c995?w=400&q=80'
    },

    // Beverages
    {
        name: 'Masala Chai',
        description: 'Authentic Indian spiced tea with cardamom and ginger',
        category: 'Beverage',
        price: 49,
        ingredients: ['Tea leaves', 'Milk', 'Cardamom', 'Ginger', 'Sugar'],
        isAvailable: true,
        preparationTime: 5,
        imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80'
    },
    {
        name: 'Mango Lassi',
        description: 'Creamy yogurt drink blended with Alphonso mango',
        category: 'Beverage',
        price: 129,
        ingredients: ['Yogurt', 'Alphonso Mango', 'Sugar', 'Cardamom'],
        isAvailable: true,
        preparationTime: 5,
        imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80'
    },
    {
        name: 'Fresh Lime Soda',
        description: 'Refreshing sweet or salted lime soda',
        category: 'Beverage',
        price: 79,
        ingredients: ['Lime', 'Soda', 'Sugar', 'Black Salt'],
        isAvailable: true,
        preparationTime: 3,
        imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80'
    }
];

const customerNames = [
    'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh',
    'Ananya Gupta', 'Rajesh Verma', 'Deepika Nair', 'Arjun Mehta', 'Kavya Iyer',
    'Suresh Rao', 'Pooja Desai', 'Kiran Joshi', 'Neha Agarwal', 'Sanjay Pillai'
];

const statuses = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await MenuItem.deleteMany({});
        await Order.deleteMany({});
        await mongoose.connection.collection('counters').deleteMany({});
        console.log('Cleared existing data');

        // Insert menu items
        const insertedMenuItems = await MenuItem.insertMany(menuItems);
        console.log(`Inserted ${insertedMenuItems.length} menu items`);

        // Generate sample orders
        const orders = [];
        for (let i = 0; i < 20; i++) {
            // Random number of items per order (1-4)
            const numItems = Math.floor(Math.random() * 4) + 1;
            const orderItems = [];
            let totalAmount = 0;

            // Select random menu items for the order
            const shuffled = [...insertedMenuItems].sort(() => 0.5 - Math.random());
            const selectedItems = shuffled.slice(0, numItems);

            for (const item of selectedItems) {
                const quantity = Math.floor(Math.random() * 3) + 1;
                const itemTotal = item.price * quantity;
                totalAmount += itemTotal;

                orderItems.push({
                    menuItem: item._id,
                    name: item.name,
                    quantity,
                    price: item.price
                });
            }

            // Random status with weighted distribution
            const statusWeights = [0.1, 0.2, 0.2, 0.4, 0.1];
            let random = Math.random();
            let statusIndex = 0;
            for (let j = 0; j < statusWeights.length; j++) {
                random -= statusWeights[j];
                if (random <= 0) {
                    statusIndex = j;
                    break;
                }
            }

            orders.push({
                items: orderItems,
                totalAmount: Math.round(totalAmount * 100) / 100,
                status: statuses[statusIndex],
                customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
                tableNumber: Math.floor(Math.random() * 20) + 1
            });
        }

        // Insert orders one by one to trigger auto-generated order numbers
        for (const orderData of orders) {
            const order = new Order(orderData);
            await order.save();
        }
        console.log(`Inserted ${orders.length} orders`);

        console.log('\n✅ Database seeded successfully with Indian menu!');
        console.log(`   📋 Menu Items: ${insertedMenuItems.length}`);
        console.log(`   🛒 Orders: ${orders.length}`);

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
