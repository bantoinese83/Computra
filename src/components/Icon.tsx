import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  X,
  Send,
  Loader2,
  Sparkles,
  Bot,
  Check,
  ExternalLink,
  Server,
  Zap,
  Globe,
  Info,
  Layers,
  Search,
  Cpu,
  AlertTriangle,
  XCircle,
  Copy,
} from 'lucide-react';

export type IconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'help'
  | 'check-circle'
  | 'close'
  | 'send'
  | 'loader'
  | 'sparkles'
  | 'bot'
  | 'check'
  | 'external-link'
  | 'server'
  | 'zap'
  | 'globe'
  | 'info'
  | 'layers'
  | 'search'
  | 'cpu'
  | 'x'
  | 'alert-triangle'
  | 'x-circle'
  | 'copy';

const ICONS: Record<IconName, LucideIcon> = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  help: HelpCircle,
  'check-circle': CheckCircle2,
  close: X,
  send: Send,
  loader: Loader2,
  sparkles: Sparkles,
  bot: Bot,
  check: Check,
  'external-link': ExternalLink,
  server: Server,
  zap: Zap,
  globe: Globe,
  info: Info,
  layers: Layers,
  search: Search,
  cpu: Cpu,
  x: X,
  'alert-triangle': AlertTriangle,
  'x-circle': XCircle,
  copy: Copy,
};

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
}

export const Icon: React.FC<IconProps> = ({ name, size, ...svgProps }) => {
  const Lucide = ICONS[name];
  return <Lucide aria-hidden="true" size={size} {...svgProps} />;
};


