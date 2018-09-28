'use strict'

const validIssueStatus = {
	New: true,
	Open: true,
	Assigned: true,
	Fixed: true,
	Verified: true,
	Closed: true
};

const issueFieldType = {
	status: 'required',
	owner: 'required',
	effort: 'optional',
	created: 'required',
	completionDate: 'optional',
	title: 'required'
}

// function validateIssue(issue) {
// 	for (const field in issueFieldType) {
// 		const type = issueFieldType[field];
// 		if(!type){
// 			delete issue[field];
// 		}else if(type === 'required' && !issue[field]){
// 			return `${field} is required.`;
// 		}
// 	}
// 	if(!validIssueStatus[issue.status])
// 		return `${issue.status} is not a valid status.`;
// 	return null;
// }

function cleanupIssue(issue) {
	const cleandedUpIssue = {};
	Object.keys(issue).forEach(field => {
		if (issueFieldType[field]) cleandedUpIssue[field] = issue[field];
	});
	return cleanupIssue;
}

function validateIssue(issue){
	const errors = [];
	Object.keys(issueFieldType).forEach(field => {
		if(issueFieldType[field] === 'required' && !issue[field]) {
			errors.push(`Missing mandatory field: ${field}`);
		}
	});

	if(!validIssueStatus[issue.status]){
		errors.push(`${issueFieldType.status} is not a valid status`);
	}

	return (errors.length ? errors.join('; '): null);
}

export default {
	validateIssue,
	cleanupIssue
};