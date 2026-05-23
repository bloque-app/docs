import { Handle, Position, type NodeProps } from '@xyflow/react';
import { MODULES, type ModuleKind } from '../../../lib/bloque-modules';

export type BloqueModuleNodeData = {
  kind: ModuleKind;
  locale: 'en' | 'es';
};

/**
 * Generic module node used by every kind except `ledger` (which uses its
 * own hub node). Renders the badge, name and short description; exposes
 * one source and one target handle so flows like
 * Identity → Ledger ← Card work out of the box.
 */
export const BloqueModuleNode = ({ data, selected }: NodeProps) => {
  const { kind, locale } = data as BloqueModuleNodeData;
  const def = MODULES[kind];
  if (!def) return null;

  return (
    <div
      className={`bp-flow-node bp-flow-node--${def.role} ${
        selected ? 'is-selected' : ''
      }`}
      style={{
        '--bp-node-accent': def.accentColor,
        '--bp-node-bg': def.backgroundColor,
      } as React.CSSProperties}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="bp-flow-handle"
      />
      <div className="bp-flow-node__badge" aria-hidden="true">
        {def.badge}
      </div>
      <div className="bp-flow-node__body">
        <strong>{def.name[locale]}</strong>
        <small>{def.short[locale]}</small>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="bp-flow-handle"
      />
    </div>
  );
};
