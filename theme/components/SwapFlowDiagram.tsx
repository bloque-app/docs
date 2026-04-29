interface SwapFlowDiagramProps {
  highlight?: 'in' | 'out';
}

const rails = [
  { icon: 'PSE', label: 'PSE Banks', sub: 'COP via bank auth', dir: 'in' },
  { icon: 'KSM', label: 'Kusama', sub: 'crypto ↔ fiat', dir: 'both' },
  { icon: 'BRB', label: 'BRE-B Keys', sub: 'instant payments', dir: 'both' },
];

const accounts = [
  { icon: 'CRD', label: 'Card', sub: 'virtual debit/credit' },
  { icon: 'VIR', label: 'Virtual', sub: 'base account' },
  { icon: 'BCO', label: 'Bancolombia', sub: 'Colombian bank' },
  { icon: 'POL', label: 'Polygon', sub: 'Web3 wallet' },
];

export const SwapFlowDiagram = ({ highlight }: SwapFlowDiagramProps) => {
  const showIn = !highlight || highlight === 'in';
  const showOut = !highlight || highlight === 'out';

  return (
    <div
      style={{
        border: '1px solid var(--bloque-border)',
        borderRadius: '12px',
        overflow: 'hidden',
        margin: '1.5rem 0 2rem',
        fontFamily: "'Inter', system-ui, sans-serif",
        background: 'var(--bloque-surface)',
      }}
    >
      {/* Zone labels row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 160px 1fr',
          gap: '0',
        }}
      >
        <ZoneLabel text="OUTSIDE BLOQUE" align="left" />
        <div
          style={{
            background: 'var(--bloque-accent-tint)',
            borderLeft: '1px solid var(--bloque-accent-border)',
            borderRight: '1px solid var(--bloque-accent-border)',
          }}
        />
        <ZoneLabel text="INSIDE BLOQUE" align="right" />
      </div>

      {/* Main content row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 160px 1fr',
        }}
      >
        {/* Left: External rails */}
        <div
          style={{
            background: 'var(--bloque-surface)',
            padding: '20px 24px 24px',
            borderTop: '1px solid var(--bloque-border)',
            borderRight: '1px solid var(--bloque-border)',
          }}
        >
          <div style={{ marginBottom: '4px' }}>
            <Label text="Payment rails" />
          </div>
          {rails.map((r) => (
            <RailRow key={r.label} icon={r.icon} label={r.label} sub={r.sub} />
          ))}
        </div>

        {/* Center: Swap gateway */}
        <div
          style={{
            background: 'var(--bloque-accent-tint)',
            borderTop: '1px solid var(--bloque-accent-border)',
            borderLeft: '1px solid var(--bloque-accent-border)',
            borderRight: '1px solid var(--bloque-accent-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 12px',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: 'var(--bloque-accent)',
              textTransform: 'uppercase',
            }}
          >
            SWAP
          </div>
          <div
            style={{
              fontSize: '9px',
              color: 'var(--bloque-fg-subtle)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            exchange + rates
          </div>
          <div
            style={{
              width: '100%',
              height: '1px',
              background: 'var(--bloque-accent-border)',
            }}
          />
          {showIn && <FlowArrow label="cash-in" direction="right" />}
          {showOut && <FlowArrow label="cash-out" direction="left" muted />}
        </div>

        {/* Right: Bloque accounts */}
        <div
          style={{
            background: 'var(--bloque-surface)',
            padding: '20px 24px 24px',
            borderTop: '1px solid var(--bloque-border)',
            borderLeft: '1px solid var(--bloque-border)',
          }}
        >
          <div style={{ marginBottom: '4px' }}>
            <Label text="Your Ledger" />
          </div>
          {accounts.map((a, i) => (
            <AccountRow
              key={a.label}
              icon={a.icon}
              label={a.label}
              sub={a.sub}
              isLast={i === accounts.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Bottom legend */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          padding: '10px 20px',
          borderTop: '1px solid var(--bloque-border)',
          background: 'var(--bloque-surface-elevated)',
          flexWrap: 'wrap',
        }}
      >
        <LegendItem
          color="var(--bloque-accent)"
          label="→ cash-in: external money enters Bloque (e.g. PSE → Card)"
        />
        <LegendItem
          color="var(--bloque-fg-subtle)"
          label="← cash-out: Bloque balance exits to external destination"
        />
      </div>
    </div>
  );
};

const ZoneLabel = ({
  text,
  align,
}: {
  text: string;
  align: 'left' | 'right';
}) => (
  <div
    style={{
      padding: '8px 20px',
      background: 'var(--bloque-surface-elevated)',
      fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
      fontSize: '9px',
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      color: 'var(--bloque-fg-subtle)',
      fontWeight: 400,
      textAlign: align,
      borderBottom: '1px solid var(--bloque-border)',
    }}
  >
    {text}
  </div>
);

const Label = ({ text }: { text: string }) => (
  <div
    style={{
      fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
      fontSize: '9px',
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      color: 'var(--bloque-fg-subtle)',
      marginBottom: '10px',
    }}
  >
    {text}
  </div>
);

const RailRow = ({
  icon,
  label,
  sub,
}: {
  icon: string;
  label: string;
  sub: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '7px 0',
      borderBottom: '1px solid var(--bloque-border)',
    }}
  >
    <TokenIcon text={icon} />
    <div>
      <div
        style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--bloque-fg)',
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '0.7rem',
          color: 'var(--bloque-fg-subtle)',
          marginTop: '2px',
        }}
      >
        {sub}
      </div>
    </div>
  </div>
);

const AccountRow = ({
  icon,
  label,
  sub,
  isLast,
}: {
  icon: string;
  label: string;
  sub: string;
  isLast: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 0',
      borderBottom: isLast ? 'none' : '1px solid var(--bloque-border)',
    }}
  >
    <span
      style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: '0.7rem',
        color: 'var(--bloque-muted-dim)',
        flexShrink: 0,
        width: '12px',
      }}
    >
      {isLast ? '└' : '├'}
    </span>
    <TokenIcon text={icon} />
    <div>
      <div
        style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--bloque-fg)',
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '0.7rem',
          color: 'var(--bloque-fg-subtle)',
          marginTop: '1px',
        }}
      >
        {sub}
      </div>
    </div>
  </div>
);

const TokenIcon = ({ text }: { text: string }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30px',
      height: '22px',
      borderRadius: '6px',
      border: '1px solid var(--bloque-accent-border)',
      background: 'var(--bloque-accent-tint)',
      color: 'var(--bloque-accent)',
      fontFamily: "'Geist Mono', monospace",
      fontSize: '9px',
      fontWeight: 600,
      letterSpacing: '0.08em',
      lineHeight: 1,
      flexShrink: 0,
    }}
  >
    {text}
  </span>
);

const FlowArrow = ({
  label,
  direction,
  muted,
}: {
  label: string;
  direction: 'left' | 'right';
  muted?: boolean;
}) => {
  const color = muted ? 'var(--bloque-fg-subtle)' : 'var(--bloque-accent)';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: direction === 'right' ? 'row' : 'row-reverse',
        gap: '4px',
        width: '100%',
      }}
    >
      <span style={{ fontSize: '14px', color }}>
        {direction === 'right' ? '→' : '←'}
      </span>
      <span
        style={{
          fontSize: '9px',
          fontFamily: "'Geist Mono', monospace",
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color,
          fontWeight: muted ? 400 : 600,
        }}
      >
        {label}
      </span>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span style={{ fontSize: '11px', color, fontWeight: 700 }}>—</span>
    <span style={{ fontSize: '0.75rem', color: 'var(--bloque-fg-subtle)' }}>
      {label}
    </span>
  </div>
);
