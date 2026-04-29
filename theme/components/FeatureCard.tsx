import type { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string | ReactNode;
  href?: string;
}

/**
 * FeatureCard — Bloque card with icon well.
 *
 * Usage in MDX:
 *   import { FeatureCard } from '@theme';
 *   <FeatureCard title="Virtual Cards" description="Issue cards instantly." icon="💳" />
 *
 * Icon well: accent-border + accent-tint fill → auto-adapts dark/light.
 */
export const FeatureCard = ({
  title,
  description,
  icon,
  href,
}: FeatureCardProps) => {
  const card = (
    <div
      style={{
        background: 'var(--bloque-surface)',
        border: '1px solid var(--bloque-border)',
        borderRadius: '12px',
        padding: '20px',
        transition:
          'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
        cursor: href ? 'pointer' : 'default',
        height: '100%',
      }}
    >
      {icon && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid var(--bloque-accent-border)',
            background: 'var(--bloque-accent-tint)',
            fontSize: '16px',
            marginBottom: '12px',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
      <div
        style={{
          fontSize: '0.9375rem',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: 'var(--bloque-fg)',
          marginBottom: '6px',
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '0.8125rem',
          color: 'var(--bloque-fg-muted)',
          lineHeight: 1.6,
        }}
      >
        {description}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: 'none', display: 'block' }}>
        {card}
      </a>
    );
  }

  return card;
};
