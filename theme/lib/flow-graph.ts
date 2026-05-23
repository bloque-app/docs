import {
  MODULES,
  PLUGIN_KINDS,
  type ModuleKind,
  kindToPluginId,
  pluginIdToKind,
} from './bloque-modules';

export type EdgeRelation = 'setup' | 'attach' | 'cash-in' | 'cash-out';

export type FlowNode = {
  id: string;
  kind: ModuleKind;
  position: { x: number; y: number };
};

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
  relation: EdgeRelation;
};

export type ProductFlowGraph = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};

export const EMPTY_GRAPH: ProductFlowGraph = { nodes: [], edges: [] };

/**
 * Generate a short id usable by React Flow.
 * Not collision-safe across processes; only used in-memory in the wizard.
 */
export const generateNodeId = (kind: ModuleKind): string =>
  `${kind}-${Math.random().toString(36).slice(2, 9)}`;

export const generateEdgeId = (source: string, target: string): string =>
  `${source}__${target}`;

export type ConnectionAttempt = {
  source: ModuleKind;
  target: ModuleKind;
};

export type ConnectionResult =
  | { ok: true; relation: EdgeRelation }
  | { ok: false; reason: string };

/**
 * Modules that "attach" to the Ledger — the financial primitives that share
 * the same balance. Direction is always module → ledger.
 */
export const ATTACH_KINDS: readonly ModuleKind[] = [
  'card',
  'breb',
  'polygon',
  'us-account',
  'pix-account',
  'mexico-account',
  'europe-account',
] as const;

const isAttach = (k: ModuleKind): boolean =>
  (ATTACH_KINDS as readonly ModuleKind[]).includes(k);

/**
 * Validate whether a connection between two module kinds is allowed.
 *
 * Allowed edges (and only these):
 *   identity → ledger      (setup)
 *   <attach> → ledger      (attach) — card, bre-b, pix, mexico (SPEI),
 *                                     us-account, polygon, europe
 *   swap     → ledger      (cash-in)
 *   ledger   → swap        (cash-out)
 *
 * Everything else is rejected with a specific, user-facing reason.
 */
export const canConnect = (a: ConnectionAttempt): ConnectionResult => {
  const { source, target } = a;
  if (source === target) {
    return { ok: false, reason: 'A module cannot connect to itself.' };
  }

  const sourceDef = MODULES[source];
  const targetDef = MODULES[target];
  if (!sourceDef || !targetDef) {
    return { ok: false, reason: 'Unknown module.' };
  }

  if (source === 'identity') {
    if (target === 'ledger') return { ok: true, relation: 'setup' };
    return {
      ok: false,
      reason: 'Identity only connects to the Ledger.',
    };
  }

  if (isAttach(source)) {
    if (target === 'ledger') return { ok: true, relation: 'attach' };
    return {
      ok: false,
      reason: `${sourceDef.name.en} attaches to the Ledger, not directly to other modules.`,
    };
  }

  if (source === 'swap') {
    if (target === 'ledger') return { ok: true, relation: 'cash-in' };
    return {
      ok: false,
      reason: 'Swap only connects to the Ledger.',
    };
  }

  if (source === 'ledger') {
    if (target === 'swap') return { ok: true, relation: 'cash-out' };
    if (isAttach(target)) {
      return {
        ok: false,
        reason: 'Reverse the direction — modules attach into the Ledger.',
      };
    }
    return {
      ok: false,
      reason: 'The Ledger cannot feed Identity. Connect Identity to the Ledger instead.',
    };
  }

  return {
    ok: false,
    reason: 'Connection not supported. Route through the Ledger.',
  };
};

const hasKind = (graph: ProductFlowGraph, kind: ModuleKind): boolean =>
  graph.nodes.some((n) => n.kind === kind);

export const findNodeIdByKind = (
  graph: ProductFlowGraph,
  kind: ModuleKind,
): string | null => graph.nodes.find((n) => n.kind === kind)?.id ?? null;

/**
 * Derive the legacy plugin ID list from a graph. Only modules that have a
 * pluginId AND are connected to the ledger via an `attach` edge count.
 */
export const graphToPluginIds = (graph: ProductFlowGraph): string[] => {
  const ledgerId = findNodeIdByKind(graph, 'ledger');
  if (!ledgerId) return [];

  const attachedNodeIds = new Set(
    graph.edges
      .filter((e) => e.relation === 'attach' && e.target === ledgerId)
      .map((e) => e.source),
  );

  const out: string[] = [];
  for (const node of graph.nodes) {
    if (!attachedNodeIds.has(node.id)) continue;
    const pluginId = kindToPluginId(node.kind);
    if (pluginId) out.push(pluginId);
  }
  return out;
};

/**
 * Topological-ish ordering for code generation:
 * identity → ledger → swap → attached modules.
 */
export const graphToSetupOrder = (graph: ProductFlowGraph): ModuleKind[] => {
  const order: ModuleKind[] = [];
  const seen = new Set<ModuleKind>();
  const push = (kind: ModuleKind) => {
    if (!seen.has(kind) && hasKind(graph, kind)) {
      seen.add(kind);
      order.push(kind);
    }
  };

  push('identity');
  push('ledger');
  push('swap');
  for (const kind of PLUGIN_KINDS) push(kind);
  return order;
};

export type GraphValidation = {
  hasLedger: boolean;
  hasAttachment: boolean;
  isReady: boolean;
};

export const validateGraph = (graph: ProductFlowGraph): GraphValidation => {
  const hasLedger = hasKind(graph, 'ledger');
  const hasAttachment = graphToPluginIds(graph).length > 0;
  return {
    hasLedger,
    hasAttachment,
    isReady: hasLedger && hasAttachment,
  };
};

/**
 * Layout grid for default node positions. Ledger sits centered; identity to
 * its left; attachments fan out around the ledger.
 */
const ATTACH_POSITIONS = [
  { x: 540, y: 80 },
  { x: 540, y: 320 },
  { x: 540, y: 200 },
  { x: 80, y: 320 },
  { x: 80, y: 80 },
  { x: 300, y: 380 },
  { x: 300, y: 20 },
];

const CORE_POSITIONS: Record<ModuleKind, { x: number; y: number }> = {
  identity: { x: 80, y: 200 },
  ledger: { x: 300, y: 200 },
  swap: { x: 300, y: 380 },
  card: { x: 540, y: 200 },
  breb: { x: 540, y: 80 },
  polygon: { x: 540, y: 320 },
  'us-account': { x: 540, y: 80 },
  'pix-account': { x: 540, y: 80 },
  'mexico-account': { x: 540, y: 320 },
  'europe-account': { x: 540, y: 320 },
};

export const defaultPositionFor = (kind: ModuleKind): { x: number; y: number } =>
  CORE_POSITIONS[kind] ?? { x: 300, y: 200 };

/**
 * Build a starter graph from a product template's defaultMediums.
 * Always seeds Identity + Ledger plus one attach node per medium.
 */
export const buildStarterGraph = (
  defaultMediums: string[],
): ProductFlowGraph => {
  const identity: FlowNode = {
    id: 'identity-1',
    kind: 'identity',
    position: CORE_POSITIONS.identity,
  };
  const ledger: FlowNode = {
    id: 'ledger-1',
    kind: 'ledger',
    position: CORE_POSITIONS.ledger,
  };

  const nodes: FlowNode[] = [identity, ledger];
  const edges: FlowEdge[] = [
    {
      id: generateEdgeId(identity.id, ledger.id),
      source: identity.id,
      target: ledger.id,
      relation: 'setup',
    },
  ];

  const usedAttachSlots: { x: number; y: number }[] = [];

  for (const pluginId of defaultMediums) {
    const kind = pluginIdToKind(pluginId);
    if (!kind) continue;
    const def = MODULES[kind];
    if (def.role !== 'attach') continue;

    const slot = ATTACH_POSITIONS[usedAttachSlots.length] ?? {
      x: 540,
      y: 200 + usedAttachSlots.length * 120,
    };
    usedAttachSlots.push(slot);

    const node: FlowNode = {
      id: `${kind}-1`,
      kind,
      position: slot,
    };
    nodes.push(node);
    edges.push({
      id: generateEdgeId(node.id, ledger.id),
      source: node.id,
      target: ledger.id,
      relation: 'attach',
    });
  }

  return { nodes, edges };
};

/**
 * Reconcile a graph with a target list of plugin IDs (from the checklist).
 * - Adds attach nodes (+ edges to ledger) for plugin IDs missing in the graph.
 * - Removes attach nodes (+ their edges) for plugin IDs no longer selected.
 * - Auto-inserts a ledger if the user enables a plugin without one.
 * - Preserves identity / swap / position of existing nodes.
 */
export const syncGraphWithPlugins = (
  graph: ProductFlowGraph,
  targetPluginIds: string[],
): ProductFlowGraph => {
  let nodes = [...graph.nodes];
  let edges = [...graph.edges];

  let ledgerId = findNodeIdByKind({ nodes, edges }, 'ledger');
  if (!ledgerId && targetPluginIds.length > 0) {
    const ledger: FlowNode = {
      id: 'ledger-1',
      kind: 'ledger',
      position: CORE_POSITIONS.ledger,
    };
    nodes = [...nodes, ledger];
    ledgerId = ledger.id;
  }

  const currentPluginNodeByKind = new Map<ModuleKind, FlowNode>();
  for (const node of nodes) {
    if (MODULES[node.kind]?.role === 'attach') {
      currentPluginNodeByKind.set(node.kind, node);
    }
  }

  const targetKinds = new Set<ModuleKind>();
  for (const pluginId of targetPluginIds) {
    const kind = pluginIdToKind(pluginId);
    if (kind) targetKinds.add(kind);
  }

  // Remove attach nodes that are no longer selected.
  const removedNodeIds = new Set<string>();
  nodes = nodes.filter((node) => {
    if (MODULES[node.kind]?.role !== 'attach') return true;
    if (targetKinds.has(node.kind)) return true;
    removedNodeIds.add(node.id);
    return false;
  });
  edges = edges.filter(
    (e) => !removedNodeIds.has(e.source) && !removedNodeIds.has(e.target),
  );

  // Add attach nodes that are newly selected.
  let slotIdx = nodes.filter((n) => MODULES[n.kind]?.role === 'attach').length;
  for (const kind of targetKinds) {
    if (currentPluginNodeByKind.has(kind)) continue;
    const slot =
      ATTACH_POSITIONS[slotIdx] ??
      { x: 540, y: 200 + slotIdx * 120 };
    slotIdx += 1;
    const node: FlowNode = {
      id: `${kind}-${Math.random().toString(36).slice(2, 7)}`,
      kind,
      position: slot,
    };
    nodes.push(node);
    if (ledgerId) {
      edges.push({
        id: generateEdgeId(node.id, ledgerId),
        source: node.id,
        target: ledgerId,
        relation: 'attach',
      });
    }
  }

  return { nodes, edges };
};

/**
 * Compact serialization: comma-separated `kind:x:y` for nodes,
 * pipe-separated `source>target` for edges.
 *
 * Example: `i:n=identity:80:200,ledger:300:200|e=identity-1>ledger-1`
 *
 * We keep this human-readable rather than base64-JSON for URL legibility,
 * but the wizard already URL-encodes via URLSearchParams so reserved chars
 * are safe.
 */
export const serializeGraph = (graph: ProductFlowGraph): string => {
  const nodes = graph.nodes
    .map((n) => `${n.kind}~${n.id}~${Math.round(n.position.x)}~${Math.round(n.position.y)}`)
    .join(',');
  const edges = graph.edges
    .map((e) => `${e.source}~${e.target}~${e.relation}`)
    .join(',');
  return `${nodes}|${edges}`;
};

export const deserializeGraph = (raw: string): ProductFlowGraph | null => {
  if (!raw) return null;
  const [nodesRaw, edgesRaw] = raw.split('|');
  if (!nodesRaw) return null;
  const nodes: FlowNode[] = [];
  for (const chunk of nodesRaw.split(',')) {
    if (!chunk) continue;
    const [kind, id, x, y] = chunk.split('~');
    if (!kind || !id) continue;
    if (!(kind in MODULES)) continue;
    nodes.push({
      id,
      kind: kind as ModuleKind,
      position: {
        x: Number(x) || 0,
        y: Number(y) || 0,
      },
    });
  }
  const edges: FlowEdge[] = [];
  if (edgesRaw) {
    for (const chunk of edgesRaw.split(',')) {
      if (!chunk) continue;
      const [source, target, relation] = chunk.split('~');
      if (!source || !target) continue;
      edges.push({
        id: generateEdgeId(source, target),
        source,
        target,
        relation: (relation as EdgeRelation) || 'attach',
      });
    }
  }
  return { nodes, edges };
};
