import registry from '../utils/registry';
import dockLayout from './dock';
import gridLayout from './grid';

const layoutRegistry = registry();
layoutRegistry('dock', dockLayout);
layoutRegistry('grid', gridLayout);

export default layoutRegistry;
