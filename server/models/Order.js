const mongoose = require('mongoose');

// Counter schema for auto-generating order numbers
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    name: { type: String, required: true }, // Denormalized for quick access
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true
    },
    items: {
        type: [orderItemSchema],
        validate: {
            validator: function (items) {
                return items && items.length > 0;
            },
            message: 'Order must have at least one item'
        }
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [0, 'Total amount cannot be negative']
    },
    status: {
        type: String,
        enum: {
            values: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
            message: '{VALUE} is not a valid order status'
        },
        default: 'Pending'
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        maxlength: [100, 'Customer name cannot exceed 100 characters']
    },
    tableNumber: {
        type: Number,
        min: [1, 'Table number must be at least 1'],
        max: [100, 'Table number cannot exceed 100']
    }
}, {
    timestamps: true
});

// Auto-generate order number before saving
orderSchema.pre('save', async function () {
    if (this.isNew && !this.orderNumber) {
        const counter = await Counter.findByIdAndUpdate(
            'orderNumber',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const date = new Date();
        const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        this.orderNumber = `ORD-${dateStr}-${String(counter.seq).padStart(4, '0')}`;
    }
});

// Indexes for common queries
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
