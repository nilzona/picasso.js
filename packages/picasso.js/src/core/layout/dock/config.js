/**
 * Initilize a new dock configuration
 * @private
 * @param {object} [settings] - Settings object
 * @returns {object} A dock configuration instance
 * @example
 * let instance = dockConfig({
 *  dock: 'left',
 *  displayOrder: 2,
 *  prioOrder: 1,
 *  requiredSize: () => 33,
 *  minimumLayoutMode: 'L',
 *  show: true
 * });
 */
function dockConfig(settings = {}) {
  let {
    dock = 'center',
    displayOrder = 0,
    prioOrder = 0,
    minimumLayoutMode
  } = settings;

  return {
    /**
     * Set the dock direction, supported values are left | right | top | bottom. Any other value will be interpreted as center dock.
     * @param {string} [d=''] - Dock direction
     * @returns {this} The current context
     * @example
     * dockConfig.dock('left');
     */
    dock(d) {
      if (typeof d === 'undefined') {
        return dock;
      }
      dock = d;
      return this;
    },

    /**
     * The `displayOrder` property is used by the layout engine to lay out components.
     * Components are interpreted in the ascending order of the `displayOrder` value. The layout engine apply the value in two ways,
     * the first is the order in which components are rendererd. The second is the area components are laid out in
     * when they have a direction, i.e. docked to either top, bottom, left or right.
     *
     * If docked at the same area, the component with a higher `displayOrder` will be rendered
     * on top of the component with a lower `displayOrder`. It can be seen as defining a z-index.
     * A lower `displayOrder` also means that a component will be laid out first in a given direction,
     * i.e. laid out closer to the central area (non-directional area) then a component with a higher `displayOrder`.
     * It can in this case be seen as the x-index or y-index.
     * @param {number} [order=0] - The display order
     * @returns {this} The current context
     * @example
     * dockConfig.displayOrder(99);
     */
    displayOrder(order) {
      if (typeof order === 'undefined') {
        return displayOrder;
      }
      displayOrder = order;
      return this;
    },

    /**
     * The `prioOrder` property is used to define the order in which components are added to the layout engine,
     * this is done before any components are laid out. When there is not enough space to add any more components
     * to a given area, all components not all ready added, are then discarded. The `prioOrder` is interpreted
     * in the ascending order. Such that a lower value is added to the layout engine first.
     * @param {number} [order=0] - The prio order
     * @returns {this} The current context
     * @example
     * dockConfig.prioOrder(-1);
     */
    prioOrder(order) {
      if (typeof order === 'undefined') {
        return prioOrder;
      }
      prioOrder = order;
      return this;
    },

    /**
     * Ger or set the minimumLayoutMode
     * @param {string|object} [s] - The minimum layout mode
     * @returns {string|object|this} If no parameter is passed the current context is returned, else the current layout mode.
     * @example
     * dockConfig.minimumLayoutMode('L');
     * dockConfig.minimumLayoutMode({ width: 'S', height: 'L' });
     */
    minimumLayoutMode(s) {
      if (typeof s === 'undefined') {
        return minimumLayoutMode;
      }
      minimumLayoutMode = s;
      return this;
    }
  };
}

export default dockConfig;
