import extend from 'extend';

export default function resolveSettings(s) {
  const settings = {
    center: {
      minWidthRatio: 0.5,
      minHeightRatio: 0.5,
      minWidth: 0,
      minHeight: 0
    }
  };

  extend(true, settings, s);

  settings.center.minWidthRatio = Math.min(
    Math.max(settings.center.minWidthRatio, 0),
    1
  ); // Only accept value between 0-1
  settings.center.minHeightRatio = Math.min(
    Math.max(settings.center.minHeightRatio, 0),
    1
  ); // Only accept value between 0-1
  settings.center.minWidth = Math.max(settings.center.minWidth, 0); // Consider <= 0 to be falsy and fallback to ratio
  settings.center.minHeight = Math.max(settings.center.minHeight, 0); // Consider <= 0 to be falsy and fallback to ratio

  return settings;
}
