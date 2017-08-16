import React from 'react'
// import NavLink from './NavLink'
import { Link } from 'react-router'

export default class Header extends React.Component {
    render() {
        const teams = TAFFY(this.props.teams)
        const men_teams = teams({type: 'men'}).get()
        const women_teams = teams({type: 'women'}).get()
        
        return (
            <header className="header-site">
                <div className="task-team" style={{position: 'fixed', width: 'inherit'}}>
                    <div className="container">
                        <h1 className="logo">
                            <a href="http://jonescup.choxue.com">
                                <img src="/assets/images/logo.png" />
                            </a>
                        </h1>
                        <nav className="navbar-default">
                            <div className="navbar-header">
                              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu-main" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                              </button>
                            </div>

                         
                            <div className="collapse navbar-collapse" id="menu-main" style={{overflow:'visible'}}>
                              <ul className="nav navbar-nav">
                                <li className="active hidden-xs"><a href="/">首頁</a></li>
                                <li className="active visible-xs" data-toggle="collapse" data-target=".navbar-collapse"><a href="/">首頁</a></li>
                                <li className="dropdown">
                                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">隊伍<span className="caret"></span></a>
                                  <ul className="dropdown-menu">
                                    <li className="dropdown-submenu">
                                        <a href="#" tabindex="-1">男子組</a>
                                         <ul className="dropdown-menu visible-xs">
                                                    {men_teams.map((team, index) => (
                                                        <li key={index} data-toggle="collapse" data-target=".navbar-collapse" className="visible-xs">
                                                            <Link to={`/team/${team.uniqueid}`}>
                                                                {/*<img src="https://choxue.s3-ap-southeast-1.amazonaws.com/images/team/logo/94/profile_thumbnail_cx.59fb9084-8421-4516-b53e-9ce64a667efc.png" width={40} height={40} />*/}
                                                                <span style={{marginLeft: 15}}>{team.name}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                        <ul className="dropdown-menu hidden-xs">
                                                    {men_teams.map((team, index) => (
                                                        <li key={index}>
                                                            <Link to={`/team/${team.uniqueid}`}>
                                                                {/*<img src="https://choxue.s3-ap-southeast-1.amazonaws.com/images/team/logo/94/profile_thumbnail_cx.59fb9084-8421-4516-b53e-9ce64a667efc.png" width={40} height={40} />*/}
                                                                <span style={{marginLeft: 15}}>{team.name}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                    </li>
                                    <li className="divider" />
                                     <li className="dropdown-submenu">
                                        <a href="#" tabindex="-1">女子組</a>
                                         <ul className="dropdown-menu visible-xs">
                                                    {women_teams.map((team, index) => (
                                                        <li key={index} data-toggle="collapse" data-target=".navbar-collapse" className="visible-xs">
                                                            <Link to={`/team/${team.uniqueid}`}>
                                                                {/*<img src="https://choxue.s3-ap-southeast-1.amazonaws.com/images/team/logo/94/profile_thumbnail_cx.59fb9084-8421-4516-b53e-9ce64a667efc.png" width={40} height={40} />*/}
                                                                <span style={{marginLeft: 15}}>{team.name}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                        <ul className="dropdown-menu hidden-xs">
                                                    {women_teams.map((team, index) => (
                                                        <li key={index}>
                                                            <Link to={`/team/${team.uniqueid}`}>
                                                                {/*<img src="https://choxue.s3-ap-southeast-1.amazonaws.com/images/team/logo/94/profile_thumbnail_cx.59fb9084-8421-4516-b53e-9ce64a667efc.png" width={40} height={40} />*/}
                                                                <span style={{marginLeft: 15}}>{team.name}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                    </li>
                                  </ul>
                                </li>
                                <li className="dropdown">
                                     <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">賽程<span className="caret"></span></a>
                                    <ul className="dropdown-menu">
                                        <li className="hidden-xs"><Link to={`/games/men`}>賽程 (男)</Link></li>
                                        <li className="hidden-xs"><Link to={`/games/women`}>賽程 (女)</Link></li>
                                        <li className="visible-xs" data-toggle="collapse" data-target=".navbar-collapse"><Link to={`/games/men`}>賽程 (男)</Link></li>
                                        <li className="visible-xs" data-toggle="collapse" data-target=".navbar-collapse"><Link to={`/games/women`}>賽程 (女)</Link></li>
                                    </ul>
                                </li>
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">數據<span className="caret"></span></a>
                                    <ul className="dropdown-menu">
                                        <li className="hidden-xs"><Link to="/players/men">數據 (男)</Link></li>
                                        {<li className="hidden-xs"><Link to="/players/women">數據 (女)</Link></li>}
                                        <li className="visible-xs" data-toggle="collapse" data-target=".navbar-collapse"><Link to="/players/men">數據 (男)</Link></li>
                                        {<li className="visible-xs" data-toggle="collapse" data-target=".navbar-collapse"><Link to="/players/women">數據 (女)</Link></li>}
                                        </ul>
                                </li>
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">影音<span className="caret"></span></a>
                                    <ul className="dropdown-menu">
                                        <li className="hidden-xs"><Link to="/video">影片</Link></li>
                                        <li className="visible-xs" data-toggle="collapse" data-target=".navbar-collapse"><Link to="/video">影片</Link></li>
                                    </ul>
                                </li>
                              </ul>
                            </div>
       
                        </nav>
                    </div>
                </div>
            </header>
            
        )
    }
}