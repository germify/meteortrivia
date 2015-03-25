Template.results.helpers({
    results: function() {
        var correctQuestions = UserAnswers.find({userId: Meteor.userId()}).count();
        var allQuestionsAnswers = Questions.find({active: true}).count();
        var percentCorrect = Math.ceil((correctQuestions / allQuestionsAnswers) * 100);
        return "You got " + correctQuestions + " out of " + allQuestionsAnswers + " correct! (" + percentCorrect + "%)";
    }
});