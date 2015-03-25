Template.main.helpers({
    // display signin message if user is not signed in
    welcome: function() {
        var msg = "";
        if (!Meteor.userId()) {
            msg = '<h1 class="instruction-login">Please login to play</h1>'
        }
        return msg;
    }
});

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
        return moment(new Date(date)).fromNow();
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

Template.submit.helpers({
    questionMoment: function() {
        var currentQuestion = Questions.findOne(this._id);
        var date = currentQuestion.createdAt;
        return moment(new Date(date)).fromNow();
    },
    questions: function() {
        return Questions.find({userId: Meteor.userId()}, {sort: {createdAt: -1}});
    },
    answers: function() {
        var self = this;
        self.answers = self.answers || [];
        return _.map(self.answers, function (value, index) {
            return {text: value.text, isAnswer: value.isAnswer, index: index};
        });
    },
    addAnswers: function() {
        var addAnswers = [
            {index: 0, text: "", isAnswer: false, placeholder: "Enter your first answer..."},
            {index: 1, text: "", isAnswer: false, placeholder: "Enter your second answer..."},
            {index: 2, text: "", isAnswer: false, placeholder: "Enter your third answer..."},
            {index: 3, text: "", isAnswer: false, placeholder: "Enter your forth answer..."}
        ];
        return addAnswers;
    },
    answerIsChecked: function() {
        if (this.isAnswer) {
            return "checked";
        }
    }
});

Template.submit.events({
    "submit .submit-question": function (e) {
        // This function is called when the question submission form is submitted
        var validated = true;
        var question = e.target.question.value;
        var answer0 = e.target.answer0.value;
        var answer1 = e.target.answer1.value;
        var answer2 = e.target.answer2.value;
        var answer3 = e.target.answer3.value;

        // Indicating which answer is correct
        var isAnswer0 = false;
        var isAnswer1 = false;
        var isAnswer2 = false;
        var isAnswer3 = false;

        if ($('#isAnswer0').is(':checked')) {
            isAnswer0 = true;
        }
        if ($('#isAnswer1').is(':checked')) {
            isAnswer1 = true;
        }
        if ($('#isAnswer2').is(':checked')) {
            isAnswer2 = true;
        }
        if ($('#isAnswer3').is(':checked')) {
            isAnswer3 = true;
        }

        if (question === "") {
            $("#questionMSG").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>Enter a question</div>');
            validated = false;
        } else {
            $("#questionMSG").html("");
        }
        if (answer0 === "" || answer1 === "" || answer2 === "" || answer3 === "") {
            $("#answerMSG").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>Enter all possible answers</div>');
            validated = false;
        } else {
            $("#answerMSG").html("");
        }
        if (!isAnswer0 && !isAnswer1 && !isAnswer2 && !isAnswer3) {
            $("#isAnswersMSG").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>Select the correct answer</div>');
            validated = false;
        } else {
            $("#isAnswersMSG").html("");
        }

        // make sure question has ?
        if (question.slice(-1) !== "?") {
            question = question + "?";
        }

        // go if validated
        if (validated) {
            //insert user submitted questions into the database
            Questions.insert({
                question: question,
                answers: [
                    {text: answer0, isAnswer: isAnswer0},
                    {text: answer1, isAnswer: isAnswer1},
                    {text: answer2, isAnswer: isAnswer2},
                    {text: answer3, isAnswer: isAnswer3}
                ],
                createdAt: new Date(),
                userId: Meteor.userId(),
                active: false
            });

            // display confirmation
            $("#thanksMSG").html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>Thanks for submitting your question</div>');
            $('.submit-question')[0].reset();
        }

        // Prevent default form submit
        return false;
    }
});

Template.question.helpers({
    // special code that allows us to include ans index. we must manually map all values that are needed
    answers: function() {
        var self = this;
        self.answers = self.answers || [];
        // value holds answer info: text, isAnswer
        return _.map(self.answers, function (value, index) {
            return {text: value.text, isAnswer: value.isAnswer, index: index};
        });
    },
    nextButton: function() {
        // make sure we find a valid question
        if (typeof this._id === "undefined") {
            // if not a valid question the redirect
            Router.go('home');
        } else {
            // get current question
            var currentQuestion = Questions.findOne(this._id);
            // get next question
            var nextRecord = Questions.find(
                {
                    active: true,
                    createdAt: {$gt: currentQuestion.createdAt}
                },
                {
                    sort: {createdAt: -1},
                    limit: 1
                }
            ).fetch();
            var buttonText = "Next Question";
            if (nextRecord.length === 0) {
                buttonText = "View Results";
            }
            return buttonText;
        }
    }
});

Template.question.events({
    "click .answer": function (e) {
        // default answer text and color to incorrect
        var isCorrect = "INCORRECT!";
        var isCorrectColor = "red";
        // get questionId from url
        var baseURL = e.target.baseURI;
        var parts = baseURL.split('/');
        var questionId = parts[parts.length - 1];
        // see if they selected the correct answer
        if (this.isAnswer === true) {
            // find out if user already answered this question
            var questionCount = UserAnswers.find({userId: Meteor.userId(), questionId: questionId}).count();
            // if user has not answered question then insert to show that they have
            if (questionCount === 0) {
                UserAnswers.insert({
                    userId: Meteor.userId(),
                    questionId: questionId,
                    createdAt: new Date()
                });
            }
            // update answer text and color to show correct
            isCorrect = "CORRECT!";
            isCorrectColor = "green";
        }

        // get current question
        var currentQuestion = Questions.findOne(questionId);
        // get current answers
        var currentAnswers = currentQuestion.answers;
        // loop over answers
        for (var i = 0; i < currentAnswers.length; i++) {
            // make the backgound color green for the correct answer
            if (currentAnswers[i].isAnswer === true) {
                $("#answer" + i).css("background-color", "green");
            }
        }

        // display the correct answer text and color
        $(".message").html("<h1 style='color: "+isCorrectColor+"; font-weight: bold; text-align: center;'>"+isCorrect+"</h1>");
        // disable answer button
        $('.answer').addClass('disable');
        $('.answer').removeClass('answer');
        // display message and next button
        $('.message').show();
        $('.nextContainer').show();
    },
    "click #nextButton": function() {
        // Router.go('home'); is undefined here for some reason. use window.location.href below until we can fix
        var currentQuestion = Questions.findOne(this._id);
        var nextQuestion = Questions.find(
            {
                active: true,
                createdAt: {$gt: currentQuestion.createdAt}
            },
            {
                sort: {createdAt: -1},
                limit: 1
            }
        ).fetch();
        if (nextQuestion.length > 0) {
            window.location.href = "/q/"+nextQuestion[0]._id;
            //Router.go('question', {_id: nextQuestion[0]._id});
        } else {
            window.location.href = "/results";
            //Router.go('results');
        }
    }
});

Template.results.helpers({
    results: function() {
        var correctQuestions = UserAnswers.find({userId: Meteor.userId()}).count();
        var allQuestionsAnswers = Questions.find({active: true}).count();
        var percentCorrect = Math.ceil((correctQuestions / allQuestionsAnswers) * 100);
        return "You got " + correctQuestions + " out of " + allQuestionsAnswers + " correct! (" + percentCorrect + "%)";
    }
});