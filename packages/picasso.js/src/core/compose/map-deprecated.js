/*
created -> constructor
beforeMount -> show ?
mounted -> componentDidMount
beforeUnmount -> hide ?
beforeUpdate -> componentWillUpdate
updated -> componentDidUpdate
beforeRender
beforeDestroy -> componentWillUnmount
destroyed -> ?

'componentWillMount',
'componentDidMount',
'shouldComponentUpdate',
'componentWillReceiveProps',
'componentWillUpdate',
'componentDidUpdate',
'componentWillUnmount'

*/

function mapFunction(fnName, newFnName, target) {
  if (target[fnName]) {
    // store existing functions
    const deprecatedFn = target[fnName];
    const existingFn = target[newFnName];

    // define new function
    target[newFnName] = function newFn(...args) {
      if (existingFn) {
        existingFn.call(target, ...args);
      }
      deprecatedFn.call(target, ...args);
    };
  }
}

function mapDeprecatedMethods(target) {
  mapFunction('created', 'componentWillMount', target);
  mapFunction('beforeMount', 'componentWillMount', target);
  mapFunction('mounted', 'componentDidMount', target);
  mapFunction('beforeUpdate', 'componentWillUpdate', target);
  mapFunction('beforeDestroy', 'componentWillUnmount', target);
  mapFunction('destroyed', 'componentWillUnmount', target);
}

export default mapDeprecatedMethods;
