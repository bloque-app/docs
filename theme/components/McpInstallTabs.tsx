import { useMemo, useState } from 'react';

type TabId = 'cursor' | 'vscode' | 'claude' | 'chatgpt' | 'other';

interface InstallTab {
  id: TabId;
  label: string;
  title: string;
  description: string;
  codeLabel?: string;
  code?: string;
  notes?: string[];
}

const BLOQUE_URL = 'http://api.bloque.app/mcp';

const tabs: InstallTab[] = [
  {
    id: 'cursor',
    label: 'Cursor',
    title: 'Install in Cursor',
    description:
      'Abre Cursor y agrega el servidor MCP. También puedes copiar esta configuración en ~/.cursor/mcp.json.',
    codeLabel: '~/.cursor/mcp.json',
    code: `{
  "mcpServers": {
    "bloque": {
      "url": "${BLOQUE_URL}"
    }
  }
}`,
  },
  {
    id: 'vscode',
    label: 'VS Code',
    title: 'Install in VS Code',
    description:
      'Agrega el servidor en .vscode/mcp.json dentro de tu workspace.',
    codeLabel: '.vscode/mcp.json',
    code: `{
  "servers": {
    "bloque": {
      "type": "http",
      "url": "${BLOQUE_URL}"
    }
  }
}`,
    notes: [
      'Después de instalarlo, puedes administrar las sesiones MCP desde tu Dashboard settings.',
    ],
  },
  {
    id: 'claude',
    label: 'Claude Code',
    title: 'Install in Claude Code',
    description:
      'Registra el servidor con Claude CLI y luego autentícate en Bloque.',
    codeLabel: 'Command Line',
    code: `claude mcp add --transport http bloque ${BLOQUE_URL}\n\nclaude /mcp`,
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    title: 'Install in ChatGPT',
    description:
      'Habilita conectores MCP en ChatGPT y crea un conector personalizado para Bloque.',
    notes: [
      'Disponible para cuentas Pro, Plus, Business, Enterprise o Education.',
      `Bloque server URL: ${BLOQUE_URL}`,
      'Connection mechanism: OAuth',
      'También funciona con la Responses API para agentes autónomos.',
    ],
  },
  {
    id: 'other',
    label: 'Otro',
    title: 'Install in Other MCP Clients',
    description:
      'Si tu cliente soporta OAuth, usa la URL oficial. Si no soporta OAuth, puedes usar API key restringida.',
    codeLabel: 'Command Line / JSON snippet',
    code: `"bloque": {
  "url": "${BLOQUE_URL}",
  "headers": {
    "Authorization": "Bearer BLOQUE_API_KEY"
  }
}`,
    notes: [
      'Recomendado: OAuth siempre que esté disponible.',
      'Si usas Bearer token, crea y limita la API key para mínimo privilegio.',
    ],
  },
];

export const McpInstallTabs = () => {
  const [active, setActive] = useState<TabId>('cursor');

  const selected = useMemo(
    () => tabs.find((tab) => tab.id === active) ?? tabs[0],
    [active],
  );

  return (
    <section
      style={{
        border: '1px solid var(--rp-c-divider)',
        borderRadius: 14,
        padding: 16,
        margin: '1.25rem 0',
        background: 'var(--rp-c-bg-soft)',
      }}
    >
      <div
        role="tablist"
        aria-label="MCP install tabs"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 14,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === selected.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              style={{
                border: isActive
                  ? '1px solid var(--rp-c-brand)'
                  : '1px solid var(--rp-c-divider)',
                background: isActive ? 'var(--rp-c-bg)' : 'transparent',
                color: 'var(--rp-c-text-1)',
                borderRadius: 999,
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        style={{
          border: '1px solid var(--rp-c-divider)',
          borderRadius: 10,
          padding: 16,
          background: 'var(--rp-c-bg)',
        }}
      >
        <h3 style={{ marginTop: 0 }}>{selected.title}</h3>
        <p style={{ marginTop: 0 }}>{selected.description}</p>

        {selected.code ? (
          <>
            <p style={{ marginBottom: 8, fontWeight: 600 }}>
              {selected.codeLabel ?? 'Config'}
            </p>
            <pre
              style={{
                border: '1px solid var(--rp-c-divider)',
                borderRadius: 8,
                padding: 12,
                background: 'var(--rp-code-block-bg)',
                overflowX: 'auto',
              }}
            >
              <code>{selected.code}</code>
            </pre>
          </>
        ) : null}

        {selected.notes?.length ? (
          <ul>
            {selected.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
};
