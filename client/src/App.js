// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import CardGrid from './components/CardGrid/CardGrid';
import CardPreviewModal from './components/Card/CardPreviewModal';
import cardsData from './data/cardsData';
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  GAP,
  COLUMNS,
  FILTER_KEYS,
  FILTER_LABELS,
  FILTER_COLORS,
  FILTER_FONT_FAMILY,
  FILTER_FONT_SIZE,
  FILTER_FONT_WEIGHT,
  FILTER_LINE_HEIGHT,
  FILTER_LETTER_SPACING
} from './constants';

// Shared button style
const buttonBaseStyle = {
  display: 'flex',
  padding: '14px 16px 12px 16px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 12,
  cursor: 'pointer',
  fontFamily: FILTER_FONT_FAMILY,
  fontSize: `${FILTER_FONT_SIZE}px`,
  fontWeight: FILTER_FONT_WEIGHT,
  lineHeight: FILTER_LINE_HEIGHT,
  letterSpacing: FILTER_LETTER_SPACING,
  textTransform: 'uppercase',
  color: 'rgba(0, 0, 0, 1)',
};

// Helper for jitter
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Initial positions with jitter
function computeInitialPositions() {
  const positions = {};
  const R = 200;
  cardsData.forEach((card, idx) => {
    const col = idx % COLUMNS;
    const row = Math.floor(idx / COLUMNS);
    const baseX = col * (CARD_WIDTH + GAP);
    const baseY = row * (CARD_HEIGHT + GAP);
    positions[card.id] = {
      x: baseX + randomBetween(-R, R),
      y: baseY + randomBetween(-R, R),
    };
  });
  return positions;
}

export default function App() {
  const [rawPositions, setRawPositions] = useState(() => computeInitialPositions());
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [previewCardId, setPreviewCardId] = useState(null);              // ← preview state
  const [zoom, setZoom] = useState(1);
  const viewportRef = useRef(null);

  const handleDrag = (id, x, y) => {
    setRawPositions(prev => ({ ...prev, [id]: { x, y } }));
  };

  // Map id → tags
  const tagsMap = {};
  cardsData.forEach(c => (tagsMap[c.id] = c.tags));

  // Filtered IDs
  const filteredIds = new Set(
    Object.entries(tagsMap)
      .filter(([id, tags]) => activeFilter === 'all' || tags.includes(activeFilter))
      .map(([id]) => id)
  );

  // Connected IDs when one is selected
  const connectedIds = new Set();
  if (selectedCardId) {
    const selTags = tagsMap[selectedCardId] || [];
    Object.entries(tagsMap).forEach(([id, tags]) => {
      if (id === selectedCardId || selTags.some(t => tags.includes(t))) {
        connectedIds.add(id);
      }
    });
  }

  // Which to show
  const visibleRawIds = Object.keys(rawPositions).filter(
    id => filteredIds.has(id) && (!selectedCardId || connectedIds.has(id))
  );

  // Compute bounds + padding
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  Object.values(rawPositions).forEach(({ x, y }) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });
  maxX += CARD_WIDTH; maxY += CARD_HEIGHT;
  const PADDING = 200;
  const offsetX = PADDING - Math.min(minX, 0);
  const offsetY = PADDING - Math.min(minY, 0);
  const worldWidth = (maxX - minX + PADDING * 2) * zoom;
  const worldHeight = (maxY - minY + PADDING * 2) * zoom;

  // Zoom handler (cmd/ctrl + wheel)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    function onWheel(e) {
      if (!(e.metaKey || e.ctrlKey)) return;
      e.preventDefault(); e.stopPropagation();
      const sf = e.deltaY < 0 ? 1.03 : 0.97;
      setZoom(prev => {
        const next = Math.min(3, Math.max(0.25, prev * sf));
        const { clientWidth, clientHeight, scrollLeft, scrollTop } = el;
        const cx = (scrollLeft + clientWidth/2) / prev;
        const cy = (scrollTop + clientHeight/2) / prev;
        requestAnimationFrame(() => {
          el.scrollLeft = cx * next - clientWidth/2;
          el.scrollTop  = cy * next - clientHeight/2;
        });
        return next;
      });
    }
    el.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', onWheel, { passive: false, capture: true });
  }, [zoom]);

  return (
    <div>
      {/* Filter nav */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        display: 'inline-flex', alignItems: 'center', gap: 12, padding: 24,
        zIndex: 1000, background: 'transparent'
      }}>
        <div
          onClick={() => {
            setActiveFilter('all');
            setSelectedCardId(null);
            setPreviewCardId(null);
          }}
          style={{
            ...buttonBaseStyle,
            backgroundColor: '#ffffff',
            opacity: activeFilter === 'all' ? 1 : 0.6
          }}
        >ALL</div>
        {FILTER_KEYS.map(k => (
          <div
            key={k}
            onClick={() => {
              setActiveFilter(k);
              setSelectedCardId(null);
              setPreviewCardId(null);
            }}
            style={{
              ...buttonBaseStyle,
              backgroundColor: FILTER_COLORS[k],
              opacity: activeFilter === k || activeFilter === 'all' ? 1 : 0.6
            }}
          >{FILTER_LABELS[k].toUpperCase()}</div>
        ))}
      </div>

      {/* Scrollable world */}
      <div
        ref={viewportRef}
        style={{
          paddingTop: '80px',
          width: '100vw',
          height: 'calc(100vh - 80px)',
          overflow: 'auto',
          overscrollBehavior: 'none'
        }}
      >
        <div style={{ width: worldWidth, height: worldHeight, position: 'relative' }}>
          <CardGrid
            rawPositions={rawPositions}
            visibleIds={visibleRawIds}
            onDrag={handleDrag}
            selectedCardId={selectedCardId}
            onCardClick={id => setSelectedCardId(prev => (prev === id ? null : id))}
            onTitleClick={id => setPreviewCardId(id)}      // ← hooked up here
            offsetX={offsetX}
            offsetY={offsetY}
            zoom={zoom}
            activeFilter={activeFilter}
          />
        </div>
      </div>

      {/* Preview modal */}
      {previewCardId && (
        <CardPreviewModal
          id={previewCardId}
          onClose={() => setPreviewCardId(null)}
        />
      )}
    </div>
  );
}
