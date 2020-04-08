const code = `
return {
  collections: [{
    key: 'd',
      data: {
        extract: {
          field: 'Dim',
          props: {
            start: { field: 'Low' },
            end: { field: 'High' }
          }
        }
      }
  }],
  scales: {
    y: {
      data: { extract: { field: 'Dim' } }
    },
    v: {
      data: { fields: ['Low', 'High'] },
      expand: 0.1
    }
  },
  components: [{
    type: 'grid-line',
    y: 'y'
  },{
    type: 'axis',
    layout: {
      dock: 'left'
    },
    scale: 'y'
  },{
    type: 'axis',
    layout: {
      dock: 'bottom'
    },
    scale: 'v'
  },{
    key: 'bars',
    type: 'box',
    data: {
      collection: 'd'
    },
    settings: {
      orientation: 'horizontal',
      major: { scale: 'y' },
      minor: { scale: 'v' },
      box: {
        width: 0.1,
        fill: '#ccc'
      }
    }
  }, {
    type: 'point',
    data: {
      collection: 'd'
    },
    settings: {
      x: { scale: 'v', ref: 'start' },
      y: { scale: 'y' },
      fill: '#fa0',
      size: 0.8
    }
  }, {
    type: 'point',
    data: {
      collection: 'd'
    },
    settings: {
      x: { scale: 'v', ref: 'end' },
      y: { scale: 'y' },
      fill: '#bdf700',
      size: 0.8
    }
  }]
}
`;

const data = `
return [{
  type: 'matrix',
  data: [
  ["Dim", "Low", "High"],
  ["A", 50.11290447666671, 54.03380588732452],
  ["B", 50.659511376149034, 52.502021365894635],
  ["C", 51.108354714755244, 54.673850595597955],
  ["D", 51.6608484643151, 55.45033123892115],
  ["E", 51.77251480060031, 56.80094619199241],
  ["F", 52.71102428096797, 57.86787659624934],
  ["G", 53.55147909207913, 56.57919775011657],
  ["H", 54.180832385247115, 56.61384162874957],
  ["I", 54.90204838627494, 60.48733721272284],
  ["J", 55.756824474756876, 60.48459823518031],
  ["K", 56.17456196571799, 58.88735896024205],
  ["L", 56.75845581999668, 62.07040073231231],
  ["M", 57.330340196853385, 59.779258192419455],
  ["N", 57.67436813347587, 61.172937877680575],
  ["O", 58.13262990026654, 60.84096778324408],
  ["P", 58.477770533665506, 59.943068886879516],
  ["Q", 58.87507401536167, 62.68061099555608],
  ["R", 59.317972838049336, 64.10115012319699],
  ["S", 60.29182610280485, 65.57092276001771],
  ["T", 60.42321155025296, 65.266976358442],
  ["U", 60.947102449491226, 66.18980017062509],
  ["V", 61.5166268340172, 66.16664418231834],
  ["W", 62.068933086691224, 63.45613567254675],
  ["X", 62.19872217067132, 67.63258343821877],
]
}];
`;

const item = {
  id: 'dumbbell-plot',
  title: 'Dumbbell Plot',
  code,
  data,
};

export default item;
