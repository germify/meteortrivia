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