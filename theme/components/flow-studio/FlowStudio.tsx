import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from '@xyflow/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MODULES,
  type ModuleKind,
} from '../../lib/bloque-modules';
import {
  canConnect,
  defaultPositionFor,
  generateEdgeId,
  generateNodeId,
  type ProductFlowGraph,
} from '../../lib/flow-graph';
import { ModulePalette } from './ModulePalette';
import { BloqueModuleNode } from './nodes/BloqueModuleNode';
import { LedgerHubNode } from './nodes/LedgerHubNode';

const NODE_TYPES = {
  module: BloqueModuleNode,
  ledger: LedgerHubNode,
};

type FlowStudioProps = {
  locale: 'en' | 'es';
  graph: ProductFlowGraph;
  onChange: (graph: ProductFlowGraph) => void;
  /** Kinds hidden from the palette (e.g. card on a non-card product). */
  irrelevantKinds?: Set<ModuleKind>;
};

type FlowToast = {
  id: number;
  message: string;
} | null;

const TOAST_COPY = {
  en: {
    invalid: 'Connection not supported. Route through the ledger.',
  },
  es: {
    invalid: 'Conexión no soportada. Conecta a través del ledger.',
  },
};

const toReactFlowNodes = (
  graph: ProductFlowGraph,
  locale: 'en' | 'es',
): Node[] =>
  graph.nodes.map((n) => ({
    id: n.id,
    type: n.kind === 'ledger' ? 'ledger' : 'module',
    position: n.position,
    data: { kind: n.kind, locale },
    draggable: true,
    selectable: true,
  }));

const toReactFlowEdges = (graph: ProductFlowGraph): Edge[] =>
  graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'smoothstep',
    animated: e.relation === 'attach' || e.relation === 'cash-in',
    data: { relation: e.relation },
    className: `bp-flow-edge bp-flow-edge--${e.relation}`,
  }));

const Inner = ({ locale, graph, onChange, irrelevantKinds }: FlowStudioProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes] = useState<Node[]>(() =>
    toReactFlowNodes(graph, locale),
  );
  const [edges, setEdges] = useState<Edge[]>(() => toReactFlowEdges(graph));
  const [toast, setToast] = useState<FlowToast>(null);

  // Keep React Flow nodes/edges in sync when the parent graph mutates
  // (e.g. checklist toggled in the other tab, or a starter graph hydrates).
  // We compare structural keys to avoid clobbering ongoing drags.
  const graphSignature = useMemo(() => {
    const nodeKey = graph.nodes
      .map((n) => `${n.id}:${n.kind}`)
      .sort()
      .join('|');
    const edgeKey = graph.edges
      .map((e) => `${e.source}>${e.target}:${e.relation}`)
      .sort()
      .join('|');
    return `${nodeKey}~${edgeKey}`;
  }, [graph]);

  const localSignature = useMemo(() => {
    const nodeKey = nodes
      .map((n) => `${n.id}:${(n.data as { kind: ModuleKind }).kind}`)
      .sort()
      .join('|');
    const edgeKey = edges
      .map((e) => `${e.source}>${e.target}:${(e.data as { relation?: string })?.relation ?? 'attach'}`)
      .sort()
      .join('|');
    return `${nodeKey}~${edgeKey}`;
  }, [nodes, edges]);

  useEffect(() => {
    if (graphSignature !== localSignature) {
      setNodes(toReactFlowNodes(graph, locale));
      setEdges(toReactFlowEdges(graph));
    }
    // localSignature intentionally excluded — we only want to react to
    // parent graph changes, not echo our own updates back.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphSignature, locale]);

  // Push internal state back up to the wizard whenever it diverges
  // from the incoming graph (after user edits in the canvas).
  useEffect(() => {
    if (graphSignature === localSignature) return;
    const next: ProductFlowGraph = {
      nodes: nodes.map((n) => ({
        id: n.id,
        kind: (n.data as { kind: ModuleKind }).kind,
        position: { x: n.position.x, y: n.position.y },
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        relation:
          ((e.data as { relation?: string })?.relation as
            | 'setup'
            | 'attach'
            | 'cash-in'
            | 'cash-out'
            | undefined) ?? 'attach',
      })),
    };
    onChange(next);
    // onChange identity comes from the parent; we only want to fire when
    // the graph signature drifts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSignature]);

  const showInvalid = useCallback(() => {
    setToast({ id: Date.now(), message: TOAST_COPY[locale].invalid });
  }, [locale]);

  useEffect(() => {
    if (!toast) return;
    const handle = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(handle);
  }, [toast]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      if (!connection.source || !connection.target) return false;
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) return false;
      const result = canConnect({
        source: (sourceNode.data as { kind: ModuleKind }).kind,
        target: (targetNode.data as { kind: ModuleKind }).kind,
      });
      return result.ok;
    },
    [nodes],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) return;

      const result = canConnect({
        source: (sourceNode.data as { kind: ModuleKind }).kind,
        target: (targetNode.data as { kind: ModuleKind }).kind,
      });

      if (!result.ok) {
        showInvalid();
        return;
      }

      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            id: generateEdgeId(connection.source!, connection.target!),
            type: 'smoothstep',
            animated: result.relation === 'attach' || result.relation === 'cash-in',
            data: { relation: result.relation },
            className: `bp-flow-edge bp-flow-edge--${result.relation}`,
          },
          eds,
        ),
      );
    },
    [nodes, showInvalid],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData('application/bloque-module') as
        | ModuleKind
        | '';
      if (!kind || !(kind in MODULES)) return;
      if (nodes.some((n) => (n.data as { kind: ModuleKind }).kind === kind)) {
        return;
      }
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const id = generateNodeId(kind);
      setNodes((nds) => [
        ...nds,
        {
          id,
          type: kind === 'ledger' ? 'ledger' : 'module',
          position,
          data: { kind, locale },
          draggable: true,
          selectable: true,
        },
      ]);
    },
    [nodes, screenToFlowPosition, locale],
  );

  const addFromPalette = useCallback(
    (kind: ModuleKind) => {
      if (nodes.some((n) => (n.data as { kind: ModuleKind }).kind === kind)) {
        return;
      }
      const id = generateNodeId(kind);
      const position = defaultPositionFor(kind);
      setNodes((nds) => [
        ...nds,
        {
          id,
          type: kind === 'ledger' ? 'ledger' : 'module',
          position,
          data: { kind, locale },
          draggable: true,
          selectable: true,
        },
      ]);
    },
    [nodes, locale],
  );

  const presentKinds = useMemo(
    () => new Set(nodes.map((n) => (n.data as { kind: ModuleKind }).kind)),
    [nodes],
  );

  return (
    <div className="bp-flow-studio">
      <ModulePalette
        locale={locale}
        presentKinds={presentKinds}
        irrelevantKinds={irrelevantKinds}
        onAdd={addFromPalette}
      />
      <div
        className="bp-flow-canvas"
        ref={wrapperRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.4}
          maxZoom={1.6}
          deleteKeyCode={['Backspace', 'Delete']}
          defaultEdgeOptions={{ type: 'smoothstep' }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="rgba(167, 139, 250, 0.18)"
          />
          <Controls
            className="bp-flow-controls"
            showInteractive={false}
            position="bottom-right"
          />
          <MiniMap
            className="bp-flow-minimap"
            pannable
            zoomable
            nodeColor={(n) => {
              const kind = (n.data as { kind?: ModuleKind })?.kind;
              return (kind && MODULES[kind]?.accentColor) || '#a78bfa';
            }}
            maskColor="rgba(13, 12, 23, 0.6)"
          />
        </ReactFlow>
        {toast ? (
          <div
            className="bp-flow-toast"
            role="status"
            aria-live="polite"
            key={toast.id}
          >
            {toast.message}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const FlowStudio = (props: FlowStudioProps) => (
  <ReactFlowProvider>
    <Inner {...props} />
  </ReactFlowProvider>
);
