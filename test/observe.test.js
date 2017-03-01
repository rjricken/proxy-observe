require('../index.js');

const expect = require('chai').expect;

describe('Object.observe', function() {

   describe('Asserting that Object was properly extended', function() {
      it('should not have an enumerable property "observe"', function() {
         for (let property in Object) {
            expect(property).not.to.be.equal('observe');
         }
      });
   });

   describe('General behavior', function() {
      function checkChange(change, expectedType, expectedProperties) {
         expect(change).to.have.property('type', expectedType);
         expect(change).to.have.property('object');

         for (let property in expectedProperties) {
            expect(change).to.have.property(property, expectedProperties[property]);
         }
      }

      it('should notify changes in the value of a property', function(done) {
         let obj = { id: 1, name: 'Peter', age: 23 };

         let observable = Object.observe(obj, (changes) => {
            expect(changes).to.have.length(1);

            const singleChange = changes[0];
            checkChange(singleChange, 'update', { name: 'name', oldValue: 'Peter' });
            expect(singleChange.object).to.have.property('name', 'Brad');

            done();
         });

         observable.name = 'Brad';
      });

      it('should notify the creation of new properties', function(done) {
         let obj = { id: 1, name: 'Peter', age: 23 };

         let observable = Object.observe(obj, (changes) => {
            expect(changes).to.have.length(1);

            const singleChange = changes[0];
            checkChange(singleChange, 'add', { name: 'job' });
            expect(singleChange.object).to.have.property('job', 'Engineer');

            done();
         });

         observable.job = 'Engineer';
      });

      it('should notify the deletion of a property', function(done) {
         let obj = { id: 1, name: 'Peter', age: 23 };

         let observable = Object.observe(obj, (changes) => {
            expect(changes).to.have.length(1);

            const singleChange = changes[0];
            checkChange(singleChange, 'delete', { name: 'age' });
            expect(singleChange.object).to.not.have.property('age');

            done();
         });

         delete observable.age;
      });

      it('should notify the reconfiguration of a property', function(done) {
         let obj = { id: 1, name: 'Peter', age: 23 };

         let observable = Object.observe(obj, (changes) => {
            expect(changes).to.have.length(1);

            const singleChange = changes[0];
            checkChange(singleChange, 'reconfigure', { name: 'id' });

            done();
         });

         Object.defineProperty(observable, 'id', { writable: false });
      })
   });
});