// src/components/Card/CardPreviewModal.jsx
import React from 'react';
import cardsData from '../../data/cardsData';

export default function CardPreviewModal({ id, onClose }) {
  // Look up the card’s preview data
  const cardInfo = cardsData.find((c) => c.id === id) || {};
  const heading = cardInfo.preview?.heading || 'No Title';
  const text = cardInfo.preview?.text || 'No preview available.';

  // Simple backdrop + centered box
  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalStyle = {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '90%',
    boxSizing: 'border-box'
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>{heading}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
}
