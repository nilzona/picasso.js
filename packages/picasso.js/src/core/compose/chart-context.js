import extend from 'extend';
import { getShapeType } from '../geometry/util';
import settingsResolver from '../component/settings-resolver';
import datasources from '../data/data';
import dataCollections from '../data/collections';
import { collection as formatterCollection } from '../chart/formatter';
import { collection as scaleCollection } from '../chart/scales';
import themeFn from '../theme';
import { measureText, textBounds } from '../../web/text-manipulation';
import createRendererBox from '../../web/renderer/renderer-box';
import createSymbolFactory from '../symbols';

function addComponentDelta(shape, containerBounds, componentBounds) {
  const dx = containerBounds.left - componentBounds.left;
  const dy = containerBounds.top - componentBounds.top;
  const type = getShapeType(shape);
  const deltaShape = extend(true, {}, shape);

  switch (type) {
    case 'circle':
      deltaShape.cx += dx;
      deltaShape.cy += dy;
      break;
    case 'polygon':
      for (let i = 0, num = deltaShape.vertices.length; i < num; i++) {
        const v = deltaShape.vertices[i];
        v.x += dx;
        v.y += dy;
      }
      break;
    case 'line':
      deltaShape.x1 += dx;
      deltaShape.y1 += dy;
      deltaShape.x2 += dx;
      deltaShape.y2 += dy;
      break;
    case 'point':
    case 'rect':
      deltaShape.x += dx;
      deltaShape.y += dy;
      break;
    default:
      break;
  }

  return deltaShape;
}

const UPD_DATA = 0x0001;
const UPD_SETTINGS = 0x0010;

const createChartContext = (context, element) => {
  const { registries, logger, palettes } = context;
  const theme = themeFn(context.style, palettes);
  const symbol = createSymbolFactory(registries.symbol);

  let updateMask = 0;
  const isDataUpdate = () => updateMask & UPD_DATA;
  const isSettingsUpdate = () => updateMask & UPD_SETTINGS;
  const isOnlyDataUpdate = () => updateMask === UPD_DATA;

  let settings, data, dataset, dataCollection, currentScales, currentFormatters, rootInstance;

  function update(newUserDef) {
    updateMask = 0;
    if (newUserDef.settings) {
      settings = newUserDef.settings;
      updateMask |= UPD_SETTINGS;
    }
    if (newUserDef.data) {
      data = newUserDef.data;
      updateMask |= UPD_DATA;
    }
    settings = settings || {};
    data = data || [];

    const { formatters = {}, scales = {} } = settings;

    if (isSettingsUpdate() && settings.palettes) {
      theme.setPalettes(settings.palettes);
    }
    if (isDataUpdate()) {
      dataset = datasources(data, {
        logger,
        types: registries.data,
      });
    }

    dataCollection = dataCollections(settings.collections, { dataset }, { logger });

    const deps = {
      theme,
      logger,
    };

    currentScales = scaleCollection(
      scales,
      { dataset, collection: dataCollection },
      { ...deps, scale: registries.scale }
    );
    currentFormatters = formatterCollection(
      formatters,
      { dataset, collection: dataCollection },
      { ...deps, formatter: registries.formatter }
    );
  }

  const chartContext = {};
  chartContext.update = update;
  chartContext.isOnlyDataUpdate = isOnlyDataUpdate;
  chartContext.setRootInstance = cmp => {
    rootInstance = cmp;
  };
  chartContext.component = key => rootInstance.findComponent(key);

  chartContext.dataset = key => dataset(key);
  chartContext.dataCollection = key => dataCollection(key);
  chartContext.scale = v => currentScales.get(v);
  chartContext.formatter = v => currentFormatters.get(v);
  chartContext.logger = logger;
  chartContext.theme = theme;
  chartContext.registries = registries;
  chartContext.resolver = settingsResolver({
    chart: chartContext,
  });
  chartContext.shapesAt = (shape, opts = {}) => {
    const result = [];
    const containerBounds = element.getBoundingClientRect();
    const visibleComponents = rootInstance.getChildren().filter(c => c.visible);
    let comps;
    if (Array.isArray(opts.components) && opts.components.length > 0) {
      const compKeys = opts.components.map(c => c.key);
      comps = visibleComponents
        .filter(c => compKeys.indexOf(c.key) !== -1)
        .map(c => ({
          instance: c,
          opts: opts.components[compKeys.indexOf(c.key)],
        }));
    } else {
      comps = visibleComponents;
    }

    for (let i = comps.length - 1; i >= 0; i--) {
      const c = comps[i];
      const componentBounds = c.instance.renderer.element().getBoundingClientRect();
      const deltaShape = addComponentDelta(shape, containerBounds, componentBounds);
      const shapes = c.instance.shapesAt(deltaShape, c.opts);
      const stopPropagation = shapes.length > 0 && opts.propagation === 'stop';

      result.push(...shapes);

      if (result.length > 0 && stopPropagation) {
        return result;
      }
    }
    return result;
  };
  chartContext.brushFromShapes = () => {};
  chartContext.symbol = symbol;
  chartContext.element = element;

  const notImplemented = fnName => {
    throw new Error(`${fnName}: not implemented in server environment`);
  };
  const measure = context.noBrowser ? notImplemented : measureText;
  const bounds = context.noBrowser ? notImplemented : textBounds;
  const size = context.noBrowser
    ? notImplemented
    : opts => {
        return createRendererBox(opts);
      };

  chartContext.renderTools = {
    measureText: measure,
    textBounds: bounds,
    size,
  };

  return chartContext;
};

export default createChartContext;
