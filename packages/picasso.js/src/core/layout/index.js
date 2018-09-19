import registry from '../utils/registry';
import dockLayout from './dock';

const layoutRegistry = registry();
layoutRegistry('dock', dockLayout);

export { layoutRegistry as default };
