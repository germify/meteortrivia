Meteor.startup(function() {
    Meteor.methods({
        removeAllAnswers: function() {
            return UserAnswers.remove({userId: Meteor.userId()});
        }
    });

    // insert default users/questions if there are none
    if (Meteor.users.find({}).count() === 0) {
        var users = [
            {username: "admin", roles: ['admin']},
            {username: "test", roles: []}
        ];

        _.each(users, function (user) {
            var id;

            // create user
            id = Accounts.createUser({
                username: user.username,
                password: "password"
            });

            // add roles
            if (user.roles.length > 0) {
                Roles.addUsersToRoles(id, user.roles);
            }

            // default question
            if (user.username === "admin" && Questions.find({}).count() === 0) {
                Questions.insert({
                    question: "What movie is the video clip from on the Meteortrivia homepage?",
                    answers: [
                        {text: "When Harry Met Sally", isAnswer: false},
                        {text: "War Games", isAnswer: true},
                        {text: "What About Bob", isAnswer: false},
                        {text: "Star Wars", isAnswer: false}
                    ],
                    createdAt: new Date(),
                    userId: id,
                    active: true
                });
            }
        });
    }
});

Meteor.users.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Meteor.roles.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Questions.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
    //insert: function (userId, user) {
    //    // can only create posts where you are the author
    //    return user.createdBy === userId;
    //}
});

UserAnswers.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});