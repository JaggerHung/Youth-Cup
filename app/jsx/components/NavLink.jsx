import React from 'react'
import { Link } from 'react-router'

export default class NavLink extends React.Component {
    /*static contextTypes = {
        router: React.PropTypes.object
    };*/ //not working

    render() {
        let isActive = this.context.router.isActive(this.props.to, true);
        let className = isActive ? "active" : "";

        return (
            <li className={className}>
                {/*<Link {...this.props} activeClassName="active"/>*/}
                <Link {...this.props}/>
            </li>
        )
    }
}

NavLink.contextTypes = {
    router: React.PropTypes.object
}

/*export default React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },

    render(){
        console.log(this.context.router.isActive('/foo')); // Now works :)
    }
})*/
