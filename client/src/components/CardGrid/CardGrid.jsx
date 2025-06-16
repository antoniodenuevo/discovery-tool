// src/components/CardGrid/CardGrid.jsx
import React, { useRef, useState, useEffect } from 'react';
import Card from '../Card/Card';
import ConnectionLines from './ConnectionLines';
import { CARD_WIDTH, CARD_HEIGHT } from '../../constants';

export default function CardGrid({
  rawPositions,
  visibleIds,
  onDrag,
  selectedCardId,
  onCardClick,
  onTitleClick,
  offsetX,
  offsetY,
  zoom,
  activeFilter
}) {
  const containerRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const isDrag = useRef(false);

  useEffect(() => {
    function handleMouseMove(e) {
      if (!draggingId) return;
      isDrag.current = true;
      const { left, top } = containerRef.current.getBoundingClientRect();
      const worldX = (e.clientX - left) / zoom - offsetX;
      const worldY = (e.clientY - top) / zoom - offsetY;
      onDrag(
        draggingId,
        worldX - offsetRef.current.x,
        worldY - offsetRef.current.y
      );
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
  }, [draggingId, onDrag, offsetX, offsetY, zoom]);

  function handleMouseDown(e, id) {
    e.preventDefault();
    isDrag.current = false;
    const { left, top } = containerRef.current.getBoundingClientRect();
    const worldX = (e.clientX - left) / zoom - offsetX;
    const worldY = (e.clientY - top) / zoom - offsetY;
    const { x, y } = rawPositions[id];
    offsetRef.current = { x: worldX - x, y: worldY - y };
    setDraggingId(id);
  }

  // Adjust raw positions into screen coords
  const adjusted = {};
  Object.entries(rawPositions).forEach(([id, pos]) => {
    adjusted[id] = {
      x: (pos.x + offsetX) * zoom,
      y: (pos.y + offsetY) * zoom
    };
  });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <ConnectionLines
        positions={adjusted}
        selectedCardId={selectedCardId}
        activeFilter={activeFilter}
        zoom={zoom}
      />
      {visibleIds.map((id) => (
        <div
          key={id}
          onMouseDown={(e) => handleMouseDown(e, id)}
          onClick={() => {
            if (!isDrag.current) onCardClick(id);
            isDrag.current = false;
          }}
          style={{
            position: 'absolute',
            left: adjusted[id].x,
            top: adjusted[id].y,
            width: `${CARD_WIDTH}px`,
            height: `${CARD_HEIGHT}px`,
            cursor: 'move',
            transform: `scale(${zoom})`,
            transformOrigin: 'top left'
          }}
        >
          <Card id={id} onTitleClick={() => onTitleClick(id)} />
        </div>
      ))}
    </div>
  );
}
