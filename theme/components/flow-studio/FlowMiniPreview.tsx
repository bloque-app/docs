import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
} from '@xyflow/react';
import { useMemo } from 'react';
import { MODULES, type ModuleKind } from '../../lib/bloque-modules';
import type { ProductFlowGraph } from '../../lib/flow-graph';
import { BloqueModuleNode } from './nodes/BloqueModuleNode';
import { LedgerHubNode } from './nodes/LedgerHubNode';

const NODE_TYPES = {
  module: BloqueModuleNode,
  ledger: LedgerHubNode,
};

type FlowMiniPreviewProps = {
  locale: 'en' | 'es';
  graph: ProductFlowGraph;
};

/**
 * Static (non-interactive) miniature of the graph. Used on step 4 to
 * keep the diagram visually linked to the generated SDK code.
 */
const Inner = ({ locale, graph }: FlowMiniPreviewProps) => {
  const nodes: Node[] = useMemo(
    () =>
      graph.nodes.map((n) => ({
        id: n.id,
        type: n.kind === 'ledger' ? 'ledger' : 'module',
        position: n.position,
        data: { kind: n.kind, locale },
        draggable: false,
        selectable: false,
        connectable: false,
      })),
    [graph, locale],
  );

  const edges: Edge[] = useMemo(
    () =>
      graph.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: e.relation === 'attach' || e.relation === 'cash-in',
        data: { relation: e.relation },
        className: `bp-flow-edge bp-flow-edge--${e.relation}`,
      })),
    [graph],
  );

  return (
    <div className="bp-flow-mini">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnDrag={false}
        panOnScroll={false}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1}
          color="rgba(167, 139, 250, 0.18)"
        />
      </ReactFlow>
    </div>
  );
};

export const FlowMiniPreview = (props: FlowMiniPreviewProps) => {
  if (props.graph.nodes.length === 0) return null;
  return (
    <ReactFlowProvider>
      <Inner {...props} />
    </ReactFlowProvider>
  );
};

// Re-export MODULES so future consumers can reference accent colors here.
export { MODULES };
export type { ModuleKind };
