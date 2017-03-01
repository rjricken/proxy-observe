var observer = require('./src/observe.js');

try {
   Object.defineProperty(Object, 'observe', {
      value: observer.observe,
      configurable: true
   });
}
catch (e) {
   // ignore any errors
}