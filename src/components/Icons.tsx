import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
}

interface FillIconProps {
  size?: number;
  fill?: string;
}

function base(size: number, stroke: string, sw: number) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}

export function IconFlash({ size = 24, stroke = 'currentColor', strokeWidth = 1.8 }: IconProps) {
  return <Svg {...base(size, stroke, strokeWidth)}><Path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" /></Svg>;
}

export function IconList({ size = 24, stroke = 'currentColor', strokeWidth = 1.8 }: IconProps) {
  return <Svg {...base(size, stroke, strokeWidth)}><Path d="M4 6h16M4 12h16M4 18h10" /></Svg>;
}

export function IconPlus({ size = 24, stroke = 'currentColor', strokeWidth = 1.8 }: IconProps) {
  return <Svg {...base(size, stroke, strokeWidth)}><Path d="M12 5v14M5 12h14" /></Svg>;
}

export function IconBarChart({ size = 24, stroke = 'currentColor', strokeWidth = 1.8 }: IconProps) {
  return <Svg {...base(size, stroke, strokeWidth)}><Path d="M5 20V11M12 20V4M19 20v-6" /></Svg>;
}

export function IconGear({ size = 24, stroke = 'currentColor', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...base(size, stroke, strokeWidth)}>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  );
}

export function IconCheck({ size = 24, stroke = 'currentColor', strokeWidth = 2.6 }: IconProps) {
  return <Svg {...base(size, stroke, strokeWidth)}><Path d="M5 12.5l4.5 4.5L19 6.5" /></Svg>;
}

export function IconChevLeft({ size = 24, stroke = 'currentColor', strokeWidth = 1.8 }: IconProps) {
  return <Svg {...base(size, stroke, strokeWidth)}><Path d="M15 5l-7 7 7 7" /></Svg>;
}

export function IconChevRight({ size = 24, stroke = 'currentColor', strokeWidth = 1.8 }: IconProps) {
  return <Svg {...base(size, stroke, strokeWidth)}><Path d="M9 5l7 7-7 7" /></Svg>;
}

export function IconFlame({ size = 24, fill = '#f07830' }: FillIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      <Path d="M12 2.5c.4 3-1.8 4.2-3 5.8-1.4 1.9-2 3.4-2 5.2A5 5 0 0 0 17 14c0-1.7-.6-3-1.5-4.2.2 1.2-.4 2.1-1 2.4.6-2.2-.7-4.6-2.5-5.6.5 1.6-.2 2.7-1 3.3.3-2.3-.2-5-.5-5.9.9-.5 2-1 2.5-1.5z" />
    </Svg>
  );
}

export function IconBell({ size = 24, stroke = 'currentColor', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...base(size, stroke, strokeWidth)}>
      <Path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
      <Path d="M10 20a2 2 0 0 0 4 0" />
    </Svg>
  );
}

export function IconClock({ size = 24, stroke = 'currentColor', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg {...base(size, stroke, strokeWidth)}>
      <Circle cx="12" cy="12" r="8.5" />
      <Path d="M12 7.5V12l3 2" />
    </Svg>
  );
}
