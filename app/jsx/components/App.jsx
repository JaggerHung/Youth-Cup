import React from 'react'
// import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Loading from './Loading.jsx'
import Navbar from './Navbar.jsx'
import Stats from './Stats.jsx'


export default class App extends React.Component {
    
    constructor(props) {
        super(props);
        // this._handleClick = this._handleClick.bind(this);
        this.state = {
            loading: false,
            locale: 'zh'
        };
        this.changeLocale = this.changeLocale.bind(this);
    }

    componentDidMount() {
        // var $this = $(ReactDOM.findDOMNode(this));
    }

    /*_toggleLoading() {
        console.log('-------------------------')
        console.log('toogle loading')
        if (this.state.loading) {
            console.log('set false');
            this.setState({loading: false});
        }
        else {
            console.log('set true');
            this.setState({loading: true});
        }
    }*/
    
    changeLocale(){
        if(this.state.locale == 'zh'){
            this.setState({locale: 'en'});
        }else{
            this.setState({locale: 'zh'});
        }
    }
    
    render() {
        var locale = this.state.locale;
        // console.log('aaa')
        // console.log(this.props.location.pathname)
        // console.log(this.props.routes[0].path)
        // console.log(this.props.children.type.name)
        // console.log(this.props.children.props)
            return (
                // <input type="text" value={this.state.name} name="greeted" onChange={this.handleChange} />
                <div id="wrapper">
                    <Navbar changeLocale={this.changeLocale} locale={locale}/>
                    {React.cloneElement(this.props.children, {locale: locale})}
                    {/*React.cloneElement(this.props.children, {toggleLoading: this._toggleLoading.bind(this)})*/}
                    <Loading />
                </div>
            )
    }
}
