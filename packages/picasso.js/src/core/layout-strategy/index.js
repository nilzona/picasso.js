import registry from '../utils/registry';
import dockStrategy from './dock';
import gridStrategy from './grid';

const reg = registry();

reg('dock', dockStrategy);
reg('grid', gridStrategy);

export default reg;
