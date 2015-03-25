Template.question.helpers({
    answers: function() {
        // if not a valid question the redirect
        if (typeof this._id === "undefined") {
            Router.go('home');
        }
        // special code that allows us to include an index. we must manually map all values that are needed
        var self = this;
        self.answers = self.answers || [];
        // value holds answer info: text, isAnswer
        return _.map(self.answers, function (value, index) {
            return {text: value.text, isAnswer: value.isAnswer, index: index};
        });
    }
});

Template.question.events({
    "click .answer": function(e) {
        // default next button text to view results
        var nextButtonText = 'View Results';

        // get questionId from url
        var baseURL = e.target.baseURI;
        var parts = baseURL.split('/');
        var questionId = parts[parts.length - 1];

        // get current and next question if there is one
        var currentQuestion = Questions.findOne(questionId);
        var nextQuestion = Questions.find({active: true, createdAt: {$gt: currentQuestion.createdAt}}, {sort: {createdAt: 1}, limit: 1}).fetch();

        // update next button text to next question
        if (nextQuestion.length > 0) {
            nextButtonText = 'Next Question';
        }
        var nextButton = '<a href="#" id="nextButton" class="btn btn-warning" role="button">'+nextButtonText+'</a>';

        // default answer text and color to incorrect
        var isCorrect = "INCORRECT!";
        var isCorrectColor = "red";

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

        // get current answers
        var currentAnswers = currentQuestion.answers;
        // loop over answers
        for (var i = 0; i < currentAnswers.length; i++) {
            // make the backgound color green for the correct answer
            if (currentAnswers[i].isAnswer === true) {
                $("#answer" + i).css("background-color", "green");
            }
        }

        // display message
        var message = $(".message");
        message.html("<h1 style='color: "+isCorrectColor+"; font-weight: bold; text-align: center;'>"+isCorrect+"</h1>");
        message.show();
        // display next button
        var nextContainer = $('.nextContainer');
        nextContainer.html(nextButton);
        nextContainer.show();
        // disable answer button
        var answer = $('.answer');
        answer.removeClass('answer');
        answer.addClass('disable');
    },
    "click #nextButton": function() {
        //alert(Router.current().route.getName());
        //console.log(Router.current());
        //Router.go('setup');

        // Router.go('home'); is undefined here for some reason. use window.location.href below until we can fix
        var currentQuestion = Questions.findOne(this._id);
        var nextQuestion = Questions.find({active: true, createdAt: {$gt: currentQuestion.createdAt}}, {sort: {createdAt: 1}, limit: 1}).fetch();
        if (nextQuestion.length > 0) {
            window.location.href = "/q/"+nextQuestion[0]._id;
            //Router.go('question', {_id: nextQuestion[0]._id});
        } else {
            window.location.href = "/results";
            //Router.go('results');
        }
    }
});