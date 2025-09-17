import L from 'leaflet';

// Define icons for each category using SVG paths
const CATEGORY_ICONS: Record<string, { path: string; viewBox: string; color: string }> = {
  'Banedi Bari': {
    path: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z',
    viewBox: '0 0 24 24',
    color: '#0288d1' // Blue
  },
  'North/Central Kolkata': {
    path: 'M12 2L2 22h20L12 2zm0 3.84L18.6 20H5.4L12 5.84z',
    viewBox: '0 0 24 24',
    color: '#388e3c' // Green
  },
  'Salt Lake': {
    path: 'M12 2L1 21h22L12 2zm0 3.84L19.6 19H4.4L12 5.84z',
    viewBox: '0 0 24 24',
    color: '#f57c00' // Orange
  },
  'South Kolkata': {
    path: 'M12 2L3 22h18L12 2zm0 4.47L17.4 20H6.6L12 6.47z',
    viewBox: '0 0 24 24',
    color: '#d32f2f' // Red
  }
};

// Create a cache for the icon elements
const iconCache: Record<string, L.DivIcon> = {};

export function getCategoryIcon(category: string): L.DivIcon {
  // Return cached icon if available
  if (iconCache[category]) {
    return iconCache[category];
  }

  const iconConfig = CATEGORY_ICONS[category] || {
    path: 'M12 2L2 22h20L12 2zm0 3.84L18.6 20H5.4L12 5.84z',
    viewBox: '0 0 24 24',
    color: '#9e9e9e' // Default gray
  };
  
  // Create an SVG icon for the marker
  const html = `
    <div style="
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
    ">
      <svg 
        viewBox="${iconConfig.viewBox}" 
        width="24" 
        height="24"
        fill="${iconConfig.color}"
        stroke="white"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="${iconConfig.path}" />
      </svg>
    </div>
  `;

  // Create and cache the icon
  iconCache[category] = L.divIcon({
    html,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });

  return iconCache[category];
}

// Function to get color by category (for legend)
export function getCategoryColor(category: string): string {
  return CATEGORY_ICONS[category]?.color || '#9e9e9e';
}
