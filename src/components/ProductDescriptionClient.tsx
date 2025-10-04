import React, { useState } from 'react';
import productStyles from '../app/products/product.module.css';

export default function ProductDescriptionClient({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  return (
    <div>
      <p className={`${productStyles.description} ${expanded ? productStyles.descriptionExpanded : ''}`}>{description}</p>
      <button
        className={productStyles.descriptionToggle}
        aria-expanded={expanded}
        onClick={() => setExpanded((s) => !s)}
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </div>
  );
}
