const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Menu item name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'],
            message: '{VALUE} is not a valid category'
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    ingredients: [{
        type: String,
        trim: true
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number,
        min: [0, 'Preparation time cannot be negative'],
        default: 15
    },
    imageUrl: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Create text index for search functionality
menuItemSchema.index({ name: 'text', ingredients: 'text', description: 'text' });

// Create regular indexes for common queries
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });
menuItemSchema.index({ price: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
