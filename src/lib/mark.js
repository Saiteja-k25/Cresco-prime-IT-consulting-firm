// The Cresco Prime mark, redrawn from the approved logo so every edge is exactly vertical or at 30deg.
// Proportions are measured from the supplied artwork; only the wobble of the auto-trace is removed.
// Units: x from the centre line, y down from the top apex of the hexagon. Shared by the SVG and the 3D mark.

export const HEX = { w: 286, shoulder: 165.1, h: 594 }; // half width, y of the upper corners, full height
export const VIEWBOX = `${-HEX.w} 0 ${HEX.w * 2} ${HEX.h}`;

// The C is one spiral: the outer band curls inward into the inner C.
export const C = [
  [-20.5, 11.8], [-286, 165.1], [-286, 428.9], [-20.5, 582.2],
  [-20.5, 495.6], [-211, 385.6], [-211, 208.4], [-95.5, 141.7],
  [-95.5, 189], [-169.5, 231.7], [-169.5, 362.3], [-20.5, 448.3],
  [-20.5, 361.7], [-95.5, 318.4], [-95.5, 243.8], [-20.5, 200.5],
];

export const P = [[20.5, 11.8], [286, 165.1], [286, 365.8], [97.5, 474.6], [97.5, 582.2], [20.5, 582.2]];
export const P_HOLE = [[97.5, 142.9], [211, 208.4], [211, 322.5], [97.5, 388]];

export const toPath = (pts) => `M${pts.map((p) => p.join(' ')).join('L')}Z`;
