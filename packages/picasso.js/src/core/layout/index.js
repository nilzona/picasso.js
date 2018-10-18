import registry from '../utils/registry';
import dockLayout from './dock';
import gridLayout from './grid';
import componentRegistry from '../component';

const layoutComponent = {};
componentRegistry('layout', layoutComponent);
const layoutRegistry = registry();
layoutRegistry('dock', dockLayout);
layoutRegistry('grid', gridLayout);

export default layoutRegistry;
