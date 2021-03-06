var ColorPicker = require('react-color');

const lifxColors = ["red", "orange", "yellow", "cyan", "green", "blue", "purple", "pink", "white"];

var Main = React.createClass({
    getInitialState() {
        return {
            token: localStorage.getItem('lifxToken'),
            items: {},
            color: this.props.initialColor
        }
    },
    componentDidMount() {
        if (this.state.token) {
            this.getLights()
        }
    },
    getLights() {
        this.ajax("/lights/all", 'get', function(data) {
            for (var i=0;i<data.length;i++) {
                var light = data[i]
                var selector = "id:" + light.id
                this.state.items[selector] = {
                    selector: selector,
                    name: light.label,
                    power: light.power,
                    hue: light.color.hue,
                    saturation: light.color.saturation,
                    brightness: light.brightness
                }
            }
            this.setState({items: this.state.items})
        }.bind(this))
    },
    ajax(path, method, cb) {
        var tok = this.state.token
        $.ajax({
            url: "https://api.lifx.com/v1" + path,
            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + tok)},
            success: cb,
            method: method
        })
    },
    refresh() {
        this.getLights()
    },
    tokenFormSubmit(e) {
        e.preventDefault()
        var token = this.refs.tokenInput.value
        localStorage.setItem('lifxToken', token)
        this.setState({token: token})
        this.getLights()
    },
    nullToken() {
        this.setState({token: null})
    },
    togglePower(selector) {
        this.ajax(
            `/lights/${selector}/toggle`,
            'post',
            function(data) {
                var item = this.state.items[selector]
                if (item.power == "on") {
                    item.power = "off"
                } else {
                    item.power = "on"
                }
                this.state.items[selector] = item
                this.setState({items: this.state.items})
            }.bind(this)
        )
    },
    colorFormSubmit(selector, color) {
        var tok = this.state.token
        $.ajax({
            url: `https://api.lifx.com/v1/lights/${selector}/state`,
            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + tok)},
            method: 'PUT',
            data: {
             color: `${color}`,
             },
                success: function(data) {
                  // do stuff
             }.bind(this)
            })

    },
    renderColorButton(color, key) {
        return (
            <button
                className={"btn btn-default " + color}
                onClick={this.colorFormSubmit.bind(this, key, color)} >
            </button>
        )
    },
    handleColorChange(color) {
        const colors = [...this.state.colors]
        colors[this.state.selected] = color
        this.setState({ colors })
    },
    renderLight(key) {
        var light = this.state.items[key]
        console.log(light.selector)
        return (
            <div key={light.selector} 
                className={"panel panel-default " + light.power}
            >
                <div className="panel-body">
                    <p>{light.name}</p>
                    <button 
                        className="btn btn-default" 
                        onClick={this.togglePower.bind(this, key)}>
                        <i className="fa fa-power-off"></i>
                    </button>
                    {lifxColors.map(function(color) {return this.renderColorButton(color, key)}.bind(this)) }
                    </div>     
            </div>
        )
    },
    render() {
        var title, form
        if (!this.state.token) {
            title = "Enter your auth token:"
            form = (
                <form onSubmit={this.tokenFormSubmit}>
                    <input type="text" className="form-control" ref="tokenInput" />
                    <button className="btn btn-default">Save</button>
                </form>                
            )
        } else {
            title = "Auth Token:"            
            var tok = "********" + this.state.token.substr(this.state.token.length - 5)
            form = (
                <div>
                    <span className="token">{tok} </span>
                    <a href="#" onClick={this.nullToken}>change</a>
                </div>
            )
        }
        return (
            <div>
            <div className="center icon">
                <i className="fa fa-2x fa-lightbulb-o"> </i>
            </div>
            <div className="row">
                <div className="col-md-6 col-md-offset-3 lights">
                    <button className="btn btn-default refresh" onClick={this.refresh}>
                        <i className="fa fa-refresh"></i>
                    </button>
                    <div className="">
                        {Object.keys(this.state.items).map(this.renderLight)}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 col-md-offset-3">
                    <div className="panel panel-default token-panel">
                        <div className="panel-heading">
                            <div className="panel-title">
                                {title}
                            </div>
                        </div>
                        <div className="panel-body">
                            {form}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
})

module.exports = Main;