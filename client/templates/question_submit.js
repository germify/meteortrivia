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