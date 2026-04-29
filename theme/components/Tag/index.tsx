import type React from 'react';

interface BadgeVariant {
  bg: string;
  border: string;
  color: string;
}

const VARIANTS: Record<string, BadgeVariant> = {
  ejectable: {
    bg:     'rgba(167, 139, 250, 0.12)',
    border: 'rgba(167, 139, 250, 0.35)',
    color:  '#5b21b6',
  },
  'non-ejectable': {
    bg:     'rgba(250, 200, 80, 0.12)',
    border: 'rgba(180, 130, 40, 0.35)',
    color:  '#7a5c00',
  },
  'eject-only': {
    bg:     'rgba(124, 58, 237, 0.08)',
    border: 'rgba(124, 58, 237, 0.25)',
    color:  '#7c3aed',
  },
};

const FALLBACK_VARIANT: BadgeVariant = {
  bg:     'rgba(13, 12, 23, 0.06)',
  border: 'rgba(13, 12, 23, 0.15)',
  color:  '#5a5770',
};

/** Single badge rendered with Bloque light design tokens. */
const BloqueBadge: React.FC<{ text: string; variant?: BadgeVariant }> = ({
  text,
  variant,
}) => {
  const v = variant ?? FALLBACK_VARIANT;

  return (
    <span
      style={{
        display:            'inline-flex',
        alignItems:         'center',
        justifyContent:     'center',
        height:             '1.375rem',
        padding:            '0 0.5rem',
        borderRadius:       '0.375rem',
        border:             `1px solid ${v.border}`,
        backgroundColor:    v.bg,
        color:              v.color,
        fontFamily:         'var(--rp-font-family-mono)',
        fontSize:           '10px',
        fontWeight:         600,
        textTransform:      'uppercase',
        letterSpacing:      '0.22em',
        whiteSpace:         'nowrap',
        lineHeight:         1,
        verticalAlign:      'middle',
        marginInlineStart:  '0.375rem',
      }}
    >
      {text}
    </span>
  );
};

export const Tag = ({ tag }: { tag?: string }) => {
  if (!tag) return null;

  const tags = tag.includes(',')
    ? tag.split(',').map((t) => t.trim())
    : [tag];

  return (
    <>
      {tags.map((t) => (
        <BloqueBadge key={t} text={t} variant={VARIANTS[t]} />
      ))}
    </>
  );
};
