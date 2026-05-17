# Bloque Documentation

Official documentation for Bloque - Financial Infrastructure for Developers.

## Overview

This documentation covers the **Bloque Stack** - a unified financial infrastructure platform with comprehensive tools for payments, accounts, cards, and identity verification.

### Bloque Stack

- **Bloque SDK**: Create organizations, verify identities, issue cards, and manage accounts with a single SDK
- **Bloque Payment**: Complete payment gateway to process transactions securely and efficiently

### Bloque SDK Modules

The SDK provides modules for:

- **Organizations** (`@bloque/sdk-orgs`): Organization management
- **Compliance** (`@bloque/sdk-compliance`): KYC/KYB compliance services
- **Accounts** (`@bloque/sdk-accounts`): Account and virtual card management
- **Identity** (`@bloque/sdk-identity`): User identity and authentication
- **Core** (`@bloque/sdk-core`): Base client and shared utilities

## Languages

The documentation is available in:

- English (`/en`)
- Spanish (`/es`)

## Setup

Install the dependencies:

```bash
bun install
```

## Get started

Start the dev server:

```bash
bun run dev
```

The documentation will be available at `http://localhost:5173`

> **Note:** The SDK reference documentation is automatically downloaded and generated at runtime when you start the dev server. This ensures you always have the latest API documentation.

Build the website for production:

```bash
bun run build
```

Preview the production build locally:

```bash
bun run preview
```

## Documentation Structure

```
docs/
├── en/                     # English documentation
│   ├── index.md           # Bloque Stack home page
│   ├── sdk/               # Bloque SDK documentation
│   │   ├── index.md       # SDK home page
│   │   ├── .generated     # Auto-generated API reference (runtime)
│   │   └── guide/         # SDK guides (manual)
│   │       ├── start/     # Quick start
│   │       ├── features/  # SDK features
│   │       ├── accounts/  # Account management
│   │       └── examples/  # Code examples
│   └── payment/           # Bloque Payment documentation (coming soon)
└── es/                     # Spanish documentation
    ├── index.md           # Página principal de Bloque Stack
    ├── sdk/               # Documentación de Bloque SDK
    │   ├── index.md       # Página principal del SDK
    │   ├── .generated     # Referencia API auto-generada (runtime)
    │   └── guide/         # Guías del SDK (manual)
    │       ├── start/     # Inicio rápido
    │       ├── features/  # Características del SDK
    │       ├── accounts/  # Gestión de cuentas
    │       └── examples/  # Ejemplos de código
    └── payment/           # Documentación de Bloque Payment (próximamente)
```

> **Note:** Files marked with `.generated` are automatically downloaded and generated at runtime from the SDK source code. Do not edit these files manually as they will be overwritten.

## Content

### Bloque Stack Overview
- Introduction to Bloque ecosystem
- Available products and tools
- Integration guides

### Bloque SDK

#### Manual Documentation
- Installation guide
- Quick start examples
- Platform support (Node.js, Bun, Deno, Browser)
- User sessions and authentication
- Code examples and tutorials
- Integration guides

#### Auto-generated API Reference (Runtime)
The complete API reference is automatically generated from TypeScript source code:
- Organizations API (`@bloque/sdk-orgs`)
- Compliance API (`@bloque/sdk-compliance`)
- Accounts API (`@bloque/sdk-accounts`)
- Identity API (`@bloque/sdk-identity`)
- Core utilities (`@bloque/sdk-core`)

This ensures the documentation is always in sync with the latest SDK version.

### Bloque Payment
- Complete payment gateway solution
- Secure transaction processing
- Documentation coming soon

## Links

- Website: [docs.bloque.sh](https://docs.bloque.sh)
