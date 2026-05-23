import {
  MODULES,
  PALETTE_CATEGORIES,
  type ModuleKind,
} from '../../lib/bloque-modules';

type ModulePaletteProps = {
  locale: 'en' | 'es';
  /** Kinds currently present on the canvas — disabled in the palette. */
  presentKinds: Set<ModuleKind>;
  /** Optional kinds the active product doesn't relevantly support. */
  irrelevantKinds?: Set<ModuleKind>;
  onAdd: (kind: ModuleKind) => void;
};

const PALETTE_COPY = {
  en: { title: 'Modules', hint: 'Click or drag onto the canvas' },
  es: { title: 'Módulos', hint: 'Click o arrastra al lienzo' },
};

/**
 * Draggable module palette. Each item is both a button (click-to-add)
 * and a native draggable element (HTML5 DnD) — the canvas listens for
 * the `application/bloque-module` mime type on drop.
 */
export const ModulePalette = ({
  locale,
  presentKinds,
  irrelevantKinds,
  onAdd,
}: ModulePaletteProps) => {
  const copy = PALETTE_COPY[locale];

  const onDragStart = (event: React.DragEvent, kind: ModuleKind) => {
    event.dataTransfer.setData('application/bloque-module', kind);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="bp-flow-palette" aria-label={copy.title}>
      <header className="bp-flow-palette__header">
        <strong>{copy.title}</strong>
        <span>{copy.hint}</span>
      </header>
      <div className="bp-flow-palette__categories">
        {PALETTE_CATEGORIES.map((category) => {
          const kinds = category.kinds.filter(
            (k) => !(irrelevantKinds && irrelevantKinds.has(k)),
          );
          if (kinds.length === 0) return null;
          return (
            <div className="bp-flow-palette__category" key={category.id}>
              <div className="bp-flow-palette__category-header">
                {category.flag ? (
                  <span aria-hidden="true">{category.flag}</span>
                ) : null}
                <span>{category.label[locale]}</span>
              </div>
              <div className="bp-flow-palette__items">
                {kinds.map((kind) => {
                  const def = MODULES[kind];
                  const isPresent = presentKinds.has(kind);
                  return (
                    <button
                      className={`bp-flow-palette__item ${
                        isPresent ? 'is-present' : ''
                      }`}
                      key={kind}
                      type="button"
                      draggable={!isPresent}
                      onDragStart={(event) => onDragStart(event, kind)}
                      onClick={() => {
                        if (!isPresent) onAdd(kind);
                      }}
                      disabled={isPresent}
                      style={{
                        '--bp-node-accent': def.accentColor,
                      } as React.CSSProperties}
                    >
                      <span className="bp-flow-palette__badge">
                        {def.badge}
                      </span>
                      <span className="bp-flow-palette__copy">
                        <strong>{def.name[locale]}</strong>
                        <small>{def.short[locale]}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
