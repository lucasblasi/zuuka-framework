var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    zuuka = (testsRunningInNode ? global.zuuka : window.zuuka),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("zuuka Assertions", function () {

    describe("arrayIncluding()", function () {

        it("should check array at body root", function () {
            var album = {
                "userId": 1,
                "id": 1,
                "title": "quidem molestiae enim"
            };
            var response = zuuka.get("https://jsonplaceholder.typicode.com/albums");
            expect(response).to.have.arrayIncluding(album);
            return zuuka.wait();
        });

        it("should check array in body", function () {
            var response = zuuka.post("http://httpbin.org/post", ["an", "array"]);
            expect(response).to.have.arrayIncluding("json", "an");
            return zuuka.wait();
        });

        it("should check array to not include", function () {
            var response = zuuka.post("http://httpbin.org/post", ["an", "array"]);
            expect(response).to.not.have.arrayIncluding("json", "not");
            return zuuka.wait();
        });
    });
});
