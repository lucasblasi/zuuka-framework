# zuuka

zuuka is an API testing framework designed to perform end to end tests on JSON REST endpoints.

The library offers a BDD testing style and fully exploits javascript promises - the resulting tests are simple, clear and expressive. zuuka is built on [node.js](https://nodejs.org/), [mocha](http://mochajs.org/), [chai](http://chaijs.com/) and [request](https://github.com/request/request).

This readme offers an introduction to the library. For more information, visit zuuka's [documentation] and [tests]which demonstrate all of zuuka's capabilities. In addition, example tests of publicly accessible APIs are available in the 

## Features
 * HTTP specific assertions. Allows testing of:
   * Status codes
   * Cookie presence and value
   * Header presence and value
   * JSON values
   * JSON structure (using the [JSON schema specification](http://json-schema.org/documentation.html))
   * Compression
   * Response times
* BDD formatting and hooks (e.g. beforeEach, afterEach)
* Promise based
* Plugin support
* Custom assertions
* Exports results in a variety of formats
* Debugging support


## Getting Started

### Install zuuka
zuuka requires Node.js and npm to be installed. It is available as an npm module. Ideally, zuuka should be added to your testing project's devDependencies. This can be achieved with the following command:
```js
npm install zuuka --save-dev
```

### Writing Tests

zuuka builds on top of the mocha testing framework.  As such, the tests follow mocha's [BDD style](http://mochajs.org/#getting-started). The following sections introduce the various aspects of writing a zuuka test.

#### Making Requests

zuuka makes use of the [request library](https://github.com/request/request) and as such boasts a comprehensive request capability. zuuka exposes helper methods for the most common HTTP request verbs. The methods typically require the URL as the first parameter, the request body (if applicable) as the second parameter and any request options as an optional last parameter. 

Below is an example of making a HTTP GET request:
```js
var zuuka = require('zuuka');

describe("zuuka", function() {
    it("should offer simple HTTP request capabilities", function () {
        return zuuka.get("http://httpbin.org/get");
    });
});
```

#### Testing Responses

zuuka offers a range of HTTP specific assertions which can test the information returned from API requests. zuuka offers a BDD testing style through zuuka's `expect` interface.

When testing API responses, pass the request promise as an argument into zuuka.expect. This will return an object which exposes the zuuka and Chai assertions. 
The assertion is performed once the response is received (i.e. the request promise is fulfilled). zuuka assertions return a promise which resolve to a [once the test has been performed.

Below is an example of testing the status code of a HTTP GET request:
```js
var zuuka = require('zuuka'),
    expect = zuuka.expect;

describe("zuuka", function() {
    it("should provide HTTP specific assertions", function () {
        var response = zuuka.get("http://httpbin.org/get");
        return expect(response).to.have.status(200);
    });
});
```

In addition to the HTTP specific assertions, zuuka.expect exposes all of [Chai's BDD properties and methods](http://chaijs.com/api/bdd/). Documentation for the HTTP specific assertions can be seen [here]

#### Waiting

As this library focuses on testing REST APIs, the tests are naturally asynchronous. Mocha has [native support for promises](http://mochajs.org/#asynchronous-code), which zuuka exploits. Returning a promise from an `it` callback will cause the test to wait until the promise resolves before continuing. zuuka's requests and expectations return promises which fulfill to [zuuka response objects] These promises can be returned to ensure the test waits for them to complete (as can be seen in the previous two examples).

It is important that tests wait for all requests and assertions to be completed. To help, zuuka includes a wait method. This returns a promise which will be fulfilled once all assertions have been performed. Furthermore, zuuka will fail any tests which do not wait for assertions to complete. Below is a test using the wait method.

```js
var zuuka = require('zuuka'),
    expect = zuuka.expect;

describe("zuuka", function() {
    it("should provide a simple async testing framework", function () {
        var response = zuuka.get("http://httpbin.org/get");
        expect(response).to.have.status(200);
        expect(response).not.to.have.header('non-existing-header');
        return zuuka.wait();
    });
});
```

#### Complex Promise Use

Due to the use of promises, complex tests can be written requiring chains of requests and assertions. An example can be seen below:

```js
describe("zuuka", function () {
  it("should support sequential API interaction", function () {
    var artist = "Notorious B.I.G.";
    return zuuka.get("https://api.spotify.com/v1/search?q="+artist+"&type=artist")
    .then(function (searchResponse) {
      var bigID = searchResponse.body.artists.items[0].id;
      return zuuka.get("https://api.spotify.com/v1/artists/"+bigID+"/top-tracks?country=GB");
    })
    .then(function (topTrackResponse) {
      var topTrack = topTrackResponse.body.tracks[0];
      expect(topTrack.name).to.contain("Old Thing Back");
    });
  });
});
```

zuuka exposes three promise related methods:Module-Zuuka all which takes an array of promises and returns a promise which is fulfilled once all promises in the provided array are fulfilled. The fulfillment value of the returned promise is an array of the fulfillment values of the promises which were passed to the function.
module-Zuuka wait, which returns a promise which is fulfilled once all zuuka expectations are fulfilled.
Modulo-Zuuka html, which takes an array of promises and returns a promise which is fulfilled once all promises in the provided array are fulfilled.  This is similar to zuuka.all, except it is fulfilled with the fulfillment value of the last promise in the provided array.

### Running Tests
To run zuuka tests, install the Mocha testing framework globally (or as a dev dependency):
```
npm install -g mocha
```
Once installed, run the tests using the [Mocha command line](http://mochajs.org/#usage), which in its simplest form is:
```
mocha path/to/tests
```
Test results can be exported in multiple formats, Mocha's builtin formats are described [here](http://mochajs.org/#reporters) and export plugins for Mocha are available on NPM.
