// WidgetRemoveButton.js
import React from 'react';

const WidgetRemoveButton = ({ isEditMode, handleRemoveItem, itemId }) => {
  if (!isEditMode) return null;

  return (
    <button className="widget-remove-btn" onClick={() => handleRemoveItem(itemId)}>×</button>
  );
};

export default WidgetRemoveButton;
