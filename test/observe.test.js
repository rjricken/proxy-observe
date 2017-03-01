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
      it('should observe changes to a single property in the original object', function(done) {
         let obj = { id: 1, name: 'Peter', age: 23 };

         let observable = Object.observe(obj, (changes) => {
            expect(changes).to.have.length(1);

            const singleChange = changes[0];
            expect(singleChange).to.have.property('type', 'update');
            expect(singleChange).to.have.property('name', 'name');
            expect(singleChange).to.have.property('oldValue', 'Peter');
            expect(singleChange).to.have.property('object');
            expect(singleChange.object).to.have.property('name', 'Brad');

            done();
         });

         observable.name = 'Brad';
      });

      it('should observe the creation of a new property in the original object', function(done) {
         let obj = { id: 1, name: 'Peter', age: 23 };

         let observable = Object.observe(obj, (changes) => {
            expect(changes).to.have.length(1);

            const singleChange = changes[0];
            expect(singleChange).to.have.property('type', 'add');
            expect(singleChange).to.have.property('name', 'job');
            expect(singleChange).to.have.property('object');
            expect(singleChange.object).to.have.property('job', 'Engineer');

            done();
         });

         observable.job = 'Engineer';
      });

      it('should observe the deletion of a single property in the original object', function(done) {
         let obj = { id: 1, name: 'Peter', age: 23 };

         let observable = Object.observe(obj, (changes) => {
            expect(changes).to.have.length(1);

            const singleChange = changes[0];
            expect(singleChange).to.have.property('type', 'delete');
            expect(singleChange).to.have.property('name', 'age');
            expect(singleChange).to.have.property('object');
            expect(singleChange.object).to.not.have.property('age');

            done();
         });

         delete observable.age;
      });
   });
});