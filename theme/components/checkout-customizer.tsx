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

export const CheckoutCustomizer: React.FC = memo(() => {
  const currentLang = useLang();
  const isEn = currentLang === 'en';

  const [config, setConfig] = useState<CheckoutConfig>({
    amount: 50,
    currency: 'USD',
    lang: currentLang === 'en' ? 'en' : 'es',
    primaryColor: '#4f46e5',
    borderRadius: '8px',
    requireEmail: true,
  });

  const [iframeUrl, setIframeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    show: boolean;
    isError: boolean;
    content: string;
  }>({
    show: false,
    isError: false,
    content: '',
  });

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
    const url = buildUrl(config);
    setIframeUrl(url);
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
    const code = generateCodeSnippet(config);
    try {
      await navigator.clipboard.writeText(code);
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
        {/* Config Panel */}
        <div className="bg-white dark:bg-[#1a1a2e] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-5 text-gray-800 dark:text-white flex items-center gap-2">
            <span>&#128736;</span> {texts.title}
          </h3>

          <div className="mb-4">
            <label
              htmlFor="checkout-amount"
              className="block mb-1.5 font-medium text-gray-600 dark:text-gray-300 text-sm"
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
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-[#252540] text-gray-800 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="checkout-currency"
              className="block mb-1.5 font-medium text-gray-600 dark:text-gray-300 text-sm"
            >
              {texts.currency}
            </label>
            <select
              id="checkout-currency"
              value={config.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-[#252540] text-gray-800 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="USD">{texts.currencies.USD}</option>
              <option value="COP">{texts.currencies.COP}</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="checkout-lang"
              className="block mb-1.5 font-medium text-gray-600 dark:text-gray-300 text-sm"
            >
              {texts.language}
            </label>
            <select
              id="checkout-lang"
              value={config.lang}
              onChange={(e) => handleInputChange('lang', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-[#252540] text-gray-800 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="es">{texts.languages.es}</option>
              <option value="en">{texts.languages.en}</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="checkout-primaryColor"
              className="block mb-1.5 font-medium text-gray-600 dark:text-gray-300 text-sm"
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
                className="w-12 h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                aria-label={texts.primaryColor}
              />
              <input
                id="checkout-primaryColor"
                type="text"
                value={config.primaryColor}
                onChange={(e) =>
                  handleInputChange('primaryColor', e.target.value)
                }
                className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-[#252540] text-gray-800 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="checkout-borderRadius"
              className="block mb-1.5 font-medium text-gray-600 dark:text-gray-300 text-sm"
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
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-[#252540] text-gray-800 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="checkout-requireEmail"
              checked={config.requireEmail}
              onChange={(e) =>
                handleInputChange('requireEmail', e.target.checked)
              }
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="checkout-requireEmail"
              className="font-medium text-gray-600 dark:text-gray-300 text-sm cursor-pointer"
            >
              {texts.requireEmail}
            </label>
          </div>

          <button
            type="button"
            onClick={updateIframe}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md text-base transition-colors mt-2"
          >
            &#128260; {texts.updateButton}
          </button>

          {result.show && (
            <div
              className={`mt-4 p-3 rounded-md border ${
                result.isError
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}
            >
              <strong className="text-sm text-gray-700 dark:text-gray-300">
                {texts.paymentResult}
              </strong>
              <pre className="mt-2 text-xs whitespace-pre-wrap m-0 text-gray-600 dark:text-gray-400">
                {result.content}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#1a1a2e] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 min-h-[600px]">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <span>&#128179;</span> {texts.previewTitle}
          </h3>
          {iframeUrl && (
            <iframe
              src={iframeUrl}
              title="Checkout Preview"
              className="w-full h-[550px] border-0 rounded-lg bg-gray-50 dark:bg-[#252540]"
            />
          )}
        </div>
      </div>

      {/* Code Snippet Section */}
      <div className="mt-5 bg-white dark:bg-[#1a1a2e] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <span>&#128187;</span> {texts.codeTitle}
          </h3>
          <button
            type="button"
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
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
        <pre className="p-4 bg-gray-900 rounded-lg overflow-x-auto text-sm">
          <code className="text-gray-100 whitespace-pre">
            {generateCodeSnippet(config)}
          </code>
        </pre>
      </div>
    </div>
  );
});
