import React from 'react'
import { Link } from 'react-router'

export default class Team extends React.Component {
    constructor(props) {
        super(props);
        // this. _handleClick = this. _handleClick.bind(this);
        this.state = {
            uniqueid: null,
            team: null,
            games: [],
            upcoming_games: [],
            rosters: []
        };
    }

    componentWillMount() {
        var uniqueid = this.props.params.uniqueid
        this.setState({uniqueid: uniqueid});

        const teams = TAFFY(this.props.route.teams)
        const team = teams({uniqueid: uniqueid}).first();

        var url = api_host + 'teamadds/' + team.teamadd_id;

        $('#js-loading').show();
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // console.log(data)
                this.setState({team: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });

        url = api_host + 'teamadds/' + team.teamadd_id + '/games';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#js-loading').hide();
                // console.log(data)
                this.setState({games: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });

        url = api_host + 'teamadds/' + team.teamadd_id + '/games';
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                upcoming: 5
            },
            dataType: 'json',
            success: function (data) {
                $('#js-loading').hide();
                // console.log(data)
                this.setState({upcoming_games: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });

        url = api_host + 'teamadds/' + team.teamadd_id + '/rosters';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#js-loading').hide();
                // console.log(data)
                this.setState({rosters: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    componentWillReceiveProps(nextProps) {
        var uniqueid = nextProps.routeParams.uniqueid  //change url param (same route)
        if (uniqueid != this.state.uniqueid) {
            this.setState({uniqueid: uniqueid})

            const teams = TAFFY(this.props.route.teams)
            const team = teams({uniqueid: uniqueid}).first();

            var url = api_host + 'teamadds/' + team.teamadd_id;

            $('#js-loading').show();
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    // console.log(data)
                    this.setState({team: data});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });

            url = api_host + 'teamadds/' + team.teamadd_id + '/games';
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    $('#js-loading').hide();
                    // console.log(data)
                    this.setState({games: data});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });

            url = api_host + 'teamadds/' + team.teamadd_id + '/games';
            $.ajax({
                url: url,
                type: 'GET',
                data: {
                    upcoming: 5
                },
                dataType: 'json',
                success: function (data) {
                    $('#js-loading').hide();
                    // console.log(data)
                    this.setState({upcoming_games: data});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });

            url = api_host + 'teamadds/' + team.teamadd_id + '/rosters';
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    $('#js-loading').hide();
                    // console.log(data)
                    this.setState({rosters: data});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });
        }
    }

    render() {
        const team = this.state.team;
        const upcoming_games = this.state.upcoming_games;
        const games = this.state.games;
        const rosters = this.state.rosters;
        console.log(rosters);
        // const posts = TAFFY(this.props.route.data.posts)
        // const category_posts = posts({category_id: category.id}).get()

        if (!team)
            return (
                <div></div>
            )

        const teams = TAFFY(this.props.route.teams)

        return (
            <div id="container" className="body-site">
                {/*Teamadd ID: 254 Team ID: 96 Team: Taiwan Season: 2016*/}
                <div className="block player">
                    <div className="container">
                        <div className="spacing100"/>
                        <div className="spacing20"/>
                        <h2>{team.name_alt}</h2>
                        <div className="cover">
                            <div style={{paddingTop: 30, paddingBottom: 30}} className="row">
                                <div className="col-lg-3 col-md-3 col-xs-6 info">
                                    <div className="spacing40"/>
                                    <h1>{team.name}</h1>
                                    <h3 style={{color: '#000'}}>{team.name}</h3>
                                </div>
                                <div className="col-lg-3 col-md-3 col-xs-6 info">
                                    <div className="spacing40"/>
                                    <h1><span className="text-blue">{team.win_count} - {team.loss_count}</span></h1>
                                    <p><strong>Avg PPG：</strong>TBD</p>
                                    <p><strong>Avg RPG：</strong>TBD</p>
                                    <p><strong>Avg APG：</strong>TBD</p>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                    <div className="row">
                                        <div className="col-md-4 col-lg-4 col-xs-4" style={{padding: 10}}>
                                            <div className="introduce" style={{textAlign: 'center'}}>
                                                <h3>-<span>PPG</span></h3>
                                            </div>
                                            <div style={{borderTop: '4px solid #3766c7'}}/>
                                            <div style={{border: '1px solid #ccc'}}>
                                                <h4 style={{textAlign: 'center', paddingTop: 10}}><b>得分最高</b></h4>
                                                    <img className="img-responsive"
                                                         src="/assets/images/avatar_big.png"/>
                                                <p style={{textAlign: 'center'}}>
                                                    TBD
                                                    <br /> #TBD
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-lg-4 col-xs-4" style={{padding: 10}}>
                                            <div className="introduce" style={{textAlign: 'center'}}>
                                                <h3>-<span>RPG</span></h3>
                                            </div>
                                            <div style={{borderTop: '4px solid #3766c7'}}/>
                                            <div style={{border: '1px solid #ccc'}}>
                                                <h4 style={{textAlign: 'center', paddingTop: 10}}><b>籃板最多</b></h4>
                                                    <img className="img-responsive"
                                                         src="/assets/images/avatar_big.png"/>
                                                <p style={{textAlign: 'center'}}>
                                                    TBD
                                                    <br /> #TBD
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-lg-4 col-xs-4" style={{padding: 10}}>
                                            <div className="introduce" style={{textAlign: 'center'}}>
                                                <h3>-<span>APG</span></h3>
                                            </div>
                                            <div style={{borderTop: '4px solid #3766c7'}}/>
                                            <div style={{border: '1px solid #ccc'}}>
                                                <h4 style={{textAlign: 'center', paddingTop: 10}}><b>助攻最多</b></h4>
                                                    <img className="img-responsive"
                                                         src="/assets/images/avatar_big.png"/>
                                                <p style={{textAlign: 'center'}}>
                                                    TBD
                                                    <br /> #TBD
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="block">
                    <div className="schedule" style={{background: '#fff'}}>
                        <div className="container">
                            <h2>近期賽事</h2>
                            <div className="spacing40"/>
                            <ul className="list-schedule">
                                {upcoming_games.map((game, index) => (
                                    <li className="active" key={index}>
                                        <div className="item">
                                            <p className="date">{game.date}</p>
                                            <ul>
                                                <li className="one">
                                                    <p className="logo-team">
                                                        <Link to={`/team/${teams({teamadd_id: game.home_teamadd_id}).first().uniqueid}`}>
                                                            <img src={game.home_logo} width={50} height={50} style={{border: '0px solid #ccc'}}/>
                                                        </Link>
                                                    </p>
                                                    <p className="name-team">{game.home_team}</p>
                                                </li>
                                                <li className="second">
                                                    <p className="logo-team">
                                                        <Link to={`/team/${teams({teamadd_id: game.away_teamadd_id}).first().uniqueid}`}>
                                                            <img src={game.away_logo} width={50} height={50} style={{border: '0px solid #ccc'}}/>
                                                        </Link>
                                                    </p>
                                                    <p className="name-team">{game.away_team}</p>
                                                </li>
                                                <li className="label">{game.time.substring(0, game.time.length - 3)} CST</li>
                                            </ul>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="block table-stat t-last">
                    <div className="container">
                        <h2>2016 陣容</h2>
                        <div className="spacing40"/>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>姓名</th>
                                    <th>位置</th>
                                    <th>身高 (cm)</th>
                                    <th>體重 (kg)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rosters.map((roster, index) => (
                                    <tr key={index}>
                                        <td style={{padding: '0px 5px 0 5px'}}>{roster.jersey}</td>
                                        <td style={{padding: '0px 5px 0 5px'}}><Link to={`/player/${roster.id}`}>{roster.player_name} / {roster.player_name_alt}</Link></td>
                                        <td style={{padding: '0px 5px 0 5px'}}>{roster.position}</td>
                                        <td style={{padding: '0px 5px 0 5px'}}>{roster.height}</td>
                                        <td style={{padding: '0px 5px 0 5px'}}>{roster.weight}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="spacing40"/>
                    </div>
                </div>
                <div className="block table-stat t-last">
                    <div className="container">
                        <h2>比賽結果</h2>
                        <div className="spacing40"/>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>日期</th>
                                    <th>時間</th>
                                    <th>地點</th>
                                    <th>對手</th>
                                    <th>得分</th>
                                </tr>
                                </thead>
                                <tbody>
                                {games.map((game, index) => (
                                    <tr key={index}>
                                        <td>{game.date}</td>
										<td>{game.time.substring(0, game.time.length - 3)} CST</td>
                                        <td>{game.location}</td>
                                        <td>{game.name}</td>
										<td><Link to={`/game/${game.id}`}>{game.score_home} - {game.score_away}</Link></td>
                                        {/*<td><a target="_blank" href="#">Detail</a></td>*/}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="spacing40"/>
                    </div>
                </div>
            </div>
        )
    }
}
