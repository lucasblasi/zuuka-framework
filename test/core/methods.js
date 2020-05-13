var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    zuuka = (testsRunningInNode ? global.zuuka : window.zuuka),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("Methods", function() {

    var testWriteMethods = function (testMethod, testUrl) {
        it("should support JSON requests", function () {
            var json = {"num": 2,"str": "test"};
            var response = testMethod(testUrl, json);
            return response.then(function(resp) {
                expect(resp.body).to.be.an('object');
                expect(resp.body.json).to.deep.equal(json);
                expect(resp.body.headers['Content-Type']).to.be.equal('application/json');
            });
        });

        it("should support non-JSON requests", function () {
            var stringPost = "testing with a string post";
            var response = testMethod(testUrl, stringPost, {json:false});
            return response.then(function(resp) {
                expect(resp.body).to.be.a('string');
                expect(JSON.parse(resp.body).data).to.be.equal(stringPost);
                expect(JSON.parse(resp.body).headers['Content-Type']).not.to.be.equal('application/json');
            });
        });

        it("should support sending custom headers", function () {
            var customHeaders = {
                "Token": "dummy token value"
            };
            var response = testMethod(testUrl, {}, {
                headers: customHeaders
            });
            return expect(response).to.include.json('headers', customHeaders);
        });
    };

    describe("POST", function () {
        testWriteMethods(zuuka.post, "http://httpbin.org/post");

		testsRunningInNode && it("should allow posting files with multipart/form-data", function () {
            var fs = require('fs');
			var response = zuuka.post("https://httpbin.org/post", undefined, {
				formData: {
					pkgFile: fs.createReadStream('./package.json')
				}
			});
			expect(response).to.have.json('files', function (files) {
				expect(files).to.have.key('pkgFile');
				expect(files.pkgFile).to.contain('zuuka');
			});
			return zuuka.wait();
		});
    });

    describe("PUT", function () {
        testWriteMethods(zuuka.put, "http://httpbin.org/put");
    });

    describe("DELETE", function () {
        testWriteMethods(zuuka.delete, "http://httpbin.org/delete");
        testWriteMethods(zuuka.del, "http://httpbin.org/delete");
    });

    describe("PATCH", function () {
        testWriteMethods(zuuka.patch, "http://httpbin.org/patch");
    });

    it("should allow GET requests", function () {
        return zuuka.get("http://httpbin.org/get?test=str")
        .then(function(obj) {
            expect(obj.body).to.be.an('object');
            expect(obj.body.args.test).to.equal('str');
        });
    });

    it("should allow HEAD requests", function () {
        var request = zuuka.head("http://httpbin.org/get?test=str");
        expect(request).to.have.status(200);
        expect(request).to.have.header('content-length');
        return zuuka.wait().then(function(obj) {
            expect(obj.body).to.be.undefined;
        });
    });

    it("should allow OPTIONS requests", function () {
        var request = zuuka.options("http://httpbin.org/get?test=str");
        expect(request).to.have.header('Access-Control-Allow-Credentials');
        expect(request).to.have.header('Access-Control-Allow-Methods');
        expect(request).to.have.header('Access-Control-Allow-Origin');
        expect(request).to.have.header('Access-Control-Max-Age');
        return zuuka.wait();
    });

  describe("request defaults", function () {
      before(function () {
          zuuka.setRequestDefaults({
              headers: {
                  Testing: 'default-option'
              }
          });
      });

      it("should allow default settings to be applied to multiple requests", function () {
          return zuuka.get("http://httpbin.org/get").then(function(firstResp) {
              return zuuka.get("http://httpbin.org/get").then(function (secondResp) {
                  expect(firstResp.body.headers.Testing).to.equal('default-option');
                  expect(secondResp.body.headers.Testing).to.equal('default-option');
              });
          });
      });

      it("should allow clearing default settings", function () {
          zuuka.clearRequestDefaults();
          return zuuka.get("http://httpbin.org/get").then(function(resp) {
              expect(resp.body.headers.Testing).to.be.undefined;
          });
      });
  });
});
