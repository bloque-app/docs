/**
 * Bloque module registry for the Flow Studio.
 *
 * A "module" is one node kind on the canvas. Plugin modules (rails, card,
 * polygon, regional accounts) mirror the IDs used by the existing checkbox
 * builder, so the same code generators in HomePage.tsx work unchanged. Core
 * modules (identity, ledger, swap) represent SDK concepts that don't appear
 * in the legacy plugin list but are useful as graph nodes.
 */

export type ModuleKind =
  | 'identity'
  | 'ledger'
  | 'swap'
  | 'card'
  | 'breb'
  | 'polygon'
  | 'us-account'
  | 'pix-account'
  | 'mexico-account'
  | 'europe-account';

export type ModuleRole = 'core' | 'attach' | 'gateway';

export type ModuleDefinition = {
  kind: ModuleKind;
  /** Stable plugin ID consumed by HomePage code generators (null for core). */
  pluginId: string | null;
  role: ModuleRole;
  name: { en: string; es: string };
  short: { en: string; es: string };
  accentColor: string;
  backgroundColor: string;
  /** Two-three letter mono badge used in the node. */
  badge: string;
};

export const MODULES: Record<ModuleKind, ModuleDefinition> = {
  identity: {
    kind: 'identity',
    pluginId: null,
    role: 'core',
    name: { en: 'Identity', es: 'Identidad' },
    short: { en: 'Customer alias + URN', es: 'Alias y URN del cliente' },
    accentColor: '#a78bfa',
    backgroundColor: '#1a1730',
    badge: 'ID',
  },
  ledger: {
    kind: 'ledger',
    pluginId: null,
    role: 'core',
    name: { en: 'Ledger', es: 'Ledger' },
    short: { en: 'Shared balance hub', es: 'Balance compartido' },
    accentColor: '#a78bfa',
    backgroundColor: '#0d0c17',
    badge: 'LDG',
  },
  swap: {
    kind: 'swap',
    pluginId: null,
    role: 'gateway',
    name: { en: 'Swap', es: 'Swap' },
    short: {
      en: 'External rails gateway',
      es: 'Puerta de rieles externos',
    },
    accentColor: '#a78bfa',
    backgroundColor: '#181530',
    badge: 'SWP',
  },
  card: {
    kind: 'card',
    pluginId: 'card',
    role: 'attach',
    name: { en: 'Card', es: 'Tarjeta' },
    short: {
      en: 'Virtual card on the ledger',
      es: 'Tarjeta virtual del ledger',
    },
    accentColor: '#6d28d9',
    backgroundColor: '#1c1330',
    badge: 'CRD',
  },
  breb: {
    kind: 'breb',
    pluginId: 'breb',
    role: 'attach',
    name: { en: 'Bre-B', es: 'Bre-B' },
    short: { en: 'Colombia instant rails', es: 'Pagos instantáneos CO' },
    accentColor: '#ff5a3d',
    backgroundColor: '#2a1612',
    badge: 'BRB',
  },
  polygon: {
    kind: 'polygon',
    pluginId: 'polygon',
    role: 'attach',
    name: { en: 'Polygon', es: 'Polygon' },
    short: { en: 'On-chain wallet', es: 'Cuenta on-chain' },
    accentColor: '#0f766e',
    backgroundColor: '#0f2725',
    badge: 'POL',
  },
  'us-account': {
    kind: 'us-account',
    pluginId: 'us-account',
    role: 'attach',
    name: { en: 'US accounts', es: 'Cuentas US' },
    short: { en: 'ACH + routing', es: 'ACH + routing' },
    accentColor: '#2563eb',
    backgroundColor: '#101a2a',
    badge: 'USA',
  },
  'pix-account': {
    kind: 'pix-account',
    pluginId: 'pix-account',
    role: 'attach',
    name: { en: 'Pix', es: 'Pix' },
    short: { en: 'Brazil instant rails', es: 'Pagos instantáneos BR' },
    accentColor: '#16a34a',
    backgroundColor: '#0f2419',
    badge: 'PIX',
  },
  'mexico-account': {
    kind: 'mexico-account',
    pluginId: 'mexico-account',
    role: 'attach',
    name: { en: 'Mexico accounts', es: 'Cuentas MX' },
    short: { en: 'MXN via SPEI', es: 'MXN vía SPEI' },
    accentColor: '#f59e0b',
    backgroundColor: '#26190d',
    badge: 'MEX',
  },
  'europe-account': {
    kind: 'europe-account',
    pluginId: 'europe-account',
    role: 'attach',
    name: { en: 'Europe accounts', es: 'Cuentas EU' },
    short: { en: 'EUR / SEPA', es: 'EUR / SEPA' },
    accentColor: '#0f766e',
    backgroundColor: '#0f2422',
    badge: 'EUR',
  },
};

export const PLUGIN_KINDS: ModuleKind[] = [
  'card',
  'breb',
  'polygon',
  'us-account',
  'pix-account',
  'mexico-account',
  'europe-account',
];

export type PaletteCategoryId = 'core' | 'global' | 'us' | 'co' | 'br' | 'mx' | 'eu';

export type PaletteCategory = {
  id: PaletteCategoryId;
  label: { en: string; es: string };
  flag: string | null;
  kinds: ModuleKind[];
};

export const PALETTE_CATEGORIES: PaletteCategory[] = [
  {
    id: 'core',
    label: { en: 'Core', es: 'Núcleo' },
    flag: null,
    kinds: ['identity', 'ledger', 'swap'],
  },
  {
    id: 'global',
    label: { en: 'Global', es: 'Global' },
    flag: null,
    kinds: ['card', 'polygon'],
  },
  {
    id: 'us',
    label: { en: 'United States', es: 'Estados Unidos' },
    flag: '🇺🇸',
    kinds: ['us-account'],
  },
  {
    id: 'co',
    label: { en: 'Colombia', es: 'Colombia' },
    flag: '🇨🇴',
    kinds: ['breb'],
  },
  {
    id: 'br',
    label: { en: 'Brazil', es: 'Brasil' },
    flag: '🇧🇷',
    kinds: ['pix-account'],
  },
  {
    id: 'mx',
    label: { en: 'Mexico', es: 'México' },
    flag: '🇲🇽',
    kinds: ['mexico-account'],
  },
  {
    id: 'eu',
    label: { en: 'Europe', es: 'Europa' },
    flag: '🇪🇺',
    kinds: ['europe-account'],
  },
];

export const pluginIdToKind = (pluginId: string): ModuleKind | null => {
  const entry = Object.values(MODULES).find((m) => m.pluginId === pluginId);
  return entry ? entry.kind : null;
};

export const kindToPluginId = (kind: ModuleKind): string | null =>
  MODULES[kind]?.pluginId ?? null;
