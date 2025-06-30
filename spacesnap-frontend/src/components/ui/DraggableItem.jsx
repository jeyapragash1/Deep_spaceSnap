// src/components/ui/DraggableItem.jsx

import React, { useState, useEffect, useRef } from 'react';

const DraggableItem = ({ object, onUpdate, onSelect, isSelected }) => {
    const [position, setPosition] = useState(object.position);
    const itemRef = useRef(null);

    const handleMouseDown = (e) => {
        e.preventDefault();
        onSelect(object.id); // Notify parent that this item is selected

        const startX = e.pageX - position.x;
        const startY = e.pageY - position.y;

        const handleMouseMove = (moveEvent) => {
            const newX = moveEvent.pageX - startX;
            const newY = moveEvent.pageY - startY;
            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            onUpdate(object.id, { x: position.x, y: position.y });
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            ref={itemRef}
            onMouseDown={handleMouseDown}
            style={{ 
                position: 'absolute', 
                left: `${position.x}px`, 
                top: `${position.y}px`,
                width: `${object.width}px`,
                height: `${object.height}px`,
                cursor: 'grab',
                outline: isSelected ? '2px dashed #0d9488' : 'none', // primary-teal
                outlineOffset: '4px',
                userSelect: 'none',
            }}
        >
            <img 
                src={object.image} 
                alt={object.name}
                draggable="false" 
                className="w-full h-full object-contain pointer-events-none"
            />
        </div>
    );
};

export default DraggableItem;