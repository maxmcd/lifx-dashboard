"use strict";

var Light = React.createClass({
    displayName: "Light",
    render: function render() {
        return null;
    }
});

var Colors = ["red", "orange", "yellow", "cyan", "green", "blue", "purple", "pink", "white"];

var App = React.createClass({
    displayName: "App",
    getInitialState: function getInitialState() {
        return {
            token: localStorage.getItem('lifxToken'),
            items: {}
        };
    },
    componentDidMount: function componentDidMount() {
        if (this.state.token) {
            this.getLights();
        }
    },
    getLights: function getLights() {
        this.ajax("/lights/all", 'get', function (data) {
            for (var i = 0; i < data.length; i++) {
                var light = data[i];
                var selector = "id:" + light.id;
                this.state.items[selector] = {
                    selector: selector,
                    name: light.label,
                    power: light.power
                };
            }
            this.setState({ items: this.state.items });
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
        var token = this.refs.tokenInput.value;
        localStorage.setItem('lifxToken', token);
        this.setState({ token: token });
        this.getLights();
    },
    nullToken: function nullToken() {
        this.setState({ token: null });
    },
    togglePower: function togglePower(selector) {
        this.ajax("/lights/" + selector + "/toggle", 'post', function (data) {
            var item = this.state.items[selector];
            if (item.power == "on") {
                item.power = "off";
            } else {
                item.power = "on";
            }
            this.state.items[selector] = item;
            this.setState({ items: this.state.items });
        }.bind(this));
    },
    colorFormSubmit: function colorFormSubmit(selector, color) {
        var tok = this.state.token;
        $.ajax({
            url: "https://api.lifx.com/v1/lights/" + selector + "/state",
            beforeSend: function beforeSend(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + tok);
            },
            method: 'PUT',
            data: {
                color: "" + color
            },
            success: function (data) {
                // do stuff
            }.bind(this)
        });
    },
    renderColorButton: function renderColorButton(color, key) {
        return React.createElement("button", {
            className: "btn btn-default " + color,
            onClick: this.colorFormSubmit.bind(this, key, color) });
    },
    renderLight: function renderLight(key) {
        var light = this.state.items[key];
        return React.createElement(
            "div",
            { key: light.uuid,
                className: "panel panel-default " + light.power
            },
            React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                    "p",
                    null,
                    light.name
                ),
                React.createElement(
                    "button",
                    {
                        className: "btn btn-default",
                        onClick: this.togglePower.bind(this, key) },
                    React.createElement("i", { className: "fa fa-power-off" })
                ),
                Colors.map(function (color) {
                    return this.renderColorButton(color, key);
                }.bind(this))
            )
        );
    },
    render: function render() {
        var title, form;
        if (!this.state.token) {
            title = "Enter your auth token:";
            form = React.createElement(
                "form",
                { onSubmit: this.tokenFormSubmit },
                React.createElement("input", { type: "text", className: "form-control", ref: "tokenInput" }),
                React.createElement(
                    "button",
                    { className: "btn btn-default" },
                    "Save"
                )
            );
        } else {
            title = "Auth Token:";
            var tok = "********" + this.state.token.substr(this.state.token.length - 5);
            form = React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    { className: "token" },
                    tok,
                    " "
                ),
                React.createElement(
                    "a",
                    { href: "#", onClick: this.nullToken },
                    "change"
                )
            );
        }
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "center icon" },
                React.createElement(
                    "i",
                    { className: "fa fa-2x fa-lightbulb-o" },
                    " "
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-md-6 col-md-offset-3 lights" },
                    React.createElement(
                        "button",
                        { className: "btn btn-default refresh", onClick: this.refresh },
                        React.createElement("i", { className: "fa fa-refresh" })
                    ),
                    React.createElement(
                        "div",
                        { className: "" },
                        Object.keys(this.state.items).map(this.renderLight)
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-md-6 col-md-offset-3" },
                    React.createElement(
                        "div",
                        { className: "panel panel-default token-panel" },
                        React.createElement(
                            "div",
                            { className: "panel-heading" },
                            React.createElement(
                                "div",
                                { className: "panel-title" },
                                title
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "panel-body" },
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