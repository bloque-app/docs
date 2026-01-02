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
      logo: '💳',
      url: '/sdk',
      urlText: 'docs/sdk',
    },
    {
      name: 'Bloque Payment',
      desc: isEn
        ? 'Complete payment gateway to process transactions securely and efficiently'
        : 'Pasarela de pagos completa para procesar transacciones de forma segura y eficiente',
      logo: '💰',
      url: '/payment',
      urlText: 'docs/payment',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[#0b0c0e] dark:text-white">
          Bloque Stack
        </h1>
        <p className="text-lg text-[#8fa1b9] dark:text-[#8fa1b9] max-w-3xl mx-auto">
          {isEn
            ? 'A unified financial infrastructure platform with comprehensive tools for payments, accounts, cards and identity verification'
            : 'Una plataforma unificada de infraestructura financiera con herramientas completas para pagos, cuentas, tarjetas y verificación de identidad'}
        </p>
      </div>

      <div className="flex flex-wrap gap-8 justify-center items-stretch">
        {tools.map(({ name, desc, logo, url, urlText }) => {
          return (
            <a
              key={name}
              href={url}
              className="group relative flex-1 min-w-[280px] max-w-[calc(50%-16px)]
                       sm:max-w-[calc(50%-16px)] lg:max-w-[calc(33.33%-21.33px)]
                       flex flex-col items-start gap-2 p-6
                       rounded-[10px] border transition-all duration-200 ease-out
                       border-[rgba(143,161,185,0.3)] dark:border-[#23272f]
                       bg-gradient-to-br from-white to-[#f9f9f9]/50
                       dark:from-transparent dark:to-white/[0.03]
                       hover:scale-[1.03] cursor-pointer no-underline"
            >
              <div className="text-[52px] leading-[52px] flex-shrink-0">
                {logo}
              </div>

              <h3 className="text-[19px] font-semibold leading-6 mt-1
                           text-[#0b0c0e] dark:text-white">
                {name}
              </h3>

              <p className="text-[14px] leading-6 text-left h-12 m-0
                          text-[#8fa1b9] dark:text-[#8fa1b9]">
                {desc}
              </p>

              <span className="text-[15px] leading-6 block text-left w-full
                             text-[#f93920] dark:text-[#ff704d]">
                {urlText}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
});


