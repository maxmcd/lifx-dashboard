'use strict';

var Light = React.createClass({
    displayName: 'Light',
    render: function render() {
        return null;
    }
});
var App = React.createClass({
    displayName: 'App',
    getInitialState: function getInitialState() {
        return {
            token: localStorage.getItem('lifxToken'),
            lights: []
        };
    },
    componentDidMount: function componentDidMount() {
        if (this.state.token) {
            this.getLights();
        }
    },
    getLights: function getLights() {
        this.ajax("/lights/all", 'get', function (data) {
            this.setState({ lights: data });
        }.bind(this));
    },
    ajax: function ajax(path, method, cb) {
        var tok = this.state.token;
        $.ajax({
            url: "https://api.lifx.com/v1" + path,
            beforeSend: function beforeSend(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + tok);
            },
            success: cb,
            method: method
        });
    },
    refresh: function refresh() {
        this.getLights();
    },
    tokenFormSubmit: function tokenFormSubmit(e) {
        e.preventDefault();
        token = this.refs.tokenInput.value;
        localStorage.setItem('lifxToken', token);
        this.setState({ token: token });
        this.getLights();
    },
    nullToken: function nullToken() {
        this.setState({ token: null });
    },
    togglePower: function togglePower(selector) {
        this.ajax('/lights/' + selector + '/toggle', 'post', function (data) {
            this.getLights();
        }.bind(this));
    },
    renderLight: function renderLight(light) {
        return React.createElement(
            'div',
            { key: light.uuid,
                className: "panel panel-default " + light.power
            },
            React.createElement(
                'div',
                { className: 'panel-body' },
                React.createElement(
                    'p',
                    null,
                    light.label
                ),
                React.createElement(
                    'button',
                    {
                        className: 'btn btn-default',
                        onClick: this.togglePower.bind(this, 'id:' + light.id) },
                    React.createElement('i', { className: 'fa fa-power-off' })
                )
            )
        );
    },
    render: function render() {
        var title, form;
        if (!this.state.token) {
            title = "Enter you auth token:";
            form = React.createElement(
                'form',
                { onSubmit: this.tokenFormSubmit },
                React.createElement('input', { type: 'text', className: 'form-control', ref: 'tokenInput' }),
                React.createElement(
                    'button',
                    { className: 'btn btn-default' },
                    'Save'
                )
            );
        } else {
            title = "Auth Token:";
            var tok = "********" + this.state.token.substr(this.state.token.length - 5);
            form = React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    { className: 'token' },
                    tok,
                    ' '
                ),
                React.createElement(
                    'a',
                    { href: '#', onClick: this.nullToken },
                    'change'
                )
            );
        }
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'center icon' },
                React.createElement(
                    'i',
                    { className: 'fa fa-2x fa-lightbulb-o' },
                    ' '
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-md-6 col-md-offset-3 lights' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-default refresh', onClick: this.refresh },
                        React.createElement('i', { className: 'fa fa-refresh' })
                    ),
                    React.createElement(
                        'div',
                        { className: '' },
                        this.state.lights.map(this.renderLight)
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-md-6 col-md-offset-3' },
                    React.createElement(
                        'div',
                        { className: 'panel panel-default token-panel' },
                        React.createElement(
                            'div',
                            { className: 'panel-heading' },
                            React.createElement(
                                'div',
                                { className: 'panel-title' },
                                title
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'panel-body' },
                            form
                        )
                    )
                )
            )
        );
    }
});
$(function () {
    ReactDOM.render(React.createElement(App, null), $('.container')[0]);
});