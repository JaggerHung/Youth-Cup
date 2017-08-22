import React from 'react'
import { Link } from 'react-router'
// import Waypoint from 'react-waypoint'

export default class Navbar extends React.Component {
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(event) {
        let scrollTop = event.srcElement.body.scrollTop;
        let elHeight = document.getElementById('header').clientHeight;
        let nav = document.getElementById('mainNav');
        let btn = document.getElementById('bars');
        let links = document.getElementsByClassName('page-scroll');

        if(scrollTop >= elHeight) {
            addClass(nav, 'nav-change');
            addClass(btn, 'white-btn');
        } else {
            removeClass(nav, 'nav-change');
            removeClass(btn, 'white-btn');
        }

        function hasClass(el, className) {
          if (el.classList)
            return el.classList.contains(className)
          else
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
        }

        function addClass(el, className) {
          if (el.classList)
            el.classList.add(className)
          else if (!hasClass(el, className)) el.className += " " + className
        }

        function removeClass(el, className) {
          if (el.classList)
            el.classList.remove(className)
          else if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
            el.className=el.className.replace(reg, ' ')
          }
        }
    }

    render() {
        const locale = this.props.locale;
        var zh = false;
        if(locale == 'zh'){
            zh = true;
        }
        else{
            zh = false;
        }
        return (
            <div className="navbarBlack" id="header">
                <nav id="mainNav" className="navbar navbar-default navbar-fixed-top affix-top">
                    <div className="container-fluid">

                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                    <i id="bars" className="fa fa-bars"></i>
                            </button>
                            <div className="logo-container">
                              {/*<img className="logo" src="#"/>*/}
                              <h3 className="textLogo">青年盃</h3>
                            </div>
                        </div>
                        <div className="collapse navbar-collapse" id="menu">
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <a className="page-scroll" href="/">{zh ? '主頁' : 'Index'}</a>
                                </li>
                                <li>
                                    <a className="page-scroll" href="/#schedule_youth">{zh ? '賽程' : ''}</a>
                                </li>
                                <li>
                                    <a className="page-scroll" href="/#live">{zh ? '直播' : ''}</a>
                                </li>
                                <li>
                                    <a className="page-scroll" href="/#schedule_m">{zh ? '戰績' : ''}</a>
                                </li>
                                {/*<li>
                                    <a className="page-scroll" href="#" onClick={this.props.changeLocale}>{zh ? 'English' : '中文'}</a>
                                </li>
                                <li>
                                    <a className="page-scroll" href="/#schedule_m">賽程 - 男</a>
                                </li>
                                <li>
                                    <a className="page-scroll" href="/#schedule_f">賽程 - 女</a>
                                </li>*/}
                            </ul>
                        </div>
                    </div>
                </nav>
            <header id="mainHead">
                    <div className="container">
                        <div className='row' id='hls-player-container'>


                        </div>
                    </div>
                </header>

            </div>

        )
    }
}
