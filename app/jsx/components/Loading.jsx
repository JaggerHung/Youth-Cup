import React from 'react'

export default class Loading extends React.Component {
    render() {
        return (
            <div id="js-loading" className="loading-screen" style={{display: "none"}}>
                <div className="container">
                    <div className="preloader-spinner loading-spinner"></div>
                    <h1 id="js-loading-message"></h1>
                </div>
            </div>
        )
    }
}