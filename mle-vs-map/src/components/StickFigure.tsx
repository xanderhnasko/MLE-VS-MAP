interface StickFigureProps {
  x: number;
  y: number;
  size?: number;
  color?: string;
  direction?: 'left' | 'right';
  label?: string;
  labelColor?: string;
}

export function StickFigure({ 
  x, 
  y, 
  size = 1, 
  color = '#000000', 
  direction = 'right',
  label,
  labelColor = '#000000'
}: StickFigureProps) {
  const baseSize = 20 * size;
  const headRadius = 3 * size;
  const bodyHeight = 8 * size;
  const armLength = 6 * size;
  const legLength = 6 * size;
  
  // Adjust arm positions for tug-of-war stance
  const armAngle = direction === 'left' ? -30 : 30;
  const armStartY = y - bodyHeight * 0.7;
  
  return (
    <g>
      {/* Platform (dash-style) */}
      <line
        x1={x - 15 * size}
        y1={y + 2}
        x2={x + 15 * size}
        y2={y + 2}
        stroke={color}
        strokeWidth={3 * size}
        strokeLinecap="round"
      />
      
      {/* Stick Figure */}
      {/* Head */}
      <circle
        cx={x}
        cy={y - bodyHeight - headRadius}
        r={headRadius}
        fill="none"
        stroke={color}
        strokeWidth={1.5 * size}
      />
      
      {/* Body */}
      <line
        x1={x}
        y1={y - bodyHeight}
        x2={x}
        y2={y}
        stroke={color}
        strokeWidth={1.5 * size}
      />
      
      {/* Arms in tug-of-war position */}
      <line
        x1={x}
        y1={armStartY}
        x2={x + (direction === 'left' ? -armLength : armLength)}
        y2={armStartY - armLength * Math.sin(Math.PI * armAngle / 180)}
        stroke={color}
        strokeWidth={1.5 * size}
      />
      
      {/* Legs */}
      <line
        x1={x}
        y1={y}
        x2={x - legLength * 0.5}
        y2={y + legLength}
        stroke={color}
        strokeWidth={1.5 * size}
      />
      <line
        x1={x}
        y1={y}
        x2={x + legLength * 0.5}
        y2={y + legLength}
        stroke={color}
        strokeWidth={1.5 * size}
      />
      
      {/* Label */}
      {label && (
        <text
          x={x}
          y={y - bodyHeight - headRadius - 5 * size}
          textAnchor="middle"
          fontSize={10 * size}
          fill={labelColor}
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  );
}