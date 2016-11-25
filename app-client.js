var React = require('react');
var ReactDom=require('react-dom');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var APP = require('./components/APP');
var Panel = require('./components/pannel');
var Whoops404 = require('./components/Whoops404');



// <Route name="user" path="user" handler={User}></Route>
// <Route name="conf" path="conf" handler={Conf}></Route>
var routes = (
	<Route handler={APP}>
        	<DefaultRoute handler={Panel} />
 		      <Route handler={Panel} name="trade" path="trade" />
        	<NotFoundRoute handler={Whoops404} />
	</Route>
);

Router.run(routes, function(Handler) {
  ReactDom.render(<Handler />, document.getElementById('react-container'));
});

