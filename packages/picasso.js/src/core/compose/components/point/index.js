import pointMarkerComponent from './point';

/**
 * @typedef {object} component--point
 */

/**
 * @type {string}
 * @memberof component--point
 */
const type = 'point';

export default function pointMarker(picasso) {
  picasso.component(type, pointMarkerComponent);

  picasso.component('c-point', pointMarkerComponent); // temporary backwards compatibility - DEPRECATED
}
