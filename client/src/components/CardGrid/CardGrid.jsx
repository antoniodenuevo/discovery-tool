// src/components/CardGrid/CardGrid.jsx
import React, { useRef, useState, useEffect } from 'react';
import Card from '../Card/Card';
import ConnectionLines from './ConnectionLines';
import { CARD_WIDTH, CARD_HEIGHT, GAP, COLUMNS } from '../../constants';

export default function CardGrid({ positions, onDrag, activeFilter, onCardClick }) {
  const containerRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  useEffect(() => {
    function handleMouseMove(e) {
      if (!draggingId) return;
      isDraggingRef.current = true;

      const rect = containerRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - offsetRef.current.x;
      const newY = e.clientY - rect.top - offsetRef.current.y;
      onDrag(draggingId, newX, newY);
    }

    function handleMouseUp() {
      setDraggingId(null);
    }

    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingId, onDrag]);

  const handleMouseDown = (e, id) => {
    e.preventDefault();
    if (!containerRef.current) return;
    isDraggingRef.current = false;

    const rect = containerRef.current.getBoundingClientRect();
    const cardRect = e.currentTarget.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - cardRect.left,
      y: e.clientY - cardRect.top
    };

    setDraggingId(id);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100vh',
        //border: '1px solid #ccc',
        overflow: 'visible'
      }}
    >
      <ConnectionLines positions={positions} activeFilter={activeFilter} />

      {Object.entries(positions).map(([id, pos]) => (
        <div
          key={id}
          onMouseDown={(e) => handleMouseDown(e, id)}
          onClick={() => {
            if (!isDraggingRef.current) onCardClick(id);
            isDraggingRef.current = false;
          }}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: `${CARD_WIDTH}px`,
            height: `${CARD_HEIGHT}px`,
            cursor: 'move'
          }}
        >
          <Card id={id} />
        </div>
      ))}
    </div>
  );
}
