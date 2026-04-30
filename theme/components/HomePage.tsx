import { CodeBlockRuntime } from '@rspress/core/theme';
import { useEffect, useState } from 'react';

declare const __PUBLIC_SUPABASE_URL__: string;
declare const __PUBLIC_SUPABASE_PUBLISHABLE_KEY__: string;
declare const __PUBLIC_SUPABASE_TABLE__: string;

type Product = {
  id: string;
  title: string;
  description: string;
  defaultMediums: string[];
  scope: string[];
  relevantPluginIds: string[];
};

type Medium = {
  id: string;
  name: string;
  description: string;
};

type CardStyle = {
  id: string;
  name: string;
  tone: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  markTextColor: string;
  markBackground: string;
};

type Plugin = {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  backgroundColor: string;
};

type PluginCategory = {
  id: string;
  label: string;
  flag: string | null;
  pluginIds: string[];
};

type WalkthroughStep = {
  title: string;
  description: string;
  focus: string;
  filename: string;
  lang: string;
};

type Locale = 'en' | 'es';

type Copy = {
  email: {
    title: string;
    description: string;
    label: string;
    placeholder: string;
  };
  product: {
    title: string;
    description: string;
  };
  studio: {
    title: string;
    description: string;
    brand: string;
    logoName: string;
    themes: string;
    personalization: string;
    primary: string;
    accent: string;
    placeholder: string;
  };
  plugins: {
    title: string;
    description: string;
  };
  code: {
    title: string;
    description: string;
    descriptionNoCard: string;
    copy: string;
    copied: string;
    step: string;
    of: string;
  };
  handoff: {
    title: string;
    description: string;
    summary: string;
    docsTitle: string;
    promptTitle: string;
    copyPrompt: string;
    copiedPrompt: string;
    buildLabel: string;
    docsLabel: string;
    promptIntro: string;
  };
  footer: {
    summary: string;
    back: string;
    next: string;
    done: string;
  };
};

const products: Product[] = [
  {
    id: 'consumer-wallet',
    title: 'Consumer wallet',
    description:
      'A wallet your customers use inside your app, backed by Bloque accounts.',
    defaultMediums: ['card', 'breb'],
    scope: [
      'Register the customer from their email',
      'Create one shared balance with pockets',
      'Show balance, activity, and available payment methods',
    ],
    relevantPluginIds: ['card', 'breb', 'polygon'],
  },
  {
    id: 'card-program',
    title: 'Card program',
    description:
      'A branded card experience with limits, controls, and real-time events.',
    defaultMediums: ['card', 'polygon'],
    scope: [
      'Create the cardholder profile',
      'Issue a virtual card connected to one ledger',
      'Configure spending controls and transaction webhooks',
    ],
    relevantPluginIds: ['card', 'polygon', 'us-account'],
  },
  {
    id: 'merchant-payouts',
    title: 'Merchant payouts',
    description:
      'A payout product that can settle to local rails and Polygon from one flow.',
    defaultMediums: ['breb', 'polygon'],
    scope: [
      'Create merchant accounts',
      'Attach Bre-B and Polygon to the same ledger',
      'Track payout status and reconciliation events',
    ],
    relevantPluginIds: [
      'breb',
      'polygon',
      'pix-account',
      'us-account',
      'mexico-account',
      'europe-account',
    ],
  },
];

const copyByLocale: Record<Locale, Copy> = {
  en: {
    email: {
      title: 'Start with your email.',
      description:
        'We use it as the first customer identifier in the generated SDK flow.',
      label: 'Work email',
      placeholder: 'founder@company.com',
    },
    product: {
      title: 'Choose what you want to build.',
      description:
        'Pick the product closest to your B2B2C use case. The code will stay centered through the setup.',
    },
    studio: {
      title: 'Design the card experience.',
      description:
        'Tune the brand and colors. The final code will create the card with the selected name and ledger.',
      brand: 'Brand',
      logoName: 'Logo name',
      themes: 'Themes',
      personalization: 'Personalization',
      primary: 'Primary',
      accent: 'Accent',
      placeholder: 'Company name',
    },
    plugins: {
      title: 'Choose SDK plugins.',
      description:
        'Select the account capabilities to add after SDK initialization. Every option here maps to documented SDK calls.',
    },
    code: {
      title: 'Build from the code.',
      description:
        'Install the SDK, create the card, attach account plugins, then move money.',
      descriptionNoCard:
        'Install the SDK, set up the account, attach plugins, then move money.',
      copy: 'Copy',
      copied: 'Copied',
      step: 'Step',
      of: 'of',
    },
    handoff: {
      title: 'Hand this to your agent.',
      description:
        'You now have the product shape, the account rails, and the implementation order. Copy the prompt below into your coding agent and keep the docs open while it builds.',
      summary: 'Selected build',
      docsTitle: 'Read before building',
      promptTitle: 'Agent prompt',
      copyPrompt: 'Copy prompt',
      copiedPrompt: 'Prompt copied',
      buildLabel: 'Build',
      docsLabel: 'Docs',
      promptIntro:
        'Use this prompt as the starting instruction for Cursor, Codex, Claude Code, or another implementation agent.',
    },
    footer: {
      summary: 'Build accounts, cards, Bre-B, and Polygon products.',
      back: 'Back',
      next: 'Next',
      done: 'Ready to build',
    },
  },
  es: {
    email: {
      title: 'Empieza con tu email.',
      description:
        'Lo usamos como el primer identificador del cliente en el flujo generado del SDK.',
      label: 'Email de trabajo',
      placeholder: 'fundador@empresa.com',
    },
    product: {
      title: 'Elige lo que quieres construir.',
      description:
        'Escoge el producto mas cercano a tu caso B2B2C. El codigo se mantiene como el centro de la experiencia.',
    },
    studio: {
      title: 'Disena la experiencia de tarjeta.',
      description:
        'Ajusta la marca y los colores. El codigo final creara la tarjeta con el nombre y ledger seleccionados.',
      brand: 'Marca',
      logoName: 'Nombre del logo',
      themes: 'Temas',
      personalization: 'Personalizacion',
      primary: 'Primario',
      accent: 'Acento',
      placeholder: 'Nombre de empresa',
    },
    plugins: {
      title: 'Elige plugins del SDK.',
      description:
        'Selecciona las capacidades de cuentas que se agregan despues de inicializar el SDK. Cada opcion apunta a llamadas documentadas.',
    },
    code: {
      title: 'Construye desde el codigo.',
      description:
        'Instala el SDK, crea la tarjeta, agrega cuentas y luego mueve dinero.',
      descriptionNoCard:
        'Instala el SDK, configura la cuenta, agrega plugins y luego mueve dinero.',
      copy: 'Copiar',
      copied: 'Copiado',
      step: 'Paso',
      of: 'de',
    },
    handoff: {
      title: 'Pasalo a tu agente.',
      description:
        'Ya tienes el producto, los rieles de cuenta y el orden de implementacion. Copia el prompt en tu agente de codigo y mantén la documentacion abierta mientras construye.',
      summary: 'Build seleccionado',
      docsTitle: 'Lee antes de construir',
      promptTitle: 'Prompt para agente',
      copyPrompt: 'Copiar prompt',
      copiedPrompt: 'Prompt copiado',
      buildLabel: 'Build',
      docsLabel: 'Docs',
      promptIntro:
        'Usa este prompt como instruccion inicial para Cursor, Codex, Claude Code u otro agente de implementacion.',
    },
    footer: {
      summary: 'Construye cuentas, tarjetas, Bre-B y productos Polygon.',
      back: 'Atras',
      next: 'Siguiente',
      done: 'Listo para construir',
    },
  },
};

const mediums: Medium[] = [
  {
    id: 'card',
    name: 'Card',
    description: 'Issue virtual cards with spending controls.',
  },
  {
    id: 'breb',
    name: 'Bre-B',
    description: 'Connect Colombian instant payment rails.',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    description: 'Add on-chain accounts to the same balance.',
  },
];

const cardStyles: CardStyle[] = [
  {
    id: 'violet-sunset',
    name: 'Violet Dusk',
    tone: 'Bloque violet with a hot coral horizon.',
    primaryColor: '#6d28d9',
    accentColor: '#ff5a3d',
    textColor: '#fff7ed',
    markTextColor: '#4c1d95',
    markBackground: '#f5e8ff',
  },
  {
    id: 'rose-ember',
    name: 'Rose Ember',
    tone: 'Raspberry depth with amber firelight.',
    primaryColor: '#be185d',
    accentColor: '#f97316',
    textColor: '#fff1f2',
    markTextColor: '#881337',
    markBackground: '#ffe4e6',
  },
  {
    id: 'teal-afterglow',
    name: 'Teal Afterglow',
    tone: 'Deep ocean teal with a rose-gold flare.',
    primaryColor: '#0f766e',
    accentColor: '#ff8a5c',
    textColor: '#ecfeff',
    markTextColor: '#115e59',
    markBackground: '#ccfbf1',
  },
];

const getReadableTextColor = (hexColor: string) => {
  const normalized = hexColor.replace('#', '');

  if (normalized.length !== 6) {
    return '#f8f7ff';
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;

  return luminance > 145 ? '#0d0c17' : '#f8f7ff';
};

const getBrandFromEmail = (email: string) => {
  const [localPart, rawDomain] = email.split('@');
  const domain = rawDomain?.split('.')[0] ?? '';
  const publicMailProviders = new Set([
    'gmail',
    'outlook',
    'hotmail',
    'yahoo',
    'icloud',
    'proton',
    'aol',
  ]);
  const source = publicMailProviders.has(domain) ? (localPart ?? '') : domain;

  return source
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const plugins: Plugin[] = [
  {
    id: 'card',
    name: 'Card issuing',
    description: 'Virtual cards, limits, controls, and cardholder events.',
    accentColor: '#6d28d9',
    backgroundColor: '#f3edff',
  },
  {
    id: 'us-account',
    name: 'US accounts',
    description: 'US bank accounts with TOS, routing, and ledger linking.',
    accentColor: '#2563eb',
    backgroundColor: '#eaf2ff',
  },
  {
    id: 'europe-account',
    name: 'Europe accounts',
    description: 'EUR regional accounts for SEPA-style collection flows.',
    accentColor: '#0f766e',
    backgroundColor: '#e6faf7',
  },
  {
    id: 'mexico-account',
    name: 'Mexico accounts',
    description: 'MXN regional accounts for local payout via SPEI.',
    accentColor: '#f59e0b',
    backgroundColor: '#fff4dd',
  },
  {
    id: 'pix-account',
    name: 'Pix accounts',
    description: 'Brazilian Pix rails for instant BRL collection.',
    accentColor: '#16a34a',
    backgroundColor: '#e9f9ef',
  },
  {
    id: 'breb',
    name: 'Bre-B rails',
    description: 'Instant local payments connected to the same ledger.',
    accentColor: '#ff5a3d',
    backgroundColor: '#fff1eb',
  },
  {
    id: 'polygon',
    name: 'Polygon account',
    description: 'On-chain accounts sharing the product balance.',
    accentColor: '#0f766e',
    backgroundColor: '#e9fbf7',
  },
];

const pluginCategories: PluginCategory[] = [
  { id: 'global', label: 'Global', flag: null, pluginIds: ['card', 'polygon'] },
  { id: 'us', label: 'United States', flag: '🇺🇸', pluginIds: ['us-account'] },
  { id: 'co', label: 'Colombia', flag: '🇨🇴', pluginIds: ['breb'] },
  { id: 'br', label: 'Brazil', flag: '🇧🇷', pluginIds: ['pix-account'] },
  { id: 'mx', label: 'Mexico', flag: '🇲🇽', pluginIds: ['mexico-account'] },
  { id: 'eu', label: 'Europe', flag: '🇪🇺', pluginIds: ['europe-account'] },
];

const walkthroughStepsByLocale: Record<Locale, WalkthroughStep[]> = {
  en: [
    {
      title: 'Install the SDK',
      description:
        'Add the Bloque SDK package before writing integration code.',
      focus: 'Install',
      filename: 'terminal',
      lang: 'shell',
    },
    {
      title: 'Create the card',
      description:
        'Instantiate the SDK, create the shared ledger, and issue the card.',
      focus: 'Card',
      filename: 'create-card.ts',
      lang: 'ts',
    },
    {
      title: 'Add plugins',
      description:
        'Attach each selected account capability to the same ledger.',
      focus: 'Plugins',
      filename: 'plugins.ts',
      lang: 'ts',
    },
    {
      title: 'Move money',
      description:
        'Top up the card, withdraw from it, and move funds to another account.',
      focus: 'Transfer',
      filename: 'move-money.ts',
      lang: 'ts',
    },
  ],
  es: [
    {
      title: 'Instala el SDK',
      description:
        'Agrega el paquete de Bloque SDK antes de escribir la integracion.',
      focus: 'Instalar',
      filename: 'terminal',
      lang: 'shell',
    },
    {
      title: 'Crea la tarjeta',
      description:
        'Instancia el SDK, crea el ledger compartido y emite la tarjeta.',
      focus: 'Tarjeta',
      filename: 'create-card.ts',
      lang: 'ts',
    },
    {
      title: 'Agrega plugins',
      description: 'Conecta cada capacidad de cuenta elegida al mismo ledger.',
      focus: 'Plugins',
      filename: 'plugins.ts',
      lang: 'ts',
    },
    {
      title: 'Mueve dinero',
      description:
        'Recarga la tarjeta, retira de ella y mueve fondos a otra cuenta.',
      focus: 'Transferir',
      filename: 'move-money.ts',
      lang: 'ts',
    },
  ],
};

const walkthroughStepsNonCardByLocale: Record<Locale, WalkthroughStep[]> = {
  en: [
    {
      title: 'Install the SDK',
      description:
        'Add the Bloque SDK package before writing integration code.',
      focus: 'Install',
      filename: 'terminal',
      lang: 'shell',
    },
    {
      title: 'Set up the account',
      description:
        'Instantiate the SDK and create the shared ledger for your product.',
      focus: 'Setup',
      filename: 'setup.ts',
      lang: 'ts',
    },
    {
      title: 'Add plugins',
      description:
        'Attach each selected account capability to the same ledger.',
      focus: 'Plugins',
      filename: 'plugins.ts',
      lang: 'ts',
    },
    {
      title: 'Move money',
      description: 'Fund the account and move money to the connected rails.',
      focus: 'Transfer',
      filename: 'move-money.ts',
      lang: 'ts',
    },
  ],
  es: [
    {
      title: 'Instala el SDK',
      description:
        'Agrega el paquete de Bloque SDK antes de escribir la integracion.',
      focus: 'Instalar',
      filename: 'terminal',
      lang: 'shell',
    },
    {
      title: 'Configura la cuenta',
      description:
        'Instancia el SDK y crea el ledger compartido para tu producto.',
      focus: 'Setup',
      filename: 'setup.ts',
      lang: 'ts',
    },
    {
      title: 'Agrega plugins',
      description: 'Conecta cada capacidad de cuenta elegida al mismo ledger.',
      focus: 'Plugins',
      filename: 'plugins.ts',
      lang: 'ts',
    },
    {
      title: 'Mueve dinero',
      description: 'Fondea la cuenta y mueve dinero a los rieles conectados.',
      focus: 'Transferir',
      filename: 'move-money.ts',
      lang: 'ts',
    },
  ],
};

const getAccountCreationBlocks = ({
  brandName,
  email,
  pluginIds,
  productTitle,
  includeCard = true,
}: {
  brandName: string;
  email: string;
  pluginIds: string[];
  productTitle: string;
  includeCard?: boolean;
}) => {
  const blocks: string[] = [];
  const returnEntries: string[] = [];

  if (pluginIds.includes('breb')) {
    blocks.push(`// BRE-B
const brebAccount = await session.accounts.breb.create(
  {
    ledgerId: pocket.ledgerId,
    keyType: 'EMAIL',
    key: ${JSON.stringify(email)},
    displayName: ${JSON.stringify(brandName)},
  },
  { waitLedger: true },
);`);
    returnEntries.push('    brebAccount,');
  }

  if (pluginIds.includes('pix-account')) {
    blocks.push(`// Pix
const pixAccount = await session.accounts.pix.create(
  {
    ledgerId: pocket.ledgerId,
    keyType: 'EMAIL',
    key: ${JSON.stringify(email)},
    displayName: ${JSON.stringify(brandName)},
  },
  { waitLedger: true },
);`);
    returnEntries.push('    pixAccount,');
  }

  if (pluginIds.includes('us-account')) {
    blocks.push(`// US account
const tosLink = await bloque.accounts.us.getTosLink({
  redirectUri: 'https://myapp.com/callback',
});

const usAccount = await bloque.accounts.us.create(
  {
    ledgerId: pocket.ledgerId,
    type: 'individual',
    firstName: 'Customer',
    lastName: 'Account',
    email: ${JSON.stringify(email)},
    phone: '+12125551234',
    address: {
      streetLine1: '456 Wall Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10005',
      country: 'US',
    },
    birthDate: '1985-03-15',
    taxIdentificationNumber: '123-45-6789',
    govIdCountry: 'US',
    govIdImageFront: 'base64_encoded_image_here',
    signedAgreementId: 'signed-agreement-id-from-tos-callback',
  },
  { waitLedger: true },
);`);
    returnEntries.push('    tosLink,');
    returnEntries.push('    usAccount,');
  }

  if (pluginIds.includes('europe-account')) {
    blocks.push(`// Europe account
const europeAccount = await session.accounts.europe.create(
  {
    ledgerId: pocket.ledgerId,
    currency: 'EUR',
  },
  { waitLedger: true },
);`);
    returnEntries.push('    europeAccount,');
  }

  if (pluginIds.includes('mexico-account')) {
    blocks.push(`// Mexico account
const mexicoAccount = await session.accounts.mexico.create(
  {
    ledgerId: pocket.ledgerId,
    currency: 'MXN',
  },
  { waitLedger: true },
);`);
    returnEntries.push('    mexicoAccount,');
  }

  if (pluginIds.includes('polygon')) {
    blocks.push(`// Polygon account
const polygonAccount = await session.accounts.polygon.create(
  {
    ledgerId: pocket.ledgerId,
    metadata: {
      product: ${JSON.stringify(productTitle)},
    },
  },
  { waitLedger: true },
);`);
    returnEntries.push('    polygonAccount,');
  }

  if (includeCard && pluginIds.includes('card')) {
    blocks.push(`// Card issuing
const card = await session.accounts.card.create(
  {
    ledgerId: pocket.ledgerId,
    name: ${JSON.stringify(brandName)},
    metadata: {
      spending_control: {
        type: 'default',
        default_asset: 'DUSD/6',
      },
    },
  },
  { waitLedger: true },
);`);
    returnEntries.push('    card,');
  }

  return { blocks, returnEntries };
};

const getCardSetupCode = ({
  brandName,
  email,
  sandboxToken,
}: {
  brandName: string;
  email: string;
  sandboxToken?: string;
}) => {
  const safeAlias = `@${
    email
      .split('@')[0]
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .toLowerCase() || 'customer'
  }`;

  const apiKeyLine = sandboxToken
    ? `    apiKey: ${JSON.stringify(sandboxToken)},`
    : `    apiKey: process.env.BLOQUE_SECRET_KEY!,`;

  return `import { SDK } from '@bloque/sdk';

const bloque = new SDK({
  auth: {
    type: 'apiKey',
${apiKeyLine}
  },
  mode: 'sandbox',
});

const session = await bloque.connect(${JSON.stringify(safeAlias)});

const pocket = await session.accounts.virtual.create(
  {},
  { waitLedger: true },
);

const card = await session.accounts.card.create(
  {
    ledgerId: pocket.ledgerId,
    name: ${JSON.stringify(brandName)},
    metadata: {
      spending_control: {
        type: 'default',
        default_asset: 'DUSD/6',
      },
    },
  },
  { waitLedger: true },
);`;
};

const getAccountSetupCode = ({
  email,
  sandboxToken,
}: {
  email: string;
  sandboxToken?: string;
}) => {
  const safeAlias = `@${
    email
      .split('@')[0]
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .toLowerCase() || 'customer'
  }`;

  const apiKeyLine = sandboxToken
    ? `    apiKey: ${JSON.stringify(sandboxToken)},`
    : `    apiKey: process.env.BLOQUE_SECRET_KEY!,`;

  return `import { SDK } from '@bloque/sdk';

const bloque = new SDK({
  auth: {
    type: 'apiKey',
${apiKeyLine}
  },
  mode: 'sandbox',
});

const session = await bloque.connect(${JSON.stringify(safeAlias)});

const pocket = await session.accounts.virtual.create(
  {},
  { waitLedger: true },
);`;
};

const getMoveMoneyCode = (pluginIds: string[]) => {
  const destinationAccount =
    [
      ['breb', 'brebAccount'],
      ['pix-account', 'pixAccount'],
      ['us-account', 'usAccount'],
      ['europe-account', 'europeAccount'],
      ['mexico-account', 'mexicoAccount'],
      ['polygon', 'polygonAccount'],
    ].find(([pluginId]) => pluginIds.includes(pluginId))?.[1] ?? 'pocket';

  return `const topUpCard = await session.accounts.transfer({
  sourceUrn: pocket.urn,
  destinationUrn: card.urn,
  amount: '1000000',
  asset: 'DUSD/6',
  metadata: {
    reference: 'card-top-up',
  },
});

const withdrawFromCard = await session.accounts.transfer({
  sourceUrn: card.urn,
  destinationUrn: pocket.urn,
  amount: '500000',
  asset: 'DUSD/6',
  metadata: {
    reference: 'card-withdrawal',
  },
});

const moveToPlugin = await session.accounts.transfer({
  sourceUrn: pocket.urn,
  destinationUrn: ${destinationAccount}.urn,
  amount: '1000000',
  asset: 'DUSD/6',
  metadata: {
    reference: 'plugin-transfer',
  },
});

console.log('Top-up queued:', topUpCard.queueId);
console.log('Withdrawal queued:', withdrawFromCard.queueId);
console.log('Plugin transfer queued:', moveToPlugin.queueId);`;
};

const getNonCardMoveMoneyCode = (pluginIds: string[]) => {
  const destinationAccount =
    [
      ['breb', 'brebAccount'],
      ['pix-account', 'pixAccount'],
      ['us-account', 'usAccount'],
      ['europe-account', 'europeAccount'],
      ['mexico-account', 'mexicoAccount'],
      ['polygon', 'polygonAccount'],
    ].find(([pluginId]) => pluginIds.includes(pluginId))?.[1] ?? 'pocket';

  return `const fundPocket = await session.accounts.transfer({
  sourceUrn: 'external-funding-source-urn',
  destinationUrn: pocket.urn,
  amount: '1000000',
  asset: 'DUSD/6',
  metadata: {
    reference: 'pocket-funding',
  },
});

const moveToPlugin = await session.accounts.transfer({
  sourceUrn: pocket.urn,
  destinationUrn: ${destinationAccount}.urn,
  amount: '1000000',
  asset: 'DUSD/6',
  metadata: {
    reference: 'plugin-transfer',
  },
});

console.log('Pocket funded:', fundPocket.queueId);
console.log('Plugin transfer queued:', moveToPlugin.queueId);`;
};

const readUrlState = () => {
  const p =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const productId = p.get('p');
  const product = products.find((pr) => pr.id === productId) ?? products[0];
  const styleId = p.get('style');
  const style = cardStyles.find((s) => s.id === styleId) ?? cardStyles[0];
  const pluginsRaw = p.get('plugins');
  return {
    step: Math.max(0, Math.min(4, Number(p.get('s')) || 0)),
    email: p.get('e') ?? '',
    product,
    pluginIds: pluginsRaw
      ? pluginsRaw.split(',').filter(Boolean)
      : product.defaultMediums,
    style,
    brandName: p.get('brand') ?? '',
    primaryColor: p.get('pc') ? `#${p.get('pc')}` : style.primaryColor,
    accentColor: p.get('ac') ? `#${p.get('ac')}` : style.accentColor,
    integrationStep: Math.max(0, Number(p.get('ws')) || 0),
    sandboxToken: p.get('sandbox_token') ?? '',
  };
};

const SUPABASE_URL = __PUBLIC_SUPABASE_URL__;
const SUPABASE_ANON_KEY = __PUBLIC_SUPABASE_PUBLISHABLE_KEY__;
const SUPABASE_TABLE = __PUBLIC_SUPABASE_TABLE__ || 'homepage_leads';

const ProductWizard = () => {
  const locale: Locale =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/en')
      ? 'en'
      : 'es';
  const copy = copyByLocale[locale];
  const [step, setStep] = useState(() => readUrlState().step);
  const [email, setEmail] = useState(() => readUrlState().email);
  const [selectedProduct, setSelectedProduct] = useState(
    () => readUrlState().product,
  );
  const [selectedPluginIds, setSelectedPluginIds] = useState(
    () => readUrlState().pluginIds,
  );
  const [selectedStyle, setSelectedStyle] = useState(
    () => readUrlState().style,
  );
  const [brandName, setBrandName] = useState(() => readUrlState().brandName);
  const [primaryColor, setPrimaryColor] = useState(
    () => readUrlState().primaryColor,
  );
  const [accentColor, setAccentColor] = useState(
    () => readUrlState().accentColor,
  );
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAgentPrompt, setCopiedAgentPrompt] = useState(false);
  const [integrationStep, setIntegrationStep] = useState(
    () => readUrlState().integrationStep,
  );
  const [sandboxToken] = useState(() => readUrlState().sandboxToken);
  const [sessionId, setSessionId] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [introFading, setIntroFading] = useState(false);

  const isCardProduct = selectedProduct.defaultMediums.includes('card');
  const effectiveSteps = isCardProduct ? [0, 1, 2, 3, 4, 5] : [0, 1, 3, 4, 5];
  const stepPosition = effectiveSteps.indexOf(step);
  const stepLabel = String(stepPosition + 1).padStart(2, '0');
  const lastStep = effectiveSteps[effectiveSteps.length - 1];
  const activeWalkthroughSteps = isCardProduct
    ? walkthroughStepsByLocale[locale]
    : walkthroughStepsNonCardByLocale[locale];

  const emailIsValid = /\S+@\S+\.\S+/.test(email);
  const emailBrandName = getBrandFromEmail(email);
  const cardBrandName = brandName.trim() || emailBrandName || 'Bloque';
  const selectedMediums = plugins.filter((plugin) =>
    selectedPluginIds.includes(plugin.id),
  );
  const includesCard = selectedPluginIds.includes('card');
  const cardTextColor =
    primaryColor === selectedStyle.primaryColor
      ? selectedStyle.textColor
      : getReadableTextColor(primaryColor);
  const markTextColor =
    primaryColor === selectedStyle.primaryColor
      ? selectedStyle.markTextColor
      : primaryColor;
  const markBackground =
    primaryColor === selectedStyle.primaryColor
      ? selectedStyle.markBackground
      : cardTextColor === '#0d0c17'
        ? 'rgba(13, 12, 23, 0.88)'
        : 'rgba(255, 255, 255, 0.88)';
  const cardBackground = includesCard
    ? `radial-gradient(circle at 18% 18%, ${accentColor}55, transparent 26%), linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor} 42%, ${accentColor} 100%)`
    : 'linear-gradient(135deg, #0d0c17 0%, #1f2937 52%, #334155 100%)';
  const brandInitials = cardBrandName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const accountCode = getAccountCreationBlocks({
    brandName: cardBrandName,
    email: email || 'customer@company.com',
    pluginIds: selectedPluginIds,
    productTitle: selectedProduct.title,
    includeCard: false,
  }).blocks.join('\n\n');
  const setupCode = isCardProduct
    ? getCardSetupCode({
        brandName: cardBrandName,
        email: email || 'customer@company.com',
        sandboxToken: sandboxToken || undefined,
      })
    : getAccountSetupCode({
        email: email || 'customer@company.com',
        sandboxToken: sandboxToken || undefined,
      });
  const moveMoneyCode = isCardProduct
    ? getMoveMoneyCode(selectedPluginIds)
    : getNonCardMoveMoneyCode(selectedPluginIds);
  const walkthroughCode = [
    `bun add @bloque/sdk
npm install @bloque/sdk
pnpm add @bloque/sdk`,
    setupCode,
    accountCode || '// Select account plugins to append them here.',
    moveMoneyCode,
  ][integrationStep];
  const walkthrough = activeWalkthroughSteps[integrationStep];
  const docsPrefix = locale === 'en' ? '/en' : '/es';
  const docsLinks = [
    {
      label: 'SDK start',
      href: `${docsPrefix}/sdk/guide/start/getting-started`,
    },
    ...(includesCard
      ? [
          {
            label: 'Cards',
            href: `${docsPrefix}/sdk/guide/accounts/cards`,
          },
        ]
      : []),
    ...(selectedPluginIds.includes('breb')
      ? [
          {
            label: 'BRE-B',
            href: `${docsPrefix}/sdk/guide/accounts/breb`,
          },
        ]
      : []),
    ...(selectedPluginIds.includes('polygon')
      ? [
          {
            label: 'Polygon',
            href: `${docsPrefix}/sdk/guide/accounts/polygon`,
          },
        ]
      : []),
    {
      label: 'Transfers',
      href: `${docsPrefix}/sdk/guide/accounts/transfers`,
    },
  ];
  const agentPrompt = `You are implementing a Bloque SDK integration.

Goal:
Build a ${selectedProduct.title} for ${cardBrandName} using @bloque/sdk.

Customer identifier:
${email || 'customer@company.com'}
${
  sandboxToken
    ? `\nSDK token (sandbox, ready to use):
${sandboxToken}\n`
    : ''
}
Selected account capabilities:
${selectedMediums.map((medium) => `- ${medium.name}: ${medium.description}`).join('\n')}

Implementation order:
1. Install @bloque/sdk.
2. Initialize an authenticated Bloque SDK session.
3. Register or resolve the customer identity from the email above.
4. Create one shared ledger/pocket for the product.
${includesCard ? '5. Issue a virtual card connected to that ledger.\n' : ''}${selectedPluginIds.includes('breb') ? `${includesCard ? '6' : '5'}. Create a BRE-B key on the same ledger.\n` : ''}${selectedPluginIds.includes('polygon') ? `${includesCard || selectedPluginIds.includes('breb') ? '7' : '5'}. Create a Polygon account on the same ledger.\n` : ''}${selectedPluginIds.includes('us-account') ? '- Add the US account flow only after the TOS link and signed agreement are handled.\n' : ''}${selectedPluginIds.includes('pix-account') ? '- Create the Pix account using an email key on the same ledger.\n' : ''}${selectedPluginIds.includes('mexico-account') ? '- Create the Mexico account on the same ledger.\n' : ''}${selectedPluginIds.includes('europe-account') ? '- Create the Europe account on the same ledger.\n' : ''}- Add transfer flows so funds can move between the${includesCard ? ' card and the' : ''} selected accounts.
- Return clear TypeScript functions, typed inputs, error handling, and a minimal usage example.

Use these docs while implementing:
${docsLinks.map((link) => `- ${link.label}: ${link.href}`).join('\n')}`;

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setIntroFading(true), 1300);
    const hideTimer = window.setTimeout(() => setShowIntro(false), 1900);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storageKey = 'bloque-homepage-session-id';
    const existing = window.localStorage.getItem(storageKey);
    if (existing) {
      setSessionId(existing);
      return;
    }

    const nextId = crypto.randomUUID();
    window.localStorage.setItem(storageKey, nextId);
    setSessionId(nextId);
  }, []);

  const chooseProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedPluginIds(product.defaultMediums);
    if (!product.defaultMediums.includes('card') && step === 2) {
      setStep(3);
    }
  };

  const togglePlugin = (pluginId: string) => {
    setCopiedCode(false);
    setSelectedPluginIds((current) => {
      if (current.includes(pluginId)) {
        return current.filter((id) => id !== pluginId);
      }

      return [...current, pluginId];
    });
  };

  const goWalkthroughNext = () => {
    setIntegrationStep((current) =>
      Math.min(current + 1, activeWalkthroughSteps.length - 1),
    );
  };

  const goWalkthroughBack = () => {
    setIntegrationStep((current) => Math.max(current - 1, 0));
  };

  const chooseCardStyle = (style: CardStyle) => {
    setSelectedStyle(style);
    setPrimaryColor(style.primaryColor);
    setAccentColor(style.accentColor);
  };

  const goNext = () => {
    if (step === 0 && !emailIsValid) {
      return;
    }

    const currentIdx = effectiveSteps.indexOf(step);
    setStep(
      effectiveSteps[Math.min(currentIdx + 1, effectiveSteps.length - 1)],
    );
  };

  const goBack = () => {
    const currentIdx = effectiveSteps.indexOf(step);
    setStep(effectiveSteps[Math.max(currentIdx - 1, 0)]);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (step > 0) params.set('s', String(step));
    if (email) params.set('e', email);
    if (selectedProduct.id !== products[0].id)
      params.set('p', selectedProduct.id);
    const pluginsKey = [...selectedPluginIds].sort().join(',');
    const defaultKey = [...selectedProduct.defaultMediums].sort().join(',');
    if (pluginsKey !== defaultKey)
      params.set('plugins', selectedPluginIds.join(','));
    if (selectedStyle.id !== cardStyles[0].id)
      params.set('style', selectedStyle.id);
    if (brandName) params.set('brand', brandName);
    if (primaryColor !== selectedStyle.primaryColor)
      params.set('pc', primaryColor.replace('#', ''));
    if (accentColor !== selectedStyle.accentColor)
      params.set('ac', accentColor.replace('#', ''));
    if (integrationStep > 0) params.set('ws', String(integrationStep));
    if (sandboxToken) params.set('sandbox_token', sandboxToken);
    const qs = params.toString();
    history.replaceState(
      null,
      '',
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
    );
  }, [
    step,
    email,
    selectedProduct,
    selectedPluginIds,
    selectedStyle,
    brandName,
    primaryColor,
    accentColor,
    integrationStep,
    sandboxToken,
  ]);

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !sessionId || !emailIsValid) {
      return;
    }

    const timeout = window.setTimeout(async () => {
      try {
        const payload = {
          session_id: sessionId,
          email,
          locale,
          step,
          integration_step: integrationStep,
          product_id: selectedProduct.id,
          product_title: selectedProduct.title,
          plugin_ids: selectedPluginIds,
          card_style_id: selectedStyle.id,
          brand_name: cardBrandName,
          primary_color: primaryColor,
          accent_color: accentColor,
          includes_card: includesCard,
          sandbox_token_present: Boolean(sandboxToken),
          updated_at: new Date().toISOString(),
        };

        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`,
          {
            method: 'POST',
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              Prefer: 'return=minimal',
            },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          const body = await response.text();
          throw new Error(
            `Supabase save failed with status ${response.status}: ${body}`,
          );
        }
      } catch (error) {
        console.error(error);
      }
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [
    sessionId,
    emailIsValid,
    email,
    locale,
    step,
    integrationStep,
    selectedProduct,
    selectedPluginIds,
    selectedStyle,
    cardBrandName,
    primaryColor,
    accentColor,
    includesCard,
    sandboxToken,
  ]);

  const copyCurrentCode = async () => {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(walkthroughCode);
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 1800);
  };

  const copyAgentPrompt = async () => {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(agentPrompt);
    setCopiedAgentPrompt(true);
    window.setTimeout(() => setCopiedAgentPrompt(false), 1800);
  };

  return (
    <main className="bloque-product bp-shell">
      <section className="bp-wizard" aria-label="Bloque product wizard">
        <div className="bp-wizard__body">
          {showIntro ? (
            <div className="bp-screen bp-screen--email">
              <div className="bp-screen__copy">
                <span>01</span>
                <h2
                  style={{
                    opacity: introFading ? 0 : 1,
                    transform: introFading
                      ? 'translateY(-8px)'
                      : 'translateY(0px)',
                    transition: 'opacity 520ms ease, transform 520ms ease',
                  }}
                >
                  Let&apos;s design your financial product
                </h2>
              </div>
            </div>
          ) : null}

          {!showIntro && step === 0 ? (
            <div className="bp-screen bp-screen--email">
              <div className="bp-screen__copy">
                <span>{stepLabel}</span>
                <h2>{copy.email.title}</h2>
                <p>{copy.email.description}</p>
              </div>
              <label className="bp-field">
                <span>{copy.email.label}</span>
                <input
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={copy.email.placeholder}
                  type="email"
                  value={email}
                />
              </label>
            </div>
          ) : null}

          {!showIntro && step === 1 ? (
            <div className="bp-screen">
              <div className="bp-screen__copy">
                <span>{stepLabel}</span>
                <h2>{copy.product.title}</h2>
                <p>{copy.product.description}</p>
              </div>
              <div className="bp-product-grid">
                {products.map((product) => (
                  <button
                    className={`bp-product-card ${
                      selectedProduct.id === product.id ? 'is-active' : ''
                    }`}
                    key={product.id}
                    onClick={() => chooseProduct(product)}
                    type="button"
                  >
                    <strong>{product.title}</strong>
                    <small>{product.description}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {!showIntro && step === 2 && isCardProduct ? (
            <div className="bp-screen bp-screen--studio">
              <div className="bp-studio-heading">
                <div className="bp-screen__copy">
                  <span>{stepLabel}</span>
                  <h2>{copy.studio.title}</h2>
                  <p>{copy.studio.description}</p>
                </div>
              </div>

              <div className="bp-card-studio">
                <section className="bp-card-stage" aria-label="Card preview">
                  <div
                    className="bp-card bp-card--feature"
                    style={{
                      '--bp-card-mark-bg': markBackground,
                      '--bp-card-mark-color': markTextColor,
                      '--bp-card-text': cardTextColor,
                      background: cardBackground,
                    }}
                  >
                    <div className="bp-card__brand">
                      <div className="bp-card__mark">
                        {brandInitials || 'B'}
                      </div>
                      <span>{includesCard ? cardBrandName : 'Bloque'}</span>
                    </div>
                    <strong>
                      {includesCard ? '4977 8008 1337 2048' : 'Shared ledger'}
                    </strong>
                    <div className="bp-card__meta">
                      <small>{selectedProduct.title}</small>
                      <small>
                        {selectedMediums
                          .map((medium) => medium.name)
                          .join(' / ')}
                      </small>
                    </div>
                  </div>
                </section>

                <aside className="bp-studio-controls">
                  <div className="bp-tool">
                    <h3>{copy.studio.brand}</h3>
                    <label className="bp-field bp-field--compact">
                      <span>{copy.studio.logoName}</span>
                      <input
                        maxLength={18}
                        onChange={(event) => setBrandName(event.target.value)}
                        placeholder={emailBrandName || copy.studio.placeholder}
                        type="text"
                        value={brandName}
                      />
                    </label>
                  </div>
                  {includesCard ? (
                    <div className="bp-tool">
                      <h3>{copy.studio.themes}</h3>
                      <div className="bp-choice-row">
                        {cardStyles.map((style) => (
                          <button
                            className={`bp-chip bp-theme-chip ${
                              selectedStyle.id === style.id ? 'is-active' : ''
                            }`}
                            key={style.id}
                            onClick={() => chooseCardStyle(style)}
                            style={{
                              '--bp-theme-accent': style.accentColor,
                              '--bp-theme-primary': style.primaryColor,
                            }}
                            type="button"
                          >
                            <span className="bp-theme-chip__swatches">
                              <i />
                              <i />
                            </span>
                            <strong>{style.name}</strong>
                            <small>{style.tone}</small>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {includesCard ? (
                    <div className="bp-tool">
                      <h3>{copy.studio.personalization}</h3>
                      <div className="bp-color-grid">
                        <label className="bp-color-field">
                          <span>{copy.studio.primary}</span>
                          <input
                            aria-label="Card primary color"
                            onChange={(event) =>
                              setPrimaryColor(event.target.value)
                            }
                            type="color"
                            value={primaryColor}
                          />
                        </label>
                        <label className="bp-color-field">
                          <span>{copy.studio.accent}</span>
                          <input
                            aria-label="Card accent color"
                            onChange={(event) =>
                              setAccentColor(event.target.value)
                            }
                            type="color"
                            value={accentColor}
                          />
                        </label>
                      </div>
                    </div>
                  ) : null}
                </aside>
              </div>
            </div>
          ) : null}

          {!showIntro && step === 3 ? (
            <div className="bp-screen bp-screen--plugins">
              <div className="bp-screen__copy">
                <span>{stepLabel}</span>
                <h2>{copy.plugins.title}</h2>
                <p>{copy.plugins.description}</p>
              </div>

              <div className="bp-plugin-builder">
                <aside className="bp-plugin-list" aria-label="Plugin options">
                  {pluginCategories.map((category) => {
                    const categoryPlugins = plugins.filter(
                      (p) =>
                        category.pluginIds.includes(p.id) &&
                        selectedProduct.relevantPluginIds.includes(p.id),
                    );
                    if (categoryPlugins.length === 0) return null;
                    return (
                      <div key={category.id} className="bp-plugin-category">
                        <div className="bp-plugin-category__header">
                          {category.flag && (
                            <span
                              className="bp-plugin-category__flag"
                              aria-hidden="true"
                            >
                              {category.flag}
                            </span>
                          )}
                          <span className="bp-plugin-category__label">
                            {category.label}
                          </span>
                        </div>
                        <div className="bp-plugin-category__items">
                          {categoryPlugins.map((plugin) => (
                            <label
                              className={`bp-plugin-item ${
                                selectedPluginIds.includes(plugin.id)
                                  ? 'is-active'
                                  : ''
                              }`}
                              key={plugin.id}
                              style={{
                                '--bp-plugin-accent': plugin.accentColor,
                                '--bp-plugin-bg': plugin.backgroundColor,
                              }}
                            >
                              <input
                                checked={selectedPluginIds.includes(plugin.id)}
                                onChange={() => togglePlugin(plugin.id)}
                                type="checkbox"
                              />
                              <span
                                className="bp-plugin-item__check"
                                aria-hidden="true"
                              >
                                <span />
                              </span>
                              <span className="bp-plugin-item__content">
                                <strong>{plugin.name}</strong>
                                <small>{plugin.description}</small>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </aside>
              </div>
            </div>
          ) : null}

          {!showIntro && step === 4 ? (
            <div className="bp-screen bp-screen--walkthrough">
              <div className="bp-screen__copy">
                <span>{stepLabel}</span>
                <h2>{copy.code.title}</h2>
                <p>
                  {isCardProduct
                    ? copy.code.description
                    : copy.code.descriptionNoCard}
                </p>
              </div>

              <div className="bp-walkthrough">
                <section className="bp-walkthrough-panel">
                  <div className="bp-walkthrough-nav">
                    {activeWalkthroughSteps.map((item, index) => (
                      <button
                        className={`bp-walkthrough-pill ${
                          index === integrationStep ? 'is-active' : ''
                        }`}
                        key={item.title}
                        onClick={() => setIntegrationStep(index)}
                        type="button"
                      >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <strong>{item.focus}</strong>
                      </button>
                    ))}
                  </div>

                  <div className="bp-tool bp-walkthrough-step">
                    <h3>{walkthrough.title}</h3>
                    <p>{walkthrough.description}</p>
                    <div className="bp-walkthrough-actions">
                      <button
                        className="bp-link-button"
                        disabled={integrationStep === 0}
                        onClick={goWalkthroughBack}
                        type="button"
                      >
                        {copy.footer.back}
                      </button>
                      <button
                        className="bp-button"
                        disabled={
                          integrationStep === activeWalkthroughSteps.length - 1
                        }
                        onClick={goWalkthroughNext}
                        type="button"
                      >
                        {copy.footer.next}
                      </button>
                    </div>
                  </div>
                </section>

                <section
                  className="bp-code-panel"
                  aria-label="Integration code"
                >
                  <div className="bp-code-panel__bar">
                    <div>
                      <strong>{walkthrough.filename}</strong>
                      <span>
                        {copy.code.step} {integrationStep + 1} {copy.code.of}{' '}
                        {activeWalkthroughSteps.length}
                      </span>
                    </div>
                    <button
                      className="bp-copy-button"
                      onClick={copyCurrentCode}
                      type="button"
                    >
                      {copiedCode ? (
                        <>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M2 7L5 10L11 3" />
                          </svg>
                          {copy.code.copied}
                        </>
                      ) : (
                        <>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <rect
                              x="4.5"
                              y="1.5"
                              width="7"
                              height="9"
                              rx="1.5"
                            />
                            <path d="M8.5 1.5H2.5a1 1 0 0 0-1 1v9" />
                          </svg>
                          {copy.code.copy}
                        </>
                      )}
                    </button>
                  </div>
                  <CodeBlockRuntime
                    code={walkthroughCode}
                    lang={walkthrough.lang}
                    lineNumbers
                    title={walkthrough.filename}
                    wrapCode={false}
                    containerElementClassName="bp-code-runtime"
                    codeButtonGroupProps={{
                      showCodeWrapButton: false,
                      showCopyButton: false,
                    }}
                  />
                </section>
              </div>
            </div>
          ) : null}

          {!showIntro && step === 5 ? (
            <div className="bp-screen bp-screen--handoff">
              <div className="bp-screen__copy">
                <span>{stepLabel}</span>
                <h2>
                  {locale === 'en' ? (
                    <>
                      Hand this to <em>your</em> agent.
                    </>
                  ) : (
                    <>
                      Pásalo a <em>tu</em> agente.
                    </>
                  )}
                </h2>
                <p>{copy.handoff.description}</p>
              </div>

              <div className="bp-handoff">
                <section className="bp-handoff-summary">
                  <div>
                    <span>{copy.handoff.buildLabel}</span>
                    <strong>{selectedProduct.title}</strong>
                    <p>{selectedProduct.description}</p>
                  </div>
                  <div>
                    <span>{copy.handoff.summary}</span>
                    <ul>
                      <li>{cardBrandName}</li>
                      {selectedMediums.map((medium) => (
                        <li key={medium.id}>{medium.name}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span>{copy.handoff.docsLabel}</span>
                    <nav aria-label={copy.handoff.docsTitle}>
                      {docsLinks.map((link) => (
                        <a href={link.href} key={link.href}>
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                </section>

                <section className="bp-agent-prompt">
                  <div className="bp-agent-prompt__bar">
                    <div>
                      <strong>{copy.handoff.promptTitle}</strong>
                      <span>{copy.handoff.promptIntro}</span>
                    </div>
                    <button
                      className="bp-copy-button"
                      onClick={copyAgentPrompt}
                      type="button"
                    >
                      {copiedAgentPrompt ? (
                        <>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M2 7L5 10L11 3" />
                          </svg>
                          {copy.handoff.copiedPrompt}
                        </>
                      ) : (
                        <>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <rect
                              x="4.5"
                              y="1.5"
                              width="7"
                              height="9"
                              rx="1.5"
                            />
                            <path d="M8.5 1.5H2.5a1 1 0 0 0-1 1v9" />
                          </svg>
                          {copy.handoff.copyPrompt}
                        </>
                      )}
                    </button>
                  </div>
                  <pre>
                    <code>{agentPrompt}</code>
                  </pre>
                </section>
              </div>
            </div>
          ) : null}
        </div>

        <div className="bp-wizard__footer">
          <div className="bp-footer-brand">
            <strong>Bloque Docs</strong>
            <span>{copy.footer.summary}</span>
          </div>

          <nav className="bp-footer-links" aria-label="Documentation links">
            <a href="/en/">English</a>
            <a href="/es/">Español</a>
            <a href="/en/sdk/guide/start/getting-started">SDK</a>
            <a href="/en/pay/guide/start/getting-started">Pay</a>
          </nav>

          <div className="bp-footer-actions">
            <button
              className="bp-link-button"
              disabled={showIntro || step === 0}
              onClick={goBack}
              type="button"
            >
              {copy.footer.back}
            </button>
            <div
              className="bp-progress"
              role="progressbar"
              aria-label={`Step ${stepPosition + 1} of ${effectiveSteps.length}`}
              aria-valuemax={effectiveSteps.length}
              aria-valuemin={1}
              aria-valuenow={stepPosition + 1}
            >
              {effectiveSteps.map((_, idx) => (
                <span
                  className={idx <= stepPosition ? 'is-active' : ''}
                  key={idx}
                />
              ))}
            </div>
            {!showIntro && step < lastStep ? (
              <button
                className="bp-button"
                disabled={step === 0 && !emailIsValid}
                onClick={goNext}
                type="button"
              >
                {copy.footer.next}
              </button>
            ) : !showIntro ? (
              <span className="bp-footer-note">{copy.footer.done}</span>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
};

export const HomeLayout = () => <ProductWizard />;
