// src/components/FilterNav/FilterNav.jsx
import React from 'react';
import { FILTER_COLORS } from '../../constants';

export default function FilterNav({ activeFilter, onSelect }) {
  const navStyle = {
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '32px',
    background: 'transparent',
    zIndex: 1000
  };

  const buttonStyle = (f) => {
    // If no specific filter is selected ("all"), all buttons are fully opaque.
    // Once a filter other than "all" is active, non-selected buttons become semi-transparent.
    const isDefault = activeFilter === 'all';
    const opacity = isDefault || activeFilter === f ? 1 : 0.6;

    return {
      display: 'flex',
      padding: '14px 16px 12px 16px',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '12px',
      cursor: 'pointer',
      fontFamily: '"Tate New"',
      fontSize: '20px',
      fontWeight: 400,
      lineHeight: 'normal',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: 'rgba(0, 0, 0, 1)',
      backgroundColor: f === 'all' ? '#ffffff' : FILTER_COLORS[f],
      opacity
    };
  };

  return (
    <div style={navStyle}>
      <div style={buttonStyle('all')} onClick={() => onSelect('all')}>
        ALL
      </div>
      {['filter1', 'filter2', 'filter3', 'filter4'].map((f) => (
        <div key={f} style={buttonStyle(f)} onClick={() => onSelect(f)}>
          {f.toUpperCase()}
        </div>
      ))}
    </div>
  );
}
