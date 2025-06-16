// src/components/CardGrid/ConnectionLines.jsx
import React, { useMemo } from 'react';
import cardsData from '../../data/cardsData';
import { CARD_WIDTH, CARD_HEIGHT, FILTER_COLORS } from '../../constants';

export default function ConnectionLines({
  positions,         // adjustedPositions: only visible cards
  selectedCardId,
  activeFilter,
  zoom
}) {
  // Build a quick lookup of tags for each card
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
        // Check for shared tag
        const sharedTag = tagsA.find((t) => tagsB.includes(t));
        if (!sharedTag) continue;

        // Enforce active filter
        if (activeFilter !== 'all' && sharedTag !== activeFilter) continue;

        // If a card is selected, only draw lines involving that card
        if (
          selectedCardId &&
          idA !== selectedCardId &&
          idB !== selectedCardId
        ) {
          continue;
        }

        const posA = positions[idA];
        const posB = positions[idB];
        const cxA = posA.x + (CARD_WIDTH * zoom) / 2;
        const cyA = posA.y + (CARD_HEIGHT * zoom) / 2;
        const cxB = posB.x + (CARD_WIDTH * zoom) / 2;
        const cyB = posB.y + (CARD_HEIGHT * zoom) / 2;

        result.push({
          x1: cxA,
          y1: cyA,
          x2: cxB,
          y2: cyB,
          color: FILTER_COLORS[sharedTag]
        });
      }
    }
    return result;
  }, [positions, tagsMap, selectedCardId, activeFilter, zoom]);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      {lines.map((line, idx) => (
        <line
          key={idx}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={line.color}
          strokeWidth={4 * zoom}
        />
      ))}
    </svg>
  );
}
