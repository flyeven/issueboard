module.exports = {
    organisations: fakeOrganisations,
    repositories: fakeRepositories,
    milestones: fakeMilestones,
    issues: fakeIssues
};

var fakeIssues =             
[{
    number: 1,
    state: "open",
    title: "Fake open issue",
    labels: [],
    body: "This issue is fake",
    comments: 0
},
{
    number: 2,
    state: "closed",
    title: "Fake closed issue",
    labels: [],
    body: "This issue is fake",
    comments: 0
}];

var fakeOrganisations = 
[{
    name: "Fake Organisation 1",
    avatar_url: "" 
}];

var fakeRepositories = 
[{
    name: "Fake Repo 1",
    description: "Some REPO",
    issue: 1223
}];

var fakeMilestones = 
[{
    number: 1,
    state: "open",
    title: "Milestone 1",
    description: "Fake milestone number 1",
    open_issues: 10,
    closed_issues: 20
},
{
    number: 2,
    state: "closed",
    title: "Milestone 2",
    description: "Fake milestone number 2",
    open_issues: 0,
    closed_issues: 12
},
{
    number: 3,
    state: "open",
    title: "Milestone 3",
    description: "Fake milestone number 3",
    open_issues: 15,
    closed_issues: 0
}];