# Zuuka

Zuuka is an API testing framework designed to perform end to end tests on JSON REST endpoints.

The library offers a BDD testing style and fully exploits javascript promises - the resulting tests are simple, clear and expressive. zuuka is built on node.js, mocha, chai and request.


## Getting Started

### Install zuuka
zuuka requires Node.js and npm to be installed. It is available as an npm module. Ideally, zuuka should be added to your testing project's devDependencies. This can be achieved with the following command:
```js
npm install zuuka-framework --save-dev
```

### Writing Tests

zuuka builds on top of the mocha testing framework.  As such, the tests follow mocha's BDD style. The following sections introduce the various aspects of writing a zuuka test.

#### Making Requests

zuuka makes use of the request library and as such boasts a comprehensive request capability. zuuka exposes helper methods for the most common HTTP request verbs. The methods typically require the URL as the first parameter, the request body (if applicable) as the second parameter and any request options as an optional last parameter. 

Below is an example of making a HTTP GET request:
```js
var zuuka = require("zuuka-framework");

describe("zuuka", function() {
    it("should offer simple HTTP request capabilities", function () {
        return zuuka.get("http://localhost:9001");
    });
});
```

Below is an example of making a HTTP POST request:
```js
var zuuka = require("zuuka-framework");

describe("zuuka", function() {
    it("should offer simple HTTP request capabilities", function () {
        return zuuka.post("http://localhost:9001");
    });
});
```

#### Testing Responses

zuuka offers a range of HTTP specific assertions which can test the information returned from API requests. zuuka offers a BDD testing style through zuuka's `expect` interface.

When testing API responses, pass the request promise as an argument into zuuka.expect. This will return an object which exposes the zuuka and Chai assertions. 
The assertion is performed once the response is received (i.e. the request promise is fulfilled). zuuka assertions return a promise which resolve to a once the test has been performed.

Below is an example of testing the status code of a HTTP GET request:
```js
var zuuka = require("zuuka-framework"),
    expect = zuuka.expect;

describe("zuuka", function() {
    it("should provide HTTP specific assertions", function () {
        var response = zuuka.get("http://localhost:9001/");
        return expect(response).to.have.status(200);
    });
});
```

In addition to the HTTP specific assertions, zuuka.expect exposes all of Chai's BDD properties and methods. Documentation for the HTTP specific assertions can be seen here.

#### Waiting

As this library focuses on testing REST APIs, the tests are naturally asynchronous. Mocha has native support for promises, which zuuka exploits. Returning a promise from an `it` callback will cause the test to wait until the promise resolves before continuing. zuuka's requests and expectations return promises which fulfill to zuuka response objects. These promises can be returned to ensure the test waits for them to complete (as can be seen in the previous two examples).

It is important that tests wait for all requests and assertions to be completed. To help, zuuka includes a wait method. This returns a promise which will be fulfilled once all assertions have been performed. Furthermore, zuuka will fail any tests which do not wait for assertions to complete. Below is a test using the wait method.

```js
var zuuka = require("zuuka-framework"),
    expect = zuuka.expect;

describe("zuuka", function() {
    it("should provide a simple async testing framework", function () {
        var response = zuuka.get("http://localhost:9001/");
        expect(response).to.have.status(200);
        expect(response).not.to.have.header('non-existing-header');
        return zuuka.wait();
    });
});
```


