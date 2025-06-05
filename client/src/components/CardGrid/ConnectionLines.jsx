// src/components/CardGrid/ConnectionLines.jsx
import React, { useMemo } from 'react';
import cardsData from '../../data/cardsData';
import { CARD_WIDTH, CARD_HEIGHT, FILTER_COLORS } from '../../constants';

export default function ConnectionLines({ positions, activeFilter }) {
  const tagsMap = useMemo(() => {
    const map = {};
    cardsData.forEach((card) => {
      map[card.id] = card.tags;
    });
    return map;
  }, []);

  const lines = useMemo(() => {
    const ids = Object.keys(positions);
    const result = [];

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const idA = ids[i];
        const idB = ids[j];
        const tagsA = tagsMap[idA] || [];
        const tagsB = tagsMap[idB] || [];

        let color = null;

        if (activeFilter === 'all') {
          const commonTag = tagsA.find((tag) => tagsB.includes(tag));
          if (commonTag) color = FILTER_COLORS[commonTag];
        } else {
          if (tagsA.includes(activeFilter) && tagsB.includes(activeFilter)) {
            color = FILTER_COLORS[activeFilter];
          }
        }

        if (color) {
          const posA = positions[idA];
          const posB = positions[idB];

          const cxA = posA.x + CARD_WIDTH / 2;
          const cyA = posA.y + CARD_HEIGHT / 2;
          const cxB = posB.x + CARD_WIDTH / 2;
          const cyB = posB.y + CARD_HEIGHT / 2;

          result.push({ x1: cxA, y1: cyA, x2: cxB, y2: cyB, color });
        }
      }
    }
    return result;
  }, [positions, tagsMap, activeFilter]);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible'
      }}
    >
      {lines.map((ln, idx) => (
        <line
          key={idx}
          x1={ln.x1}
          y1={ln.y1}
          x2={ln.x2}
          y2={ln.y2}
          stroke={ln.color}
          strokeWidth="4"
        />
      ))}
    </svg>
  );
}
