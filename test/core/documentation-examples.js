var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    zuuka = (testsRunningInNode ? global.zuuka : window.zuuka),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Documentation examples", function() {

    it("should support zuuka and chai assertions", function () {
        var google = zuuka.get("http://google.com");
        expect(true).to.be.true;
        expect(google).to.have.status(200);
        expect(1).to.be.below(10);
        expect("teststring").to.be.a('string');
        return zuuka.wait();
    });

    it("should support grouping multiple tests", function () {
        var response = zuuka.get("http://httpbin.org/get");
        return zuuka.waitFor([
            expect(response).to.have.status(200),
            expect(response).not.to.have.status(404)
        ]);
    });

    it("should support auto waiting for tests", function() {
        var response = zuuka.get("http://httpbin.org/get");
        expect(response).to.have.status(200);
        expect(response).not.to.have.status(404);
        return zuuka.wait();
    });

    it("should detect deflate compression", function () {
        var deflate = zuuka.get("http://httpbin.org/deflate");
        return expect(deflate).to.be.encoded.with.deflate;
    });

    it("should detect gzip compression", function () {
        var gzip = zuuka.get("http://httpbin.org/gzip");
        return expect(gzip).to.be.encoded.with.gzip;
    });

    it("should allow checking of HTTP cookies", function () {
        var response = zuuka.get("http://httpbin.org/cookies/set?zuuka=testval");
        expect(response).to.have.cookie('zuuka');
        expect(response).to.have.cookie('zuuka', 'testval');
        expect(response).to.have.cookie('zuuka', /val/);
        return zuuka.wait();
    });

    it("should allow checking of HTTP headers", function () {
        var response = zuuka.get("http://httpbin.org/get");
        expect(response).to.have.header('content-type');
        expect(response).to.have.header('content-type', 'application/json');
        expect(response).to.have.header('content-type', /json/);
        expect(response).to.have.header('content-type', function(contentType) {
            expect(contentType).to.equal('application/json');
        });
        return zuuka.wait();
    });

    it("should allow checking of JSON return bodies", function () {
        var response = zuuka.get("http://httpbin.org/get");
        expect(response).to.comprise.of.json({
            url: "http://httpbin.org/get",
            headers: {
                Host: "httpbin.org"
            }
        });
        expect(response).to.have.json('url', "http://httpbin.org/get");
        expect(response).to.have.json('url', function (url) {
            expect(url).to.equal("http://httpbin.org/get");
        });
        return zuuka.wait();
    });

    it("should check that the returned JSON object satisifies a JSON schema", function () {
        var response = zuuka.get("http://httpbin.org/get");
        expect(response).to.have.schema('headers', {"required": ["Host", "Accept"]});
        expect(response).to.have.schema({
            "type": "object",
            properties: {
                url: {
                    type: "string"
                },
                headers: {
                    type: "object"
                }
            }
        });
        return zuuka.wait();
    });

    it("should allow checking of the response's status code", function () {
        var response = zuuka.get("http://httpbin.org/get");
        return expect(response).to.have.status(200);
    });

});
