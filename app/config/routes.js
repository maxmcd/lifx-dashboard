var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var hashHistory = ReactRouter.hashHistory;
var Main = require('../components/Main');

var routes = (
<Router>
	<Route path='/' component={Main}>
		<IndexRoute path='/home' component={Main} />
	</Route>

</Router>
	)

module.exports = routes;