// src/components/Card/Card.jsx
import React from 'react';
import cardsData from '../../data/cardsData';
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  FILTER_GAP,
  FILTER_PADDING,
  FILTER_FONT_FAMILY,
  FILTER_FONT_SIZE,
  FILTER_LINE_HEIGHT,
  FILTER_LETTER_SPACING,
  FILTER_FONT_WEIGHT,
  FILTER_COLORS,
  FILTER_LABELS
} from '../../constants';

export default function Card({ id, onTitleClick }) {
  const cardInfo = cardsData.find((c) => c.id === id) || {};
  const heading = cardInfo.preview?.heading || 'No Title';
  const bgUrl = cardInfo.image || '';
  const tags = cardInfo.tags || [];

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: `${CARD_WIDTH}px`,
    height: `${CARD_HEIGHT}px`,
    padding: '16px',
    borderRadius: '16px',
    background: `url(${bgUrl}) lightgray 50% / cover no-repeat`,
    boxSizing: 'border-box'
  };

  const headingStyle = {
    margin: 0,
    fontFamily: FILTER_FONT_FAMILY,
    fontSize: `${FILTER_FONT_SIZE}px`,
    fontWeight: FILTER_FONT_WEIGHT,
    lineHeight: FILTER_LINE_HEIGHT,
    letterSpacing: FILTER_LETTER_SPACING,
    textTransform: 'uppercase',
    color: '#fff',
    cursor: 'pointer'
  };

  const filtersContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: `${FILTER_GAP}px`
  };

  return (
    <div style={cardStyle}>
      <h3 style={headingStyle} onClick={onTitleClick}>
        {heading}
      </h3>
      <div style={filtersContainerStyle}>
        {tags.map((tag) => {
          const filterStyle = {
            display: 'flex',
            padding: FILTER_PADDING,
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: FILTER_FONT_FAMILY,
            fontSize: `${FILTER_FONT_SIZE}px`,
            fontWeight: FILTER_FONT_WEIGHT,
            lineHeight: FILTER_LINE_HEIGHT,
            letterSpacing: FILTER_LETTER_SPACING,
            textTransform: 'uppercase',
            color: '#000',
            backgroundColor: FILTER_COLORS[tag] || 'lightgray',
            borderRadius: '8px'
          };
          return (
            <div key={tag} style={filterStyle}>
              {FILTER_LABELS[tag].toUpperCase()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
