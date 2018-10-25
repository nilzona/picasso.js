import extractData from '../../data/extractor';

const prepareRenderingContext = ({ globalContext, instance, toolbox }) => {
  let renderer = instance.userSettings.renderer;
  if (!renderer && globalContext.renderer && globalContext.renderer.prio) {
    renderer = globalContext.renderer.prio[0];
  }
  renderer = renderer || 'svg';

  const settings = instance.userSettings;
  let scale,
    data,
    formatter,
    style;

  if (settings.scale) {
    scale = toolbox.scale(settings.scale);
  }

  if (settings.data) {
    data = extractData(
      settings.data,
      { dataset: toolbox.dataset, collection: toolbox.dataCollection },
      { logger: toolbox.logger },
      toolbox.dataCollection
    );
  } else if (scale) {
    data = scale.data();
  } else {
    data = [];
  }

  if (typeof settings.formatter === 'string') {
    formatter = toolbox.formatter(settings.formatter);
  } else if (typeof settings.formatter === 'object') {
    formatter = toolbox.formatter(settings.formatter);
  } else if (scale && scale.data().fields) {
    formatter = scale.data().fields[0].formatter();
  }

  style = toolbox.theme.style(settings.style || {});
  const ctx = {
    renderer,
    data,
    formatter,
    style,
    logger: toolbox.logger
  };
  return ctx;
};

export default prepareRenderingContext;
