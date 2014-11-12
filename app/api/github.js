module.exports = {
    getOrganisations: getOrganisations,
    getOrganisationRepositories: getOrganisationRepositories
};

var API_BASE = "https://api.github.com";

function getOrganisations()
{
    return sendRequest("/user/orgs", "GET");
}

function getOrganisationRepositories(orgName) {
    return sendRequest("/orgs/" + orgName + "/repos", "GET");
}

function sendRequest(url, action)
{
    console.log(action + " request to " + url);
    //load oauth key from localstorage
    var key = localStorage.getItem("oauth_key");
    var promise = new Promise(function(resolve, reject) {
        
        var request = new XMLHttpRequest();
        request.open('GET', API_BASE + url, true);
        request.setRequestHeader('Accept', 'application/vnd.github.v3+json');
        request.setRequestHeader('Authorization', 'token ' + key);

        request.onload = function() {
            var success = request.status >= 200 && request.status < 400;
            var result = {
                success: success,
                status: request.status,
                data: JSON.parse(request.responseText),
                rateLimit: {
                    limit: request.getResponseHeader("X-RateLimit-Limit"),
                    remaining: request.getResponseHeader("X-RateLimit-Remaining"),
                    reset: request.getResponseHeader("X-RateLimit-Reset")
                }
            };
            resolve(result);
        };

        request.onerror = function() {
            reject(Error("Could not connect to github API"));
        };

        request.send();

     });
     return promise;
}