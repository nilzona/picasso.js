import settingsResolver from '../component/settings-resolver';
import datasources from '../data/data';
import dataCollections from '../data/collections';
import buildFormatters, { getOrCreateFormatter } from '../chart/formatter';
import { builder as buildScales, getOrCreateScale } from '../chart/scales';
import themeFn from '../theme';

const UPD_DATA = 0x0001;
const UPD_SETTINGS = 0x0010;

const createToolbox = (context) => {
  const {
    registries, logger, style, palettes
  } = context;
  const theme = themeFn(style, palettes);

  let updateMask = 0;
  const isDataUpdate = () => updateMask & UPD_DATA;
  const isSettingsUpdate = () => updateMask & UPD_SETTINGS;
  const isOnlyDataUpdate = () => updateMask === UPD_DATA;

  let settings,
    data,
    dataset,
    dataCollection,
    currentScales,
    currentFormatters;

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
        types: registries.data
      });
    }

    dataCollection = dataCollections(
      settings.collections,
      { dataset },
      { logger }
    );
    currentScales = buildScales(
      scales,
      { dataset, collection: dataCollection },
      { scale: registries.scale, theme, logger }
    );
    currentFormatters = buildFormatters(
      formatters,
      { dataset, collection: dataCollection },
      { formatter: registries.formatter, theme, logger }
    );
  }
  const toolbox = {};
  toolbox.update = update;
  toolbox.isOnlyDataUpdate = isOnlyDataUpdate;

  toolbox.dataset = key => dataset(key);
  toolbox.dataCollection = key => dataCollection(key);
  toolbox.scale = v => getOrCreateScale(
    v,
    currentScales,
    { dataset, collection: dataCollection },
    { scale: registries.scale, theme, logger }
  );
  toolbox.formatter = v => getOrCreateFormatter(
    v,
    currentFormatters,
    { dataset, collection: dataCollection },
    { formatter: registries.formatter, theme, logger }
  );
  toolbox.logger = logger;
  toolbox.theme = theme;
  toolbox.registries = registries;
  toolbox.resolver = settingsResolver({
    chart: toolbox
  });

  return toolbox;
};

export default createToolbox;
