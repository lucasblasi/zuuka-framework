var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    zuuka = (testsRunningInNode ? global.zuuka : window.zuuka),
    expect = (testsRunningInNode ? global.expect : window.expect),
    sinon = require('sinon')

describe("Debugging", function() {

    var debugFnSpy = sinon.spy();

    it("should log to console by default", function () {
        zuuka.startDebug();
        request = zuuka.get("http://httpbin.org/get");
        return expect(request).to.have.status(200);
    });

    it("should support custom debug functions", function () {
        zuuka.startDebug(debugFnSpy);
        request = zuuka.get("http://httpbin.org/get");
        return request.then(function () {
            expect(debugFnSpy.callCount).to.equal(2);
            expect(debugFnSpy.getCall(0).args[0]).to.equal('request');
            expect(debugFnSpy.getCall(1).args[0]).to.equal('response');
            expect(debugFnSpy.getCall(0).args[1].debugId).to.equal(debugFnSpy.getCall(1).args[1].debugId);
        });
    });

    it("should be possible to stop debugging", function () {
        debugFnSpy.reset();
        zuuka.stopDebug();
        request = zuuka.get("http://httpbin.org/get");
        return request.then(function () {
            expect(debugFnSpy.callCount).to.equal(0);
        });
    });

});
