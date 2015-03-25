Template.header.helpers({
    currentRoute: function () {
        var currentRoute = Router.current();
        return currentRoute.route.getName();
    },
    activeIfTemplateIs: function (template) {
        var currentRoute = Router.current();
        return currentRoute && template === currentRoute.route.getName() ? 'active' : '';
    }
});