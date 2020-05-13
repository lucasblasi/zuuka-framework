var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    zuuka = (testsRunningInNode ? global.zuuka : window.zuuka),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("zuuka Assertions", function() {

    describe("Status code", function() {
        it("should assert return status code", function() {
            var exists = zuuka.get("http://httpbin.org/status/200");
            var missing = zuuka.get("http://httpbin.org/status/404");
            return zuuka.waitFor([
                expect(exists).to.have.status(200),
                expect(missing).to.have.status(404)
            ]);
        });
    });

});
