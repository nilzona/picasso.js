import extend from 'extend';
import dockConfig from './config';
import resolveSettings from './settings-resolver';
import { rectToPoints, pointsToRect } from '../../geometry/util';

function cacheSize(c, reducedRect, containerRect) {
  if (typeof c.cachedSize === 'undefined') {
    const size = c.comp.getPreferredSize(reducedRect, containerRect);
    const dock = c.config.dock();
    let relevantSize;
    if (dock === 'top' || dock === 'bottom') {
      relevantSize = size.height;
    } else if (dock === 'right' || dock === 'left') {
      relevantSize = size.width;
    } else {
      relevantSize = Math.max(size.width, size.height);
    }
    c.cachedSize = Math.ceil(relevantSize);
    if (size.edgeBleed) {
      c.edgeBleed = size.edgeBleed;
    }
  }
  return c.cachedSize;
}

function validateReduceRect(rect, reducedRect, settings) {
  // Absolute value for width/height should have predence over relative value
  const minReduceWidth = Math.min(settings.center.minWidth, rect.width)
    || Math.max(rect.width * settings.center.minWidthRatio, 1);
  const minReduceHeight = Math.min(settings.center.minHeight, rect.height)
    || Math.max(rect.height * settings.center.minHeightRatio, 1);
  return (
    reducedRect.width >= minReduceWidth && reducedRect.height >= minReduceHeight
  );
}

function reduceDocRect(reducedRect, c) {
  switch (c.config.dock()) {
    case 'top':
      reducedRect.y += c.cachedSize;
      reducedRect.height -= c.cachedSize;
      break;
    case 'bottom':
      reducedRect.height -= c.cachedSize;
      break;
    case 'left':
      reducedRect.x += c.cachedSize;
      reducedRect.width -= c.cachedSize;
      break;
    case 'right':
      reducedRect.width -= c.cachedSize;
      break;
    default:
  }
}
// function addEdgeBleed(currentEdgeBleed, c) {
//   const edgeBleed = c.edgeBleed;
//   if (!edgeBleed) {
//     return;
//   }
//   currentEdgeBleed.left = Math.max(currentEdgeBleed.left, edgeBleed.left || 0);
//   currentEdgeBleed.right = Math.max(
//     currentEdgeBleed.right,
//     edgeBleed.right || 0
//   );
//   currentEdgeBleed.top = Math.max(currentEdgeBleed.top, edgeBleed.top || 0);
//   currentEdgeBleed.bottom = Math.max(
//     currentEdgeBleed.bottom,
//     edgeBleed.bottom || 0
//   );
// }
// function reduceEdgeBleed(logicalContainerRect, reducedRect, edgeBleed) {
//   if (reducedRect.x < edgeBleed.left) {
//     reducedRect.width -= edgeBleed.left - reducedRect.x;
//     reducedRect.x = edgeBleed.left;
//   }
//   const reducedRectRightBoundary = logicalContainerRect.width - (reducedRect.x + reducedRect.width);
//   if (reducedRectRightBoundary < edgeBleed.right) {
//     reducedRect.width -= edgeBleed.right - reducedRectRightBoundary;
//   }
//   if (reducedRect.y < edgeBleed.top) {
//     reducedRect.height -= edgeBleed.top - reducedRect.y;
//     reducedRect.y = edgeBleed.top;
//   }
//   const reducedRectBottomBoundary = logicalContainerRect.height - (reducedRect.y + reducedRect.height);
//   if (reducedRectBottomBoundary < edgeBleed.bottom) {
//     reducedRect.height -= edgeBleed.bottom - reducedRectBottomBoundary;
//   }
// }

function reduceSingleLayoutRect(rect, reducedRect, edgeBleed, c, settings) {
  const newReduceRect = extend({}, reducedRect);
  // const newEdgeBeed = extend({}, edgeBleed);
  reduceDocRect(newReduceRect, c);
  // addEdgeBleed(newEdgeBeed, c);
  // reduceEdgeBleed(rect, newReduceRect, newEdgeBeed);

  const isValid = validateReduceRect(rect, newReduceRect, settings);
  if (!isValid) {
    return false;
  }

  reduceDocRect(reducedRect, c);
  // addEdgeBleed(edgeBleed, c);
  return true;
}

function reduceLayoutRect({
  rect, visible, hidden, settings
}) {
  const reducedRect = {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height
  };
  const edgeBleed = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  };

  const sortedComponents = visible.slice();
  sortedComponents.sort((a, b) => a.config.prioOrder() - b.config.prioOrder()); // lower prioOrder will have higher prio

  for (let i = 0; i < sortedComponents.length; ++i) {
    const c = sortedComponents[i];
    cacheSize(c, reducedRect, rect);

    if (!reduceSingleLayoutRect(rect, reducedRect, edgeBleed, c, settings)) {
      sortedComponents.splice(i, 1);
      hidden.push(c.comp);
      --i;
    }
  }

  const filteredUnsortedComps = visible.filter(
    c => sortedComponents.indexOf(c) !== -1
  );
  visible.length = 0;
  visible.push(...filteredUnsortedComps);
  // reduceEdgeBleed(rect, reducedRect, edgeBleed);
  return reducedRect;
}

function boundingBox(rects) {
  const points = [].concat(...rects.map(rectToPoints));
  return pointsToRect(points);
}

function positionComponents({ visible, rect, reducedRect }) {
  const vRect = {
    x: reducedRect.x,
    y: reducedRect.y,
    width: reducedRect.width,
    height: reducedRect.height
  };
  const hRect = {
    x: reducedRect.x,
    y: reducedRect.y,
    width: reducedRect.width,
    height: reducedRect.height
  };

  const referencedComponents = {};

  visible
    .sort((a, b) => {
      if (/^@/.test(b.config.dock())) {
        return -1;
      }
      if (/^@/.test(a.config.dock())) {
        return 1;
      }
      return a.config.displayOrder() - b.config.displayOrder();
    })
    .forEach((c) => {
      let outerRect = {};
      let r = {};
      const d = c.config.dock();
      switch (d) {
        case 'top':
          outerRect.height = r.height = c.cachedSize;
          outerRect.width = rect.width;
          r.width = vRect.width;
          outerRect.x = rect.x;
          r.x = vRect.x;
          outerRect.y = r.y = vRect.y - c.cachedSize;

          vRect.y -= c.cachedSize;
          vRect.height += c.cachedSize;
          break;
        case 'bottom':
          outerRect.x = rect.x;
          r.x = vRect.x;
          outerRect.y = r.y = vRect.y + vRect.height;
          outerRect.width = rect.width;
          r.width = vRect.width;
          outerRect.height = r.height = c.cachedSize;

          vRect.height += c.cachedSize;
          break;
        case 'left':
          outerRect.x = r.x = hRect.x - c.cachedSize;
          outerRect.y = rect.y;
          r.y = hRect.y;
          outerRect.width = r.width = c.cachedSize;
          outerRect.height = rect.height;
          r.height = hRect.height;

          hRect.x -= c.cachedSize;
          hRect.width += c.cachedSize;
          break;
        case 'right':
          outerRect.x = r.x = hRect.x + hRect.width;
          outerRect.y = rect.y;
          r.y = hRect.y;
          outerRect.width = r.width = c.cachedSize;
          outerRect.height = rect.height;
          r.height = hRect.height;

          hRect.width += c.cachedSize;
          break;
        default:
          outerRect.x = r.x = reducedRect.x;
          outerRect.y = r.y = reducedRect.y;
          outerRect.width = r.width = reducedRect.width;
          outerRect.height = r.height = reducedRect.height;
      }
      if (/^@/.test(d)) {
        const refs = d
          .split(',')
          .map(ref => referencedComponents[ref.replace('@', '')])
          .filter(ref => !!ref);
        if (refs.length > 0) {
          outerRect = boundingBox(refs.map(ref => ref.outerRect));
          r = boundingBox(refs.map(ref => ref.rect));
        }
      } else if (c.key) {
        referencedComponents[c.key] = {
          // store the size of this component
          r,
          outerRect
        };
      }
      c.comp.rect = r;
      c.cachedSize = undefined;
    });
}

function checkShowSettings(
  strategySettings,
  layoutSettings,
  logicalContainerRect
) {
  const layoutModes = strategySettings.layoutModes || {};
  const minimumLayoutMode = layoutSettings.minimumLayoutMode();
  let show = true;
  if (show && typeof minimumLayoutMode === 'object') {
    show = layoutModes[minimumLayoutMode.width]
      && layoutModes[minimumLayoutMode.height]
      && logicalContainerRect.width
        >= layoutModes[minimumLayoutMode.width].width
      && logicalContainerRect.height
        >= layoutModes[minimumLayoutMode.height].height;
  } else if (show && minimumLayoutMode !== undefined) {
    show = layoutModes[minimumLayoutMode]
      && logicalContainerRect.width >= layoutModes[minimumLayoutMode].width
      && logicalContainerRect.height >= layoutModes[minimumLayoutMode].height;
  }
  return show;
}

/**
 * @typedef {object} dock-layout-settings
 * @property {object} [size] - Physical size. Defaults to the container element.
 * @property {number} [size.width] - Width in pixels
 * @property {number} [size.height]- Height in pixels
 * @property {object} [logicalSize] - Logical size
 * @property {number} [logicalSize.width] - Width in pixels
 * @property {number} [logicalSize.height] - Height in pixels
 * @property {boolean} [logicalSize.preserveAspectRatio=false] - If true, takes the smallest ratio of width/height between logical and physical size ( physical / logical )
 * @property {number} [logicalSize.align=0.5] - Normalized value between 0-1. Defines how the space around the scaled axis is spread in the container, with 0.5 meaning the spread is equal on both sides. Only applicable if preserveAspectRatio is set to true
 * @property {object} [center] - Define how much space the center dock area requires
 * @property {number} [center.minWidthRatio=0.5] - Value between 0 and 1
 * @property {number} [center.minHeightRatio=0.5] - Value between 0 and 1
 * @property {number} [center.minWidth] - Width in pixels
 * @property {number} [center.minHeight] - Height in pixels
 * @property {object<string, {width: number, height: number}>} [layoutModes] Dictionary with named sizes
 */
function create(initialSettings) {
  let settings = resolveSettings(initialSettings);

  const docker = {};

  docker.layout = function layout(rect, components) {
    const visible = [];
    const hidden = [];

    // check show settings
    for (let i = 0; i < components.length; ++i) {
      const comp = components[i];
      const config = dockConfig(comp.userSettings.layout);
      if (checkShowSettings(settings, config, rect)) {
        visible.push({ comp, config });
      } else {
        hidden.push({ comp, config });
      }
    }
    const reducedRect = reduceLayoutRect({
      rect,
      visible,
      hidden,
      settings
    });
    positionComponents({
      visible,
      rect,
      reducedRect
    });
    hidden.forEach((c) => {
      c.visible = false;
    });
    return visible;
  };

  docker.settings = function settingsFn(s) {
    settings = resolveSettings(s);
  };

  return docker;
}

const dockLayout = (strategySettings) => {
  const docker = create(strategySettings);
  return {
    defaultLayoutSettings: {
      dock: 'center',
      prioOrder: 0,
      displayOrder: 0
    },
    getPreferredSize(components) {
      let width = 0;
      let height = 0;
      components.forEach((c) => {
        const size = c.getPreferredSize();
        const layoutSettings = extend(
          this.defaultLayoutSettings,
          c.userSettings.layout
        );
        if (layoutSettings.dock === 'top' || layoutSettings.dock === 'bottom') {
          height += size.height;
        } else if (
          layoutSettings.dock === 'left'
          || layoutSettings.dock === 'right'
        ) {
          width += size.width;
        } else {
          height += size.height;
          width += size.width;
        }
      });
      return { width, height };
    },
    layout(rect, components) {
      const visible = docker.layout(rect, components);
      visible.forEach((c) => {
        c.comp.layoutComponents();
      });
    }
  };
};

export default dockLayout;
