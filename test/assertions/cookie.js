var testsRunningInNode = (typeof global !== "undefined" ? true : false),
    zuuka = (testsRunningInNode ? global.zuuka : window.zuuka),
    expect = (testsRunningInNode ? global.expect : window.expect);

describe("zuuka Assertions", function() {
    describe("Cookies", function() {

        var cookieSet;

        before(function() {
            cookieSet = zuuka.get("http://httpbin.org/cookies/set?zuuka=testval");
        });

        it("should check existance of a cookie", function () {
            expect(cookieSet).to.have.cookie('zuuka');
            expect(cookieSet).not.to.have.cookie('nonexistantcookie');
            return zuuka.wait();
        });

        it("should check that the cookie value matches a given string", function () {
            expect(cookieSet).to.have.cookie('zuuka', 'testval');

            expect(cookieSet).not.to.have.cookie('zuuka', 'testval');
            expect(cookieSet).not.to.have.cookie('zuuka', 'est');
            expect(cookieSet).not.to.have.cookie('zuuka', 'testva');
            expect(cookieSet).not.to.have.cookie('zuuka', 'Testval');
            expect(cookieSet).not.to.have.cookie('zuuka', '');

            expect(cookieSet).not.to.have.cookie('nonexistantcookie', 'testval');
            return zuuka.wait();
        });

        it("should check that the cookie value satisifies regex", function () {
            expect(cookieSet).to.have.cookie('zuuka', /testval/);
            expect(cookieSet).to.have.cookie('zuuka', /TESTVAL/i);
            expect(cookieSet).to.have.cookie('zuuka', /test.*/);
            expect(cookieSet).to.have.cookie('zuuka', /te.*val/);
            expect(cookieSet).to.have.cookie('zuuka', /est/);

            expect(cookieSet).not.to.have.cookie('zuuka', /\s/);
            expect(cookieSet).not.to.have.cookie('zuuka', /t[s]/);
            expect(cookieSet).not.to.have.cookie('zuuka', /TESTVAL/);

            expect(cookieSet).not.to.have.cookie('nonexistantcookie', /testval/);
            return zuuka.wait();
        });
    });

    describe("Cookies internal state", function() {

        var cookieSet;

        it("should preserve cookies if defaults jar set to true", function() {
            zuuka.setRequestDefaults({jar: true});

            cookieSet = zuuka.get("http://httpbin.org/cookies/set?zuuka1=testval1");
            cookieSet = zuuka.get("http://httpbin.org/cookies/set?zuuka2=testval2");

            expect(cookieSet).to.have.cookie('zuuka1', 'testval1');
            expect(cookieSet).to.have.cookie('zuuka2', 'testval2');
            return zuuka.wait();
        });

        it("should not preserve cookies between requests on default", function() {

            // Reset to default state
            zuuka.setRequestDefaults({jar: undefined});

            cookieSet = zuuka.get("http://httpbin.org/cookies/set?zuuka1=testval1");
            expect(cookieSet).to.have.cookie('zuuka1', 'testval1');

            cookieSet = zuuka.get("http://httpbin.org/cookies/set?zuuka2=testval2");
            expect(cookieSet).not.to.have.cookie('zuuka1', 'testval1');
            expect(cookieSet).to.have.cookie('zuuka2', 'testval2');
            return zuuka.wait();
        });

        testsRunningInNode && it("should preserve cookies if defaults jar set to instance", function() {
            var request = require('request');
            var jar = request.jar();
            zuuka.setRequestDefaults({jar: jar});

            cookieSet = zuuka.get("http://httpbin.org/cookies/set?zuuka1=testval1");
            cookieSet = zuuka.get("http://httpbin.org/cookies/set?zuuka2=testval2");

            expect(cookieSet).to.have.cookie('zuuka1', 'testval1');
            expect(cookieSet).to.have.cookie('zuuka2', 'testval2');
            return zuuka.wait();
        });


    });
});
