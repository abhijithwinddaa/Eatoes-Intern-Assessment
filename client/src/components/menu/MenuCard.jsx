import React, { memo } from 'react';
import { Clock, IndianRupee, Pencil, Trash2 } from 'lucide-react';
import { Toggle, CategoryBadge, Button } from '../ui';
import './MenuCard.css';

/**
 * Menu Item Card Component
 */
const MenuCard = memo(function MenuCard({
    item,
    onEdit,
    onDelete,
    onToggleAvailability
}) {
    const handleToggle = () => {
        onToggleAvailability(item._id, item.isAvailable);
    };

    return (
        <div className={`menu-card ${!item.isAvailable ? 'menu-card-unavailable' : ''}`}>
            {/* Image */}
            <div className="menu-card-image-wrapper">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="menu-card-image"
                        loading="lazy"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className="menu-card-placeholder"
                    style={{ display: item.imageUrl ? 'none' : 'flex' }}
                >
                    <span>{item.name.charAt(0)}</span>
                </div>
                <CategoryBadge category={item.category} />
            </div>

            {/* Content */}
            <div className="menu-card-content">
                <div className="menu-card-header">
                    <h3 className="menu-card-title">{item.name}</h3>
                    <span className="menu-card-price">
                        <IndianRupee size={14} />
                        {item.price.toFixed(0)}
                    </span>
                </div>

                {item.description && (
                    <p className="menu-card-description">{item.description}</p>
                )}

                {item.ingredients && item.ingredients.length > 0 && (
                    <div className="menu-card-ingredients">
                        {item.ingredients.slice(0, 3).map((ing, idx) => (
                            <span key={idx} className="ingredient-tag">{ing}</span>
                        ))}
                        {item.ingredients.length > 3 && (
                            <span className="ingredient-more">+{item.ingredients.length - 3}</span>
                        )}
                    </div>
                )}

                <div className="menu-card-footer">
                    <div className="menu-card-meta">
                        <Clock size={14} />
                        <span>{item.preparationTime} min</span>
                    </div>

                    <Toggle
                        checked={item.isAvailable}
                        onChange={handleToggle}
                        size="sm"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="menu-card-actions">
                <Button
                    variant="ghost"
                    size="sm"
                    icon={Pencil}
                    onClick={() => onEdit(item)}
                >
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => onDelete(item)}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
});

export default MenuCard;
