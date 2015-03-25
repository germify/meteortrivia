Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading',
  notFoundTemplate: '404',
  waitOn: function() { return [
      Meteor.subscribe('questions'),
      Meteor.subscribe('userAnswers')
  ]}
});
Router.route('/', {name: 'home'});
Router.route('/submit', {name: 'submit'});
Router.route('/results', {name: 'results'});
Router.route('/admin', {name: 'admin'});
Router.route('/setup', {name: 'setup'});
Router.route('/play', {
    name: 'play',
    data: function() {
        var firstRecord = Questions.find({active: true}, {sort: {createdAt: 1}, limit: 1}).fetch();
        if (firstRecord.length > 0) {
            Meteor.call('removeAllAnswers');
            Router.go('question', {_id: firstRecord[0]._id});
        } else {
            Router.go('setup');
        }
    }
});
Router.route('/q/:_id', {
    name: 'question',
    data: function() { return Questions.findOne(this.params._id); }
});
Router.route('/edit/:_id', {
    name: 'edit',
    data: function() { return Questions.findOne(this.params._id); }
});