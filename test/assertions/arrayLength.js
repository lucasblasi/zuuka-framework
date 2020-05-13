var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    zuuka = (testsRunningInNode ? global.zuuka : window.zuuka),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("zuuka Assertions", function () {

    describe("arrayLength()", function () {

        it("should check length of array at body root", function () {
            var response = zuuka.get("https://jsonplaceholder.typicode.com/users");
            expect(response).to.have.arrayLength(10);
            return zuuka.wait();
        });

        it("should check length of array in body", function () {
            var response = zuuka.post("http://httpbin.org/post", ["an", "array"]);
            expect(response).to.have.arrayLength("json", 2);
            return zuuka.wait();
        });
    });
});
