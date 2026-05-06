import { useEffect, useMemo, useState } from 'react';

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
      'Open Cursor and add Bloque MCP. You can also copy this setup into ~/.cursor/mcp.json.',
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
    description: 'Add the MCP server into .vscode/mcp.json in your workspace.',
    codeLabel: '.vscode/mcp.json',
    code: `{
  "servers": {
    "bloque": {
      "type": "http",
      "url": "${BLOQUE_URL}"
    }
  }
}`,
  },
  {
    id: 'claude',
    label: 'Claude Code',
    title: 'Install in Claude Code',
    description:
      'Register the server with Claude CLI, then authenticate with Bloque.',
    codeLabel: 'Command Line',
    code: `claude mcp add --transport http bloque ${BLOQUE_URL}\n\nclaude /mcp`,
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    title: 'Install in ChatGPT',
    description:
      'Enable MCP custom connectors in ChatGPT and create one for Bloque.',
    notes: [
      'Available on Pro, Plus, Business, Enterprise, or Education plans.',
      `Server URL: ${BLOQUE_URL}`,
      'Connection mechanism: OAuth',
      'Compatible with OpenAI Responses API agent flows.',
    ],
  },
  {
    id: 'other',
    label: 'Other',
    title: 'Install in Other MCP Clients',
    description:
      'Use OAuth when available. If your client does not support OAuth, use a restricted API key.',
    codeLabel: 'JSON snippet',
    code: `"bloque": {
  "url": "${BLOQUE_URL}",
  "headers": {
    "Authorization": "Bearer BLOQUE_API_KEY"
  }
}`,
    notes: [
      'Recommended: OAuth for production.',
      'If you use bearer tokens, apply least-privilege scope.',
    ],
  },
];

type ThemeMode = 'dark' | 'light';

const paletteByMode: Record<
  ThemeMode,
  {
    pageBg: string;
    surface: string;
    elevated: string;
    border: string;
    borderStrong: string;
    fg: string;
    muted: string;
    subtle: string;
    accent: string;
    accentSoft: string;
    codeBg: string;
  }
> = {
  dark: {
    pageBg: '#0d0c17',
    surface: 'rgba(26, 24, 40, 0.74)',
    elevated: 'rgba(23, 21, 34, 0.88)',
    border: 'rgba(167, 139, 250, 0.22)',
    borderStrong: 'rgba(167, 139, 250, 0.44)',
    fg: '#f8f7ff',
    muted: '#b6b2ca',
    subtle: '#8f8aa9',
    accent: '#a78bfa',
    accentSoft: 'rgba(167, 139, 250, 0.12)',
    codeBg: 'rgba(12, 11, 19, 0.95)',
  },
  light: {
    pageBg: '#faf9fc',
    surface: '#f2f0f7',
    elevated: '#ebe8f1',
    border: 'rgba(13, 12, 23, 0.12)',
    borderStrong: 'rgba(13, 12, 23, 0.2)',
    fg: '#0d0c17',
    muted: '#5a5770',
    subtle: '#8b88a0',
    accent: '#7c3aed',
    accentSoft: 'rgba(167, 139, 250, 0.2)',
    codeBg: '#f6f4fb',
  },
};

export const McpInstallTabs = () => {
  const [active, setActive] = useState<TabId>('cursor');
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setMode(mq.matches ? 'dark' : 'light');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const selected = useMemo(
    () => tabs.find((tab) => tab.id === active) ?? tabs[0],
    [active],
  );

  const palette = paletteByMode[mode];

  return (
    <section
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 16,
        padding: 20,
        margin: '1.5rem 0',
        background: `radial-gradient(120% 180% at 12% 0%, ${palette.accentSoft} 0%, transparent 52%), ${palette.surface}`,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: palette.accent,
          }}
        />
        <span
          style={{
            fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: palette.subtle,
          }}
        >
          Bloque MCP Install
        </span>
      </div>

      <div
        role="tablist"
        aria-label="MCP install tabs"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}
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
                border: `1px solid ${isActive ? palette.borderStrong : palette.border}`,
                background: isActive ? palette.elevated : 'transparent',
                color: isActive ? palette.fg : palette.muted,
                borderRadius: 999,
                padding: '7px 13px',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
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
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
          padding: 18,
          background: palette.pageBg,
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: 10,
            color: palette.fg,
            fontSize: 26,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {selected.title}
        </h3>
        <p style={{ marginTop: 0, color: palette.muted, lineHeight: 1.7 }}>
          {selected.description}
        </p>

        {selected.code ? (
          <>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                margin: '6px 0 8px',
                color: palette.subtle,
                fontSize: 10,
                fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  background: palette.accent,
                }}
              />
              {selected.codeLabel ?? 'Config'}
            </div>
            <div
              style={{
                border: `1px solid ${palette.border}`,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  borderBottom: `1px solid ${palette.border}`,
                  background: palette.elevated,
                  padding: '7px 10px',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 999, background: '#f87171' }} />
                <span style={{ width: 8, height: 8, borderRadius: 999, background: '#fbbf24' }} />
                <span style={{ width: 8, height: 8, borderRadius: 999, background: '#4ade80' }} />
                <span
                  style={{
                    marginLeft: 8,
                    color: palette.subtle,
                    fontSize: 11,
                    fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  }}
                >
                  bloque.mcp
                </span>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: 14,
                  background: palette.codeBg,
                  color: palette.fg,
                  overflowX: 'auto',
                  lineHeight: 1.6,
                }}
              >
                <code>{selected.code}</code>
              </pre>
            </div>
          </>
        ) : null}

        {selected.notes?.length ? (
          <ul style={{ color: palette.muted, lineHeight: 1.7 }}>
            {selected.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
};
