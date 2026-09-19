import React from 'react';

export default function StreetView({ iframe }) {
  return (
    <div
      style={{ width: "100%", maxWidth: 900, margin: "20px 0" }}
      dangerouslySetInnerHTML={{ __html: iframe }}
    />
  );
}
