'use strict';

/*
   TODO: keep track of each observer in an Object to make it possible to unobserve later
*/

function observe(object, callback, acceptList) {
   acceptList = acceptList || ['add', 'update', 'delete', 'reconfigure', 'setPrototype', 'preventExtensions'];

   //TODO: improve how we dispatch the stream of changes to the callback
   function dispatch(type, change) {
      if (acceptList.includes(type)) {
         callback([Object.assign(change, { type })]);
      }      
   }

   return new Proxy(object, {

      // changing an existing property or adding a new one
      set: (target, property, value, receiver) => {

         // changing a property
         if (property in target) {
            let oldValue = target[property];
            target[property] = value;

            dispatch('update', {
               name: property,
               object: target,
               oldValue: oldValue
            });
         }

         // adding a new property
         else {
            target[property] = value;

            dispatch('add', {
               name: property,
               object: target
            });
         }

         return true;
      },

      // removing an existing property
      deleteProperty: (target, property) => {
         delete target[property];

         dispatch('delete', {
            name: property,
            object: target,
         });

         return true;
      },

      // reconfiguring a property
      defineProperty: (target, property, descriptor) => {
         Object.defineProperty(target, property, descriptor);

         dispatch('reconfigure', {
            name: property,
            object: target
         });

         return true;
      }
   });
}

function unobserve() {

};

module.exports = { observe, unobserve };