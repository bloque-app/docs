import { useLang } from '@rspress/core/runtime';
import {
  Banner,
  HomeLayout as BasicHomeLayout,
  Layout as BasicLayout,
} from '@rspress/core/theme-original';
import { NavIcon } from '@rstack-dev/doc-ui/nav-icon';
import { CheckoutCustomizer } from './components/checkout-customizer';
import { Tag } from './components/Tag';
import { ToolStack } from './components/tool-stack';

function HomeLayout() {
  return <BasicHomeLayout afterFeatures={<ToolStack />} />;
}

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
