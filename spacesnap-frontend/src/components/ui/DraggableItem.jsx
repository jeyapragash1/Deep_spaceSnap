// src/components/ui/DraggableItem.jsx
import React, { useState, useRef } from 'react';

const DraggableItem = ({ object, onUpdate, onSelect, isSelected }) => {
    // We use a ref to refer to the DOM element for position calculations
    const itemRef = useRef(null);

    // This is the core handler for when a user presses their mouse down on the item
    const handleMouseDown = (e) => {
        // Prevent default browser behavior, like trying to drag the image file
        e.preventDefault();
        e.stopPropagation(); // Stop the click from bubbling up to the container

        // Notify the parent AiVisualizerPage that this item is now selected
        onSelect(object.id);

        const startX = e.pageX - object.position.x;
        const startY = e.pageY - object.position.y;

        // This function runs every time the mouse moves while the button is held down
        const handleMouseMove = (moveEvent) => {
            const newX = moveEvent.pageX - startX;
            const newY = moveEvent.pageY - startY;

            // In a real app, you would update the state here to show the move in real-time.
            // For simplicity, we can update the DOM element directly for smoother performance.
            if (itemRef.current) {
                itemRef.current.style.left = `${newX}px`;
                itemRef.current.style.top = `${newY}px`;
            }
        };

        // This function runs when the user releases the mouse button
        const handleMouseUp = (upEvent) => {
            // Calculate final position and update the parent component's state
            const finalX = upEvent.pageX - startX;
            const finalY = upEvent.pageY - startY;
            onUpdate(object.id, { x: finalX, y: finalY });
            
            // Clean up the event listeners from the window
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        // Add the listeners to the entire window so dragging works even if the mouse leaves the item
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            ref={itemRef}
            onMouseDown={handleMouseDown}
            style={{ 
                position: 'absolute', 
                left: `${object.position.x}px`, 
                top: `${object.position.y}px`,
                width: `${object.width}px`,
                height: `${object.height}px`,
                cursor: 'grab',
                // Add a visual indicator (a dashed outline) when the item is selected
                outline: isSelected ? '2px dashed #0D9488' : 'none', // primary-teal color
                outlineOffset: '4px',
                userSelect: 'none', // Prevent text selection while dragging
            }}
        >
            <img 
                src={object.image} 
                alt={object.name}
                // These prevent the browser's default image drag behavior
                draggable="false" 
                className="w-full h-full object-contain pointer-events-none"
            />
        </div>
    );
};

export default DraggableItem;