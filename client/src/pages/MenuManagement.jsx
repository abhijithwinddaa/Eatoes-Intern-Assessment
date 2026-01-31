import React, { useState, useEffect, useCallback, memo } from 'react';
import { Plus, Search, Filter, RefreshCw, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, PageLoader, ConfirmDialog, CardSkeleton } from '../components/ui';
import { SearchInput } from '../components/ui/Input';
import { MenuCard, MenuForm } from '../components/menu';
import { menuAPI } from '../api';
import { useDebounce, useOptimisticUpdate } from '../hooks';
import './MenuManagement.css';

const categories = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Beverage'];

/**
 * Menu Management Page
 */
const MenuManagement = memo(function MenuManagement() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 300);

    // Fetch menu items
    const fetchMenu = useCallback(async () => {
        try {
            setLoading(true);
            let response;

            if (debouncedSearch.trim()) {
                response = await menuAPI.search(debouncedSearch);
            } else {
                const params = {};
                if (selectedCategory !== 'All') {
                    params.category = selectedCategory;
                }
                response = await menuAPI.getAll(params);
            }

            setMenuItems(response.data?.data || []);
        } catch (error) {
            toast.error('Failed to load menu items');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, selectedCategory]);

    useEffect(() => {
        fetchMenu();
    }, [fetchMenu]);

    // Optimistic update for availability toggle
    const { execute: toggleAvailability } = useOptimisticUpdate(
        menuAPI.toggleAvailability,
        { successMessage: 'Availability updated!' }
    );

    const handleToggleAvailability = useCallback(async (id, currentStatus) => {
        const previousItems = [...menuItems];

        await toggleAvailability(
            () => {
                setMenuItems(items =>
                    items.map(item =>
                        item._id === id ? { ...item, isAvailable: !currentStatus } : item
                    )
                );
            },
            () => setMenuItems(previousItems),
            id
        ).catch(() => { }); // Error already handled by hook
    }, [menuItems, toggleAvailability]);

    // Create/Update item
    const handleSubmit = async (formData) => {
        try {
            setFormLoading(true);

            if (editItem) {
                await menuAPI.update(editItem._id, formData);
                toast.success('Menu item updated successfully!');
            } else {
                await menuAPI.create(formData);
                toast.success('Menu item created successfully!');
            }

            setShowForm(false);
            setEditItem(null);
            fetchMenu();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to save menu item';
            toast.error(message);
        } finally {
            setFormLoading(false);
        }
    };

    // Delete item
    const handleDelete = async () => {
        if (!deleteItem) return;

        try {
            setFormLoading(true);
            await menuAPI.delete(deleteItem._id);
            toast.success('Menu item deleted successfully!');
            setDeleteItem(null);
            fetchMenu();
        } catch (error) {
            toast.error('Failed to delete menu item');
        } finally {
            setFormLoading(false);
        }
    };

    // Open edit modal
    const handleEdit = (item) => {
        setEditItem(item);
        setShowForm(true);
    };

    // Close form
    const handleCloseForm = () => {
        setShowForm(false);
        setEditItem(null);
    };

    // Filter items for display
    const displayItems = debouncedSearch.trim()
        ? menuItems
        : selectedCategory === 'All'
            ? menuItems
            : menuItems.filter(item => item.category === selectedCategory);

    return (
        <div className="menu-management">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">Menu Management</h1>
                    <p className="page-subtitle">Manage your restaurant's menu items</p>
                </div>
                <Button
                    variant="accent"
                    icon={Plus}
                    onClick={() => setShowForm(true)}
                >
                    Add Item
                </Button>
            </div>

            {/* Filters */}
            <div className="menu-filters">
                <div className="search-wrapper">
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClear={() => setSearchTerm('')}
                        placeholder="Search menu items..."
                    />
                </div>

                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-btn ${selectedCategory === cat ? 'category-btn-active' : ''}`}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setSearchTerm('');
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <Button
                    variant="ghost"
                    icon={RefreshCw}
                    onClick={fetchMenu}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </div>

            {/* Menu Grid */}
            {loading ? (
                <div className="menu-grid">
                    {[...Array(6)].map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : displayItems.length > 0 ? (
                <div className="menu-grid">
                    {displayItems.map(item => (
                        <MenuCard
                            key={item._id}
                            item={item}
                            onEdit={handleEdit}
                            onDelete={setDeleteItem}
                            onToggleAvailability={handleToggleAvailability}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <Package size={64} />
                    <h3>No menu items found</h3>
                    <p>
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'Get started by adding your first menu item'}
                    </p>
                    {!searchTerm && (
                        <Button
                            variant="accent"
                            icon={Plus}
                            onClick={() => setShowForm(true)}
                        >
                            Add First Item
                        </Button>
                    )}
                </div>
            )}

            {/* Forms */}
            <MenuForm
                isOpen={showForm}
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
                editItem={editItem}
                loading={formLoading}
            />

            <ConfirmDialog
                isOpen={!!deleteItem}
                onClose={() => setDeleteItem(null)}
                onConfirm={handleDelete}
                title="Delete Menu Item"
                message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                loading={formLoading}
            />
        </div>
    );
});

export default MenuManagement;
