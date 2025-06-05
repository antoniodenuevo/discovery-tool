// src/App.js
import React, { useState } from 'react';
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

// Helper: return a random number in [min, max]
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Compute initial positions, then apply a small random offset (“jitter”)
function computeInitialPositions() {
  const positions = {};
  const R = 200; // jitter radius in pixels

  cardsData.forEach((card, idx) => {
    const col = idx % COLUMNS;
    const row = Math.floor(idx / COLUMNS);

    // Base grid‐aligned coordinates:
    const baseX = col * (CARD_WIDTH + GAP) + GAP;
    const baseY = row * (CARD_HEIGHT + GAP) + GAP;

    // Apply jitter in [–R, +R]
    const jitterX = randomBetween(-R, R);
    const jitterY = randomBetween(-R, R);

    positions[card.id] = {
      x: baseX + jitterX,
      y: baseY + jitterY
    };
  });

  return positions;
}

export default function App() {
  const [positions, setPositions] = useState(() => computeInitialPositions());
  const [activeFilter, setActiveFilter] = useState('all');
  const [previewCardId, setPreviewCardId] = useState(null);

  const handleDrag = (id, newX, newY) => {
    setPositions((prev) => ({
      ...prev,
      [id]: { x: newX, y: newY }
    }));
  };

  const tagsMap = {};
  cardsData.forEach((card) => {
    tagsMap[card.id] = card.tags;
  });

  const visiblePositions = {};
  Object.entries(positions).forEach(([id, pos]) => {
    if (
      activeFilter === 'all' ||
      (tagsMap[id] && tagsMap[id].includes(activeFilter))
    ) {
      visiblePositions[id] = pos;
    }
  });

  const navWrapperStyle = {
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '24px',
    zIndex: 1000
  };

  const buttonBaseStyle = {
    display: 'flex',
    padding: '14px 16px 12px 16px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '12px',
    cursor: 'pointer',
    fontFamily: FILTER_FONT_FAMILY,
    fontSize: '20px',
    fontWeight: FILTER_FONT_WEIGHT,
    lineHeight: FILTER_LINE_HEIGHT,
    letterSpacing: FILTER_LETTER_SPACING,
    textTransform: 'uppercase',
    color: 'rgba(0, 0, 0, 1)'
  };

  return (
    <div>
      <div style={navWrapperStyle}>
        <div
          onClick={() => setActiveFilter('all')}
          style={{
            ...buttonBaseStyle,
            backgroundColor: '#ffffff',
            opacity: activeFilter === 'all' ? 1 : 0.6
          }}
        >
          ALL
        </div>
        {FILTER_KEYS.map((key) => (
          <div
            key={key}
            onClick={() => setActiveFilter(key)}
            style={{
              ...buttonBaseStyle,
              backgroundColor: FILTER_COLORS[key],
              opacity: activeFilter === key || activeFilter === 'all' ? 1 : 0.6
            }}
          >
            {FILTER_LABELS[key].toUpperCase()}
          </div>
        ))}
      </div>

      <div style={{ paddingTop: '80px' }}>
        <CardGrid
          positions={visiblePositions}
          onDrag={handleDrag}
          activeFilter={activeFilter}
          onCardClick={(id) => setPreviewCardId(id)}
        />
      </div>

      {previewCardId && (
        <CardPreviewModal
          id={previewCardId}
          onClose={() => setPreviewCardId(null)}
        />
      )}
    </div>
  );
}
