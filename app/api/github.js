var Fake = require('./fakedata.js');
var RunOffline = true;
if(RunOffline)
{
    module.exports = {
        getOrganisations: function() {
            return fakeResult( Fake.organisations );
        },
        getOrganisationRepositories: function() {
            return fakeResult( Fake.repositories );
        },
        getMilestones: function() {
            return fakeResult( Fake.milestones );
        },
        getMilestoneIssues: function() {
            return fakeResult( Fake.issues );
        },
        getIssue: function(org,repo,number) {
            return fakeResult( Fake.issues[number] );
        }
    };  
} else {
    module.exports = {
        getOrganisations: getOrganisations,
        getOrganisationRepositories: getOrganisationRepositories,
        getMilestones: getMilestones,
        getMilestoneIssues: getMilestoneIssues,
        getIssue: getIssue,
        getIssueEvents: getIssueEvents,
        getIssueComments: getIssueComments
    };
}

var API_BASE = "https://api.github.com";

function getOrganisations()
{
    return sendRequest("/user/orgs", "GET");
}

function getOrganisationRepositories(org) {
    return sendRequest("/orgs/" + org + "/repos", "GET").then();
}

function getMilestones(org, repo) {
    return sendRequest("/repos/" + org + "/" + repo + "/milestones?state=all", "GET");
}

//can pass "none" as milestone to get unassigned stuff
function getMilestoneIssues(org, repo, milestone) {
    return sendRequest("/repos/" + org + "/" + repo + "/issues" + "?milestone=" + milestone + "&state=all&sort=updated", "GET");
}

function getIssue(org,repo,number) {
    return sendRequest("/repos/" + org + "/" + repo + "/issues/" + number);
}

function getIssueEvents(org,repo,number) {
    return sendRequest("/repos/" + org + "/" + repo + "/issues/" + number + "/events");
}

function getIssueComments(org,repo,number) {
    return sendRequest("/repos/" + org + "/" + repo + "/issues/" + number + "/comments");
}

function sendRequest(url, action)
{
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
            
            if(success) {
                resolve(result);
            } else {
                reject(errorMessage(result));
            }
        };

        request.onerror = function() {
            reject(Error("Could not connect to github API"));
        };

        request.send();

     });
     return promise;
}

///Used for friendly error messages for a given result
function errorMessage(result) {
    //TODO: real implementation of this rather than just using github errors
    return result.data.message; //this will be an error message
}

function fakeResult(data) {
    return Promise.resolve({
        success: true,
        status: 200,
        data: data,
        rateLimit: {
            limit: 1000,
            remaining: 1000,
            reset: 1000
        }
    });
}
