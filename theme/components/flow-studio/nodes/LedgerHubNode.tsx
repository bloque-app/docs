import { Handle, Position, type NodeProps } from '@xyflow/react';
import { MODULES } from '../../../lib/bloque-modules';
import type { BloqueModuleNodeData } from './BloqueModuleNode';

/**
 * Visually distinct "balance hub" node. Larger, slightly elevated,
 * uses the Bloque violet ambient glow. Exposes handles on all four
 * sides so the surrounding modules can route around it cleanly.
 */
export const LedgerHubNode = ({ data, selected }: NodeProps) => {
  const { locale } = data as BloqueModuleNodeData;
  const def = MODULES.ledger;

  return (
    <div
      className={`bp-flow-node bp-flow-node--ledger ${
        selected ? 'is-selected' : ''
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="bp-flow-handle"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="bp-flow-handle"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
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
        id="right"
        className="bp-flow-handle"
      />
    </div>
  );
};
