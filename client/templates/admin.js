Template.admin.helpers({
    adminOnly: function() {
        if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
            Router.go('home');
        }
    },
    questions: function() {
        return Questions.find({}, {sort: {createdAt: -1}});
    },
    questionCount: function() {
        return Questions.find({}).count();
    },
    users: function() {
        return Meteor.users.find({}, {sort: {createdAt: -1}});
    },
    userCount: function() {
        return Meteor.users.find({}).count();
    },
    questionMoment: function() {
        var currentQuestion = Questions.findOne(this._id);
        var date = currentQuestion.createdAt;
        var user = Meteor.users.findOne(this.userId);
        return "Submitted by "+user.username+" "+moment(new Date(date)).fromNow();
    },
    userMoment: function() {
        var currentUser = Meteor.users.findOne(this._id);
        var date = currentUser.createdAt;
        return moment(new Date(date)).fromNow();
    }
});

Template.admin.events({
    "click .deleteUser": function() {
        var user = Meteor.users.findOne(this._id);
        var dialog = confirm('Are you sure you want to delete ' + user.username);
        if (dialog) {
            Meteor.users.remove({_id: this._id});
        }
    },
    "click .deleteQuestion": function() {
        var question = Questions.findOne(this._id);
        var msg = "this question";
        if (question.question !== "") {
            msg = '"' + question.question + '"';
        }
        var dialog = confirm('Are you sure you want to delete ' + msg);
        if (dialog) {
            Questions.remove({_id: this._id});
        }
    },
    "click .active": function (e) {
        Questions.update({_id: this._id}, {
            $set: {
                active: true
            }
        });
    },
    "click .inactive": function (e) {
        Questions.update({_id: this._id}, {
            $set: {
                active: false
            }
        });
    }
});