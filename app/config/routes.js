var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var hashHistory = ReactRouter.hashHistory;
var Main = require('../components/Main');

var routes = (
<Router history={hashHistory}>
	<Route path='/' component={Main}>
		<IndexRoute component={Main} />
	</Route>

</Router>
	)

module.exports = routes;