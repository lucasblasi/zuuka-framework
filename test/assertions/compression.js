var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    zuuka = (testsRunningInNode ? global.zuuka : window.zuuka),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("zuuka Assertions", function() {

    describe("Compression", function() {

        it("should allow assertions on uncompressed responses", function () {
            var noncompressed = zuuka.get("http://httpbin.org/get");
            expect(noncompressed).not.to.be.encoded.with.gzip;
            expect(noncompressed).not.to.be.encoded.with.deflate;
            return zuuka.wait();
        });

        it("should detect gzip compression", function () {
            var gzip = zuuka.get("http://httpbin.org/gzip");
            expect(gzip).to.be.encoded.with.gzip;
            expect(gzip).not.to.be.encoded.with.deflate;
            return zuuka.wait();
        });

        it("should detect deflate compression", function () {
            var deflate = zuuka.get("http://httpbin.org/deflate");
            expect(deflate).not.to.be.encoded.with.gzip;
            expect(deflate).to.be.encoded.with.deflate;
            return zuuka.wait();
        });

        it("should support shorter language chains", function () {
            var deflate = zuuka.get("http://httpbin.org/deflate");
            expect(deflate).not.to.be.gzip;
            expect(deflate).to.be.deflate;
            return zuuka.wait();
        });
    });

});
