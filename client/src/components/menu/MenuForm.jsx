import React, { useState, useEffect, memo } from 'react';
import { X } from 'lucide-react';
import { Button, Input, Modal } from '../ui';
import './MenuForm.css';

const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];

const initialFormState = {
    name: '',
    description: '',
    category: 'Main Course',
    price: '',
    ingredients: '',
    preparationTime: '15',
    imageUrl: '',
    isAvailable: true
};

/**
 * Menu Item Form Component
 */
const MenuForm = memo(function MenuForm({
    isOpen,
    onClose,
    onSubmit,
    editItem = null,
    loading = false
}) {
    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    const isEdit = !!editItem;

    useEffect(() => {
        if (editItem) {
            setForm({
                name: editItem.name || '',
                description: editItem.description || '',
                category: editItem.category || 'Main Course',
                price: editItem.price?.toString() || '',
                ingredients: editItem.ingredients?.join(', ') || '',
                preparationTime: editItem.preparationTime?.toString() || '15',
                imageUrl: editItem.imageUrl || '',
                isAvailable: editItem.isAvailable ?? true
            });
        } else {
            setForm(initialFormState);
        }
        setErrors({});
    }, [editItem, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!form.category) {
            newErrors.category = 'Category is required';
        }

        if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) {
            newErrors.price = 'Valid price is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        const formData = {
            name: form.name.trim(),
            description: form.description.trim(),
            category: form.category,
            price: parseFloat(form.price),
            ingredients: form.ingredients
                .split(',')
                .map(i => i.trim())
                .filter(i => i),
            preparationTime: parseInt(form.preparationTime) || 15,
            imageUrl: form.imageUrl.trim(),
            isAvailable: form.isAvailable
        };

        onSubmit(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Menu Item' : 'Add Menu Item'}
            size="md"
        >
            <form className="menu-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <Input
                        label="Name *"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g., Truffle Pasta"
                        error={errors.name}
                    />

                    <div className="input-wrapper">
                        <label className="input-label">Category *</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="input select"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Price ($) *"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        error={errors.price}
                    />

                    <Input
                        label="Prep Time (min)"
                        name="preparationTime"
                        type="number"
                        min="1"
                        value={form.preparationTime}
                        onChange={handleChange}
                        placeholder="15"
                    />
                </div>

                <div className="input-wrapper">
                    <label className="input-label">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="input textarea"
                        placeholder="Enter a delicious description..."
                        rows={3}
                    />
                </div>

                <Input
                    label="Ingredients (comma-separated)"
                    name="ingredients"
                    value={form.ingredients}
                    onChange={handleChange}
                    placeholder="e.g., Pasta, Truffle, Cream, Parmesan"
                />

                <Input
                    label="Image URL"
                    name="imageUrl"
                    type="url"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                />

                <div className="form-actions">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={loading}>
                        {isEdit ? 'Update Item' : 'Add Item'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
});

export default MenuForm;
