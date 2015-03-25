Meteor.publish(null, function () {
    return Meteor.users.find({});
});

Meteor.publish(null, function() {
    return Meteor.roles.find({});
});

Meteor.publish("questions", function() {
	return Questions.find({});
});

Meteor.publish("userAnswers", function() {
	return UserAnswers.find({});
});