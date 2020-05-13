var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    zuuka = (testsRunningInNode ? global.zuuka : window.zuuka),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("zuuka Assertions", function() {

    describe("Response Time", function() {

        var request;
        before(function () {
            request = zuuka.get("http://httpbin.org/delay/2");
        })

        it("should check response time is less than or equal to expected response time", function () {
            expect(request).to.have.responsetime(3000);
            expect(request).not.to.have.responsetime(1900);
            return zuuka.wait();
        })
    });
});
