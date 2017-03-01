'use strict';

/*
   TODO: keep track of each observer in an Object to make it possible to unobserve later
*/

function observe(object, callback, acceptList) {
   acceptList = acceptList || ['add', 'update', 'delete', 'reconfigure', 'setPrototype', 'preventExtensions'];

   //TODO: improve how we dispatch the stream of changes to the callback
   function dispatch(change) {
      callback([change]);
   }

   return new Proxy(object, {

      // changing an existing property or adding a new one
      set: (target, property, value, receiver) => {

         // changing a property
         if (property in target) {
            let oldValue = target[property];
            target[property] = value;

            if (acceptList.includes('update')) {
               dispatch({
                  name: property,
                  object: target,
                  type: 'update',
                  oldValue: oldValue
               });
            }
         }

         // adding a new property
         else {
            target[property] = value;

            if (acceptList.includes('add')) {
               dispatch({
                  name: property,
                  object: target,
                  type: 'add'
               });
            }
         }

         return true;
      },

      // removing an existing property
      deleteProperty: (target, property) => {
         delete target[property];

         if (acceptList.includes('delete')) {
            dispatch({
               name: property,
               object: target,
               type: 'delete'
            });
         }        

         return true;
      }
   });
}

function unobserve() {

};

module.exports = { observe, unobserve };