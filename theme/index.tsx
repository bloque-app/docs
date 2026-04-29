import { useLang } from '@rspress/core/runtime';
import { Banner, Layout as BasicLayout } from '@rspress/core/theme-original';
import { NavIcon } from '@rstack-dev/doc-ui/nav-icon';
import { CheckoutCustomizer } from './components/checkout-customizer';
import { HomeLayout } from './components/HomePage';
import { Tag } from './components/Tag';

const Layout = () => {
  const lang = useLang();

  return (
    <BasicLayout
      beforeNavTitle={<NavIcon />}
      beforeNav={
        <Banner
          href="/"
          message={
            lang === 'en'
              ? '🚧 Bloque documentation is under development'
              : '🚧 La documentacion de Bloque está en desarrollo'
          }
        />
      }
    />
  );
};

export * from '@rspress/core/theme-original';
export { CheckoutCustomizer, HomeLayout, Layout, Tag };
export { Callout } from './components/Callout';
export { Checkpoint } from './components/Checkpoint';
export { CodeWindow } from './components/CodeWindow';
export { ConceptCard } from './components/ConceptCard';
export { EyebrowLabel } from './components/EyebrowLabel';
export { FeatureCard } from './components/FeatureCard';
export { ProgressPath } from './components/ProgressPath';
export { QuestHeader } from './components/QuestHeader';
export { SwapFlowDiagram } from './components/SwapFlowDiagram';
export { ToolStack } from './components/tool-stack';
