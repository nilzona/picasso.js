import { h } from 'preact';
import { hashObject } from '../../utils/crypto';
import { degreesToPoints } from '../../math/angles';

let gradientHashMap = {};

/**
 * get or create a url for gradient
 * @ignore
 * @param  {Object} gradient Gradient property
 */
export function get(gradientDef, vDefs) {
  let gradientHash = hashObject(gradientDef);
  let gradientId = '';

  if (gradientHashMap[gradientHash] !== undefined) {
    gradientId = gradientHashMap[gradientHash];
  } else {
    let { orientation, degree, stops = [] } = gradientDef;
    let gradient = {};

    if (degree === undefined) {
      degree = 90;
    }
    let Gradient;
    // Default to linear
    if (orientation === 'radial') {
      Gradient = 'radialGradient';
    } else {
      gradient = degreesToPoints(degree);
      Gradient = 'linearGradient';
    }
    const gradientStops = stops.map(({ offset, color, opacity }) => (
      <stop
        offset={`${offset * 100}%`}
        style={`stop-color:${color};stop-opacity:${opacity || 1}`}
      />
    ));
    gradientId = `pic${gradientHash}`;
    const vDef = (
      <Gradient id={gradientId} {...gradient}>
        {gradientStops}
      </Gradient>
    );
    vDefs.push(vDef);
    gradientHashMap[gradientHash] = gradientId;
  }

  return `url(#${gradientId})`;
}

/**
 * Reset the gradients between rendering
 * @ignore
 */
export function resetGradients() {
  gradientHashMap = {};
}

export function isGradientProperty(prop) {
  return (
    prop && typeof prop === 'object' && prop.type && prop.type === 'gradient'
  );
}

export function maybeAddGradients(attrs, defs) {
  if (isGradientProperty(attrs.fill)) {
    attrs.fill = get(attrs.fill, defs);
  }
  if (isGradientProperty(attrs.stroke)) {
    attrs.stroke = get(attrs.stroke, defs);
  }
}
