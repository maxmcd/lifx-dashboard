
const Light = React.createClass({
    render() {
        return null
    }
})
const App = React.createClass({
    getInitialState() {
        return {
            token: localStorage.getItem('lifxToken'),
            lights: [],
        }
    },
    componentDidMount() {
        if (this.state.token) {
            this.getLights()
        }
    },
    getLights() {
        this.ajax("/lights/all", 'get', function(data) {
            this.setState({lights: data})
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
        token = this.refs.tokenInput.value
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
                this.getLights()
            }.bind(this)
        )
    },
    renderLight(light) {
        return (
            <div key={light.uuid} 
                className={"panel panel-default " + light.power}
            >
                <div className="panel-body">
                    <p>{light.label}</p>
                    <button 
                        className="btn btn-default" 
                        onClick={this.togglePower.bind(this, 'id:'+light.id)}>
                        <i className="fa fa-power-off"></i>
                    </button>
                </div>
            </div>
        )
    },
    render() {
        var title, form
        if (!this.state.token) {
            title = "Enter you auth token:"
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
                        {this.state.lights.map(this.renderLight)}
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
$(function() {
    ReactDOM.render(<App />, $('.container')[0])
})