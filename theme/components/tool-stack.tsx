import { useLang } from '@rspress/core/runtime';
import type React from 'react';
import { memo } from 'react';

export const ToolStack: React.FC = memo(() => {
  const lang = useLang();
  const isEn = lang === 'en';

  const tools = [
    {
      name: 'Bloque SDK',
      desc: isEn
        ? 'Create organizations, verify identities, issue cards and manage accounts with a single SDK'
        : 'Crea organizaciones, verifica identidades, emite tarjetas y gestiona cuentas con un solo SDK',
      iconLabel: 'SDK',
      url: '/sdk',
      urlText: 'docs/sdk',
    },
    {
      name: 'Bloque Pay',
      desc: isEn
        ? 'Complete payment gateway to process transactions securely and efficiently'
        : 'Pasarela de pagos completa para procesar transacciones de forma segura y eficiente',
      iconLabel: 'PAY',
      url: '/pay',
      urlText: 'docs/pay',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Section header */}
      <div className="text-center mb-12">
        {/* Mono eyebrow */}
        <p
          className="bloque-mono-label mb-3"
          style={{ color: 'var(--bloque-fg-subtle)' }}
        >
          {isEn ? 'PLATFORM' : 'PLATAFORMA'}
        </p>

        <h2
          className="text-[2.25rem] font-bold mb-4 dark:text-white"
          style={{
            color: 'var(--bloque-fg)',
            letterSpacing: '-0.030em',
          }}
        >
          Bloque Stack
        </h2>

        <p
          className="text-[1rem] max-w-2xl mx-auto dark:text-[#8fa1b9]"
          style={{
            color: 'var(--bloque-fg-muted)',
            lineHeight: 1.68,
          }}
        >
          {isEn
            ? 'A unified financial infrastructure platform with comprehensive tools for payments, accounts, cards and identity verification'
            : 'Una plataforma unificada de infraestructura financiera con herramientas completas para pagos, cuentas, tarjetas y verificación de identidad'}
        </p>
      </div>

      {/* Cards grid */}
      <div className="flex flex-wrap gap-6 justify-center items-stretch">
        {tools.map(({ name, desc, iconLabel, url, urlText }) => (
          <a
            key={name}
            href={url}
            className="
              group relative flex-1 min-w-[280px] max-w-[calc(50%-12px)]
              flex flex-col items-start gap-3 p-7
              rounded-[14px] no-underline cursor-pointer
              transition-all duration-200 ease-out
              dark:bg-white/[0.03] dark:border-[#23272f]
              hover:-translate-y-[2px]
            "
            style={{
              backgroundColor: 'var(--bloque-surface)',
              border: '1px solid var(--bloque-border)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.border =
                '1px solid var(--bloque-border-strong)';
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'var(--bloque-surface-elevated)';
              (e.currentTarget as HTMLElement).style.boxShadow =
                'var(--bloque-elevated-shadow)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.border =
                '1px solid var(--bloque-border)';
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'var(--bloque-surface)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            {/* Icon well */}
            <div
              className="flex items-center justify-center w-12 h-12 rounded-[10px]"
              style={{
                backgroundColor: 'var(--bloque-accent-tint)',
                border: '1px solid var(--bloque-accent-border)',
              }}
            >
              <span
                className="font-mono text-[11px] font-semibold tracking-[0.12em]"
                style={{ color: 'var(--bloque-accent)' }}
              >
                {iconLabel}
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-[18px] font-semibold m-0 dark:text-white"
              style={{
                color: 'var(--bloque-fg)',
                letterSpacing: '-0.018em',
                lineHeight: 1.4,
              }}
            >
              {name}
            </h3>

            {/* Description */}
            <p
              className="text-[14px] text-left m-0 flex-1 dark:text-[#8fa1b9]"
              style={{
                color: 'var(--bloque-fg-muted)',
                lineHeight: 1.65,
              }}
            >
              {desc}
            </p>

            {/* CTA link */}
            <span
              className="text-[13px] font-medium dark:text-[#a78bfa]"
              style={{
                color: 'var(--bloque-accent)',
                letterSpacing: '0.01em',
              }}
            >
              {urlText} →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
});
