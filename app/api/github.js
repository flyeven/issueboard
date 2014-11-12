module.exports = {
    getOrganisations: getOrganisations,
    getOrganisationRepositories: getOrganisationRepositories,
    getMilestones: getMilestones,
    getMilestoneIssues: getMilestoneIssues,
};

var API_BASE = "https://api.github.com";

function getOrganisations()
{
    return sendRequest("/user/orgs", "GET");
}

function getOrganisationRepositories(org) {
    return sendRequest("/orgs/" + org + "/repos", "GET");
}

function getMilestones(org, repo) {
    return sendRequest("/repos/" + org + "/" + repo + "/milestones", "GET");
}

//can pass "none" as milestone to get unassigned stuff
function getMilestoneIssues(org, repo, milestone) {
    return sendRequest("/repos/" + org + "/" + repo + "/issues" + "?milestone=" + milestone + "&state=all&sort=updated", "GET");
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