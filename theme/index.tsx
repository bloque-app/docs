import {
  HomeLayout as BasicHomeLayout
} from '@rspress/core/theme-original';
import { Tag } from './components/Tag';
import { ToolStack } from './components/tool-stack';

function HomeLayout() {
  return (
    <BasicHomeLayout
      afterFeatures={<ToolStack />}
    />
  );
}

export * from '@rspress/core/theme-original';
export { HomeLayout, Tag };

