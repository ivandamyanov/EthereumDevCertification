const assert = require('assert');

class Car {
    park() {
        return "stopped";
    }

    drive() {
        return "vroom";
    }
}

let car;

beforeEach(() => {
    car = new Car();
});
/* 
describe('Car', () => {
    it('can park', () => {
        assert.strictEqual('stopped', car.park());
    });

    it('can drive', () => {
        assert.strictEqual('vroom', car.drive());
    });
}) */