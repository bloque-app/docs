import { useLang } from '@rspress/core/runtime';
import { memo, useCallback, useEffect, useState } from 'react';

interface CheckoutConfig {
  amount: number;
  currency: string;
  lang: string;
  primaryColor: string;
  borderRadius: string;
  requireEmail: boolean;
}

interface PaymentMessage {
  type: 'payment-result' | 'payment-error';
  data?: Record<string, unknown>;
  error?: string;
}

// ── Shared class tokens ────────────────────────────────────────────────────

const panelBase = [
  'rounded-xl p-6',
  'border',
  'dark:bg-[#1a1a2e] dark:border-gray-700',
].join(' ');

const panelStyle = {
  backgroundColor: 'var(--bloque-surface)',
  borderColor: 'var(--bloque-border)',
} as const;

const inputBase = [
  'w-full px-3 py-2.5 rounded-md text-sm',
  'dark:bg-[#252540] dark:text-white dark:border-gray-600',
  'focus:outline-none transition-colors duration-150',
].join(' ');

const inputStyle = {
  backgroundColor: 'var(--bloque-bg)',
  color: 'var(--bloque-fg)',
  border: '1px solid var(--bloque-border-strong)',
} as const;

const labelClass = [
  'block mb-1.5 text-sm font-medium',
  'dark:text-gray-300',
].join(' ');

const labelStyle = { color: 'var(--bloque-fg-muted)' } as const;

// ──────────────────────────────────────────────────────────────────────────

export const CheckoutCustomizer: React.FC = memo(() => {
  const currentLang = useLang();
  const isEn = currentLang === 'en';

  const [config, setConfig] = useState<CheckoutConfig>({
    amount: 50,
    currency: 'USD',
    lang: currentLang === 'en' ? 'en' : 'es',
    primaryColor: '#7c3aed', // default to Bloque accent
    borderRadius: '8px',
    requireEmail: true,
  });

  const [iframeUrl, setIframeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    show: boolean;
    isError: boolean;
    content: string;
  }>({ show: false, isError: false, content: '' });

  const buildUrl = useCallback((cfg: CheckoutConfig) => {
    const baseUrl = 'https://payments.bloque.app/checkout';
    const params = new URLSearchParams({
      preview: 'true',
      amount: cfg.amount.toString(),
      currency: cfg.currency,
      lang: cfg.lang,
      primaryColor: cfg.primaryColor,
      borderRadius: cfg.borderRadius,
      requireEmail: cfg.requireEmail ? 'true' : 'false',
    });
    return `${baseUrl}?${params.toString()}`;
  }, []);

  const updateIframe = useCallback(() => {
    setIframeUrl(buildUrl(config));
    setResult({ show: false, isError: false, content: '' });
  }, [config, buildUrl]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: run only on mount
  useEffect(() => {
    updateIframe();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<PaymentMessage>) => {
      if (event.data.type === 'payment-result') {
        setResult({
          show: true,
          isError: false,
          content: JSON.stringify(event.data.data, null, 2),
        });
      }
      if (event.data.type === 'payment-error') {
        setResult({
          show: true,
          isError: true,
          content: `Error: ${event.data.error}`,
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleInputChange = (
    field: keyof CheckoutConfig,
    value: string | number | boolean,
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const generateCodeSnippet = useCallback(
    (cfg: CheckoutConfig) => {
      const successComment = isEn ? 'Payment successful!' : 'Pago exitoso!';
      const errorComment = isEn ? 'Payment error:' : 'Error en pago:';
      return `import { BloqueCheckout } from '@bloque/payments-react';

function CheckoutPage({ checkoutId }: { checkoutId: string }) {
  return (
    <BloqueCheckout
      checkoutId={checkoutId}
      lang="${cfg.lang}"
      appearance={{
        primaryColor: '${cfg.primaryColor}',
        borderRadius: '${cfg.borderRadius}',
      }}
      onSuccess={(data) => {
        console.log('${successComment}', data.payment_id);
      }}
      onError={(error) => {
        console.error('${errorComment}', error);
      }}
    />
  );
}`;
    },
    [isEn],
  );

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generateCodeSnippet(config));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [config, generateCodeSnippet]);

  const texts = {
    title: isEn ? 'Checkout Configuration' : 'Configuracion del Checkout',
    amount: isEn ? 'Amount' : 'Monto',
    currency: isEn ? 'Currency' : 'Moneda',
    language: isEn ? 'Language' : 'Idioma',
    primaryColor: isEn ? 'Primary Color' : 'Color Primario',
    borderRadius: 'Border Radius',
    requireEmail: isEn ? 'Require Email' : 'Requerir Email',
    updateButton: isEn ? 'Update Checkout' : 'Actualizar Checkout',
    previewTitle: isEn ? 'Checkout Preview' : 'Vista Previa del Checkout',
    paymentResult: isEn ? 'Payment Result:' : 'Resultado del Pago:',
    currencies: {
      USD: isEn ? 'USD - US Dollar' : 'USD - Dolar Estadounidense',
      COP: isEn ? 'COP - Colombian Peso' : 'COP - Peso Colombiano',
    },
    languages: {
      es: isEn ? 'Spanish' : 'Espanol',
      en: isEn ? 'English' : 'Ingles',
    },
    codeTitle: isEn ? 'Code Snippet' : 'Codigo',
    copyButton: isEn ? 'Copy' : 'Copiar',
    copiedButton: isEn ? 'Copied!' : 'Copiado!',
  };

  return (
    <div className="w-full my-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* ── Config Panel ─────────────────────────────────────── */}
        <div className={panelBase} style={panelStyle}>
          <h3
            className="text-xl font-semibold mb-5 flex items-center gap-2 dark:text-white"
            style={{ color: 'var(--bloque-fg)', letterSpacing: '-0.018em' }}
          >
            <PanelMark>CFG</PanelMark> {texts.title}
          </h3>

          {/* Amount */}
          <div className="mb-4">
            <label
              htmlFor="checkout-amount"
              className={labelClass}
              style={labelStyle}
            >
              {texts.amount}
            </label>
            <input
              id="checkout-amount"
              type="number"
              value={config.amount}
              onChange={(e) =>
                handleInputChange('amount', Number(e.target.value))
              }
              className={inputBase}
              style={inputStyle}
            />
          </div>

          {/* Currency */}
          <div className="mb-4">
            <label
              htmlFor="checkout-currency"
              className={labelClass}
              style={labelStyle}
            >
              {texts.currency}
            </label>
            <select
              id="checkout-currency"
              value={config.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className={inputBase}
              style={inputStyle}
            >
              <option value="USD">{texts.currencies.USD}</option>
              <option value="COP">{texts.currencies.COP}</option>
            </select>
          </div>

          {/* Language */}
          <div className="mb-4">
            <label
              htmlFor="checkout-lang"
              className={labelClass}
              style={labelStyle}
            >
              {texts.language}
            </label>
            <select
              id="checkout-lang"
              value={config.lang}
              onChange={(e) => handleInputChange('lang', e.target.value)}
              className={inputBase}
              style={inputStyle}
            >
              <option value="es">{texts.languages.es}</option>
              <option value="en">{texts.languages.en}</option>
            </select>
          </div>

          {/* Primary Color */}
          <div className="mb-4">
            <label
              htmlFor="checkout-primaryColor"
              className={labelClass}
              style={labelStyle}
            >
              {texts.primaryColor}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) =>
                  handleInputChange('primaryColor', e.target.value)
                }
                className="w-12 h-10 p-1 rounded-md cursor-pointer dark:border-gray-600"
                style={{ border: '1px solid var(--bloque-border-strong)' }}
                aria-label={texts.primaryColor}
              />
              <input
                id="checkout-primaryColor"
                type="text"
                value={config.primaryColor}
                onChange={(e) =>
                  handleInputChange('primaryColor', e.target.value)
                }
                className={`flex-1 ${inputBase}`}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Border Radius */}
          <div className="mb-4">
            <label
              htmlFor="checkout-borderRadius"
              className={labelClass}
              style={labelStyle}
            >
              {texts.borderRadius}
            </label>
            <input
              id="checkout-borderRadius"
              type="text"
              value={config.borderRadius}
              onChange={(e) =>
                handleInputChange('borderRadius', e.target.value)
              }
              className={inputBase}
              style={inputStyle}
            />
          </div>

          {/* Require Email */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="checkout-requireEmail"
              checked={config.requireEmail}
              onChange={(e) =>
                handleInputChange('requireEmail', e.target.checked)
              }
              className="w-4 h-4 rounded"
              style={{
                accentColor: 'var(--bloque-accent)',
                borderColor: 'var(--bloque-border-strong)',
              }}
            />
            <label
              htmlFor="checkout-requireEmail"
              className={`${labelClass} mb-0 cursor-pointer`}
              style={labelStyle}
            >
              {texts.requireEmail}
            </label>
          </div>

          {/* CTA button */}
          <button
            type="button"
            onClick={updateIframe}
            className="w-full py-3 px-4 mt-2 rounded-md text-base font-semibold text-white transition-colors duration-150"
            style={{ backgroundColor: 'var(--bloque-accent)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                '#6d28d9';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'var(--bloque-accent)';
            }}
          >
            ↺ {texts.updateButton}
          </button>

          {/* Result box */}
          {result.show && (
            <div
              className={`mt-4 p-3 rounded-md border ${
                result.isError
                  ? 'dark:bg-amber-900/10 dark:border-amber-700/40'
                  : 'dark:border-[rgba(167,139,250,0.30)]'
              }`}
              style={
                result.isError
                  ? {
                      backgroundColor: 'rgba(250, 200, 80, 0.10)',
                      borderColor: 'rgba(180, 130, 40, 0.35)',
                    }
                  : {
                      backgroundColor: 'var(--bloque-success-bg)',
                      borderColor: 'var(--bloque-success-border)',
                    }
              }
            >
              <strong
                className={`text-sm ${result.isError ? 'dark:text-amber-300' : 'dark:text-[#a78bfa]'}`}
                style={{
                  color: result.isError ? '#7a5c00' : 'var(--bloque-accent)',
                }}
              >
                {texts.paymentResult}
              </strong>
              <pre
                className="mt-2 text-xs whitespace-pre-wrap m-0 dark:text-gray-400"
                style={{ color: 'var(--bloque-fg-muted)' }}
              >
                {result.content}
              </pre>
            </div>
          )}
        </div>

        {/* ── Preview Panel ──────────────────────────────────────── */}
        <div className={`${panelBase} min-h-[600px]`} style={panelStyle}>
          <h3
            className="text-xl font-semibold mb-4 flex items-center gap-2 dark:text-white"
            style={{ color: 'var(--bloque-fg)', letterSpacing: '-0.018em' }}
          >
            <PanelMark>PAY</PanelMark> {texts.previewTitle}
          </h3>
          {iframeUrl && (
            <iframe
              src={iframeUrl}
              title="Checkout Preview"
              className="w-full h-[550px] border-0 rounded-lg dark:bg-[#252540]"
              style={{ backgroundColor: 'var(--bloque-surface-elevated)' }}
            />
          )}
        </div>
      </div>

      {/* ── Code Snippet Section ──────────────────────────────────── */}
      <div className={`mt-5 ${panelBase}`} style={panelStyle}>
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-xl font-semibold flex items-center gap-2 dark:text-white"
            style={{ color: 'var(--bloque-fg)', letterSpacing: '-0.018em' }}
          >
            <PanelMark>SDK</PanelMark> {texts.codeTitle}
          </h3>

          <button
            type="button"
            onClick={copyToClipboard}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 dark:text-gray-300"
            style={
              copied
                ? {
                    backgroundColor: 'var(--bloque-accent)',
                    color: 'var(--bloque-bg)',
                  }
                : {
                    backgroundColor: 'var(--bloque-surface-elevated)',
                    color: 'var(--bloque-fg-muted)',
                  }
            }
            onMouseEnter={(e) => {
              if (!copied) {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  'var(--bloque-border)';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  'var(--bloque-surface-elevated)';
              }
            }}
          >
            {copied ? (
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {texts.copiedButton}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {texts.copyButton}
              </span>
            )}
          </button>
        </div>

        {/*
          Light mode: #ebe8f1 (--bloque-surface-elevated) — warm elevated surface, not black.
          Dark mode: gray-900 for contrast.
        */}
        <pre
          className="p-4 rounded-lg overflow-x-auto text-sm dark:bg-gray-900 dark:text-gray-100"
          style={{
            backgroundColor: 'var(--bloque-surface-elevated)',
            color: 'var(--bloque-fg)',
          }}
        >
          <code className="whitespace-pre">{generateCodeSnippet(config)}</code>
        </pre>
      </div>
    </div>
  );
});

const PanelMark = ({ children }: { children: string }) => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '34px',
      height: '22px',
      borderRadius: '6px',
      border: '1px solid var(--bloque-accent-border)',
      background: 'var(--bloque-accent-tint)',
      color: 'var(--bloque-accent)',
      fontFamily: 'var(--rp-font-family-mono)',
      fontSize: '9px',
      fontWeight: 600,
      letterSpacing: '0.08em',
      lineHeight: 1,
      flexShrink: 0,
    }}
  >
    {children}
  </span>
);
