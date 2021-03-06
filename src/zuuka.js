/**
zuuka Module
@module zuuka
@example
var zuuka = require("zuuka");
 */

var Q = require('q'),
    extend = require('extend-object'),
    methods = require('./methods.js'),
    plugins = require('./plugins.js'),
    debug = require('./debug.js'),
    tv4 = require('tv4');

var exports = module.exports = {};
extend(exports, methods, plugins, debug);

var recordedExpects = [];

/**
zuuka assertion constructor. Extends chai's extend method with zuuka's HTTP assertions.
Please see {@link http://chaijs.com/api/bdd/ chai's API documentation} for details on the default chai assertions and the {@link zuukaExpectation} documentation for the zuuka HTTP assertions.
@param {*} value - The variable to run assertions on, can be a {@link zuukaResponse} promise
@param {string} message - A custom assertion message passed to Chai
@returns {zuuka-expectation} A zuuka expectation object
@alias module:zuuka.expect
@example 
var expect = zuuka.expect;
it("should support zuuka and chai assertions", function () {
    var google = zuuka.get("http://google.com");
    expect(true).to.be.true;
    expect(google).to.have.status(200);
    expect(1).to.be.below(10);
    expect("teststring").to.be.a('string');
    return zuuka.wait();
});
 */
exports.expect = function(value, message) {
    if(plugins.chai === null) {
        exports.initialize();
    }
    if (value !== undefined && value !== null && value.then !== undefined) {
        var test = plugins.chai.expect(value, message).eventually;
        recordedExpects.push(test);
        return test;
    } else {
        return plugins.chai.expect(value, message);   
    }
};

/**
Returns a promise which is fulfilled once all promises in the provided array are fulfilled.
Identical to {@link https://github.com/kriskowal/q/wiki/API-Reference#promiseall Q.all}.
@method
@param {Promise[]} promiseArray - An array of promises to wait for
@returns {Promise}
@alias module:zuuka.all
 */
exports.all = Q.all;

/**
Returns a promise which is fulfilled once all promises in the provided array are fulfilled.
Similar to {@link https://github.com/kriskowal/q/wiki/API-Reference#promiseall Q.all}, however, instead of being fulfilled with an array containing the fulfillment value of each promise, it is fulfilled with the fulfillment value of the last promise in the provided array. This allows chaining of HTTP calls.
@param {Promise[]} promiseArray - An array of promises to wait for
@returns {Promise}
@alias module:zuuka.waitFor
@example 
it("should support grouping multiple tests", function () {
    var response = zuuka.get("http://httpbin.org/get");
    return zuuka.waitFor([
        expect(response).to.have.status(200),
        expect(response).not.to.have.status(404)
    ]);
});
 */
exports.waitFor = function(promiseArray) {
    return Q.all(promiseArray).then(function(resolvedArray) {
        var deferred = Q.defer();
        deferred.resolve(resolvedArray[resolvedArray.length - 1]);
        return deferred.promise;
    });
};

/**
Returns a promise which is fulfilled once all zuuka expectations are fulfilled.
This works by recording all zuuka expectations called within an 'it' and waits for all the expectations to finish before resolving the returned promise.
@returns {Promise}
@alias module:zuuka.wait
@example 
it("should support auto waiting for tests", function() {
    var response = zuuka.get("http://httpbin.org/get");
    expect(response).to.have.status(200);
    expect(response).not.to.have.status(404);
    return zuuka.wait();
});
 */
exports.wait = function() {
    return exports.waitFor(recordedExpects);
};

/**
Option for turning on tv4's "ban unknown properties" mode.
@alias module:zuuka.schemaBanUnknown
@example
zuuka.schemaBanUnknown = true;
*/
exports.schemaBanUnknown = false;

/**
Option for turning on tv4's option to check for self-referencing objects.
@alias module:zuuka.schemaCyclicCheck
@example
zuuka.schemaCyclicCheck = true;
*/
exports.schemaCyclicCheck = false;

/**
Exposes tv4's add schema method. Allows the registration of schemas used for schema validation.
@alias module:zuuka.addSchema
@example 
zuuka.addSchema('http://example.com/schema', { ... });
*/
exports.addSchema = tv4.addSchema;

/**
Exposes tv4's get schemaMap method. Allows to check the mapping schema object.
@alias module:zuuka.getSchemaMap
@example 
zuuka.getSchemaMap();
*/
exports.getSchemaMap = tv4.getSchemaMap;

/**
Exposes tv4's add format method. Allows add custom format for schema validation.
@alias module:zuuka.addSchemaFormat
@example
zuuka.addSchemaFormat('decimal-digits', function (data, schema) {
    if (typeof data === 'string' && !/^[0-9]+$/.test(data)) {
        return null;
    }
    return "must be string of decimal digits";
});
*/
exports.addSchemaFormat = tv4.addFormat;

var warnUser = function (message) {
    if (this.currentTest.state !== 'failed') {
        this.test.error(new Error(message));
    }
};

var checkForUnfulfilledExpectations = function () {
    for(var ct = 0; ct < recordedExpects.length; ct++) {
        if(recordedExpects[ct].isFulfilled !== undefined && recordedExpects[ct].isFulfilled() === false) {
            warnUser.call(this, "Some expectation promises were not fulfilled before the test finished. Ensure you are waiting for all the expectations to run");
            break;
        }
    }
};

afterEach(function() {
    checkForUnfulfilledExpectations.call(this);
    recordedExpects = [];
});
