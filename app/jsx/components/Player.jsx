import React from 'react'
import {Link} from 'react-router'

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        // this. _handleClick = this. _handleClick.bind(this);
        this.state = {
            id: null,
            player: null,
            games: []
        };
    }

    componentWillMount() {
        var id = this.props.params.id
        this.setState({id: id});

        var url = api_host + 'rosters/' + id;

        $('#js-loading').show();
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#js-loading').hide();
                // console.log(data)
                this.setState({player: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    timePlayed(time) {
        var mins = "";
        var hrs, secs;
        if (time / 3600 < 10) {
            hrs = "0" + Math.round(time / 3600);
        } else {
            hrs = Math.round(time / 3600);
        }
        if ((time % 3600) / 60 < 10) {
            mins = "0" + Math.round((time % 3600) / 60);
        } else {
            mins = Math.round((time % 3600) / 60);
        }
        if (time % 216000 < 10) {
            secs = "0" + time % 216000;
        } else {
            secs = time % 216000;
        }
        return mins;
    }

    avgTimePlayed(time) {
        var mins = ""
        mins = Math.round(time * 10 / 60) / 10;
        return mins;
    }

    percent(made, attempts) {
        if (made + attempts > 0) {
            return (Math.round(made * 10000 / (made + attempts))) / 100;
        }
        else {
            return 0;
        }
    }

    average(num, den) {
        if (den <= 0) {
            return 0;
        } else {
            return Math.round(num * 100 / den) / 100;
        }
    }

    componentWillReceiveProps(nextProps) {
        var id = nextProps.routeParams.id  //change url param (same route)
        if (id != this.state.id) {
            this.setState({id: id})

            var url = api_host + 'rosters/' + id;

            $('#js-loading').show();
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    $('#js-loading').hide();
                    // console.log(data)
                    this.setState({player: player});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });
        }
    }

    render() {
        const player = this.state.player

        if (!player)
            return (
                <div></div>
            )
        var profile_pic = ''
        if (player.player_profile) {
            profile_pic = player.player_profile
        }
        else {
            profile_pic = "/assets/images/avatar.png"
        }
        const teams = TAFFY(this.props.route.teams)
        const team = teams({team_id: player.team_id}).first();
        var birthday = "";
        if (player.birthday) {
            birthday = player.birthday;
        }
        else {
            birthday = "----------";
        }
        return (
            <div id="container" className="body-site">
                <div className="block player">
                    <div className="container">
                        <div className="spacing100"/>
                        {/*<div className="cover" style={{background: 'url("#") no-repeat center left'}}>*/}
                        <div className="cover">
                            <div className="spacing100"/>
                            <h2>{player.player_name_alt}</h2>
                            <div className="spacing40"/>
                            <div className="spacing40"/>
                            <div className="row">
                                <div className="col-lg-4 col-md-4 avatar">
                                    <img src={profile_pic} width={250} height={250}/>
                                </div>
                                <div className="col-lg-3 col-md-3 info">
                                    <h1><span className="text-blue">{player.jersey}</span> {player.player_name}</h1>
                                    <h3>{player.position} - <Link
                                        to={`/team/${team.uniqueid}`}>{player.team_name}</Link></h3>
                                    <p><strong>生 日：</strong>{birthday}</p>
                                    <p><strong>身 高：</strong>{player.height} <strong>公分</strong></p>
                                    <p><strong>體 重：</strong>{player.weight} <strong>公斤</strong></p>
                                </div>
                                <div className="col-lg-5 col-md-5 introduce">
                                    <div className="spacing40"/>
                                    <div className="spacing40"/>
                                    <br />
                                    <br />
                                    <h3>
                                        <span>PTS</span>{player.season_avgs.points}
                                        <span>REB</span>{player.season_avgs.reb}
                                        <span>AST</span>{player.season_avgs.ast}
                                    </h3>
                                </div>
                            </div>
                            <div className="hr-blue"/>
                        </div>
                    </div>
                </div>
                <div className="block table-stat t-last">
                    <div className="spacing60"/>
                    <div className="container">
                        <h2>SEASON AVGS</h2>
                        <div className="spacing40"/>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>聯盟</th>
                                    <th>Year</th>
                                    <th>隊伍</th>
                                    <th>GP</th>
                                    <th>時間</th>
                                    <th>二分</th>
                                    <th>三分</th>
                                    <th>罰球</th>
                                    <th>投籃</th>
                                    <th>籃板</th>
                                    <th>助攻</th>
                                    <th>失誤</th>
                                    <th>抄截</th>
                                    <th>阻攻</th>
                                    <th>得分</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{player.league}</td>
                                    <td>{player.season}</td>
                                    <td>{player.team_name}</td>
                                    <td>{player.season_avgs.gp}</td>
                                    <td>{this.avgTimePlayed(player.season_avgs.seconds)}</td>
                                    <td>{this.average(player.season_avgs.two_m, player.season_avgs.gp)}
                                        ({this.percent(player.season_avgs.two_m, player.season_avgs.two_a)}%)
                                    </td>
                                    <td>{this.average(player.season_avgs.trey_m, player.season_avgs.gp)}
                                        ({this.percent(player.season_avgs.trey_m, player.season_avgs.trey_a)}%)
                                    </td>
                                    <td>{this.average(player.season_avgs.ft_m, player.season_avgs.gp)}
                                        ({this.percent(player.season_avgs.ft_m, player.season_avgs.ft_a)}%)
                                    </td>
                                    <td>{this.average(player.season_avgs.fg_m, player.season_avgs.gp)}
                                        ({this.percent(player.season_avgs.fg_m, player.season_avgs.fg_a)}%)
                                    </td>
                                    <td>{player.season_avgs.reb}</td>
                                    <td>{player.season_avgs.ast}</td>
                                    <td>{player.season_avgs.stl}</td>
                                    <td>{player.season_avgs.blk}</td>
                                    <td>{player.season_avgs.pfoul}</td>
                                    <td>{player.season_avgs.points}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <h2>SEASON TOTALS</h2>
                        <div className="spacing40"/>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>聯盟</th>
                                    <th>Year</th>
                                    <th>隊伍</th>
                                    <th>GP</th>
                                    <th>時間</th>
                                    <th>二分</th>
                                    <th>三分</th>
                                    <th>罰球</th>
                                    <th>投籃</th>
                                    <th>籃板</th>
                                    <th>助攻</th>
                                    <th>失誤</th>
                                    <th>抄截</th>
                                    <th>阻攻</th>
                                    <th>得分</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{player.league}</td>
                                    <td>{player.season}</td>
                                    <td>{player.team_name}</td>
                                    <td>{player.season_totals.gp}</td>
                                    <td>{this.avgTimePlayed(player.season_totals.seconds)}</td>
                                    <td>{this.average(player.season_totals.two_m, player.season_totals.gp)}
                                        ({this.percent(player.season_totals.two_m, player.season_totals.two_a)}%)
                                    </td>
                                    <td>{this.average(player.season_totals.trey_m, player.season_totals.gp)}
                                        ({this.percent(player.season_totals.trey_m, player.season_totals.trey_a)}%)
                                    </td>
                                    <td>{this.average(player.season_totals.ft_m, player.season_totals.gp)}
                                        ({this.percent(player.season_totals.ft_m, player.season_totals.ft_a)}%)
                                    </td>
                                    <td>{this.average(player.season_avgs.fg_m, player.season_avgs.gp)}
                                        ({this.percent(player.season_avgs.fg_m, player.season_avgs.fg_a)}%)
                                    </td>
                                    <td>{player.season_totals.reb}</td>
                                    <td>{player.season_totals.ast}</td>
                                    <td>{player.season_totals.stl}</td>
                                    <td>{player.season_totals.blk}</td>
                                    <td>{player.season_totals.pfoul}</td>
                                    <td>{player.season_totals.points}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="block table-stat t-last">
                    <div className="spacing60"/>
                    <div className="container">
                        <h2>GAME LOG</h2>
                        <div className="spacing40"/>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Opponent</th>
                                    <th>Results</th>
                                    <th>時間</th>
                                    <th>二分</th>
                                    <th>二分%</th>
                                    <th>三分</th>
                                    <th>三分%</th>
                                    <th>罰球</th>
                                    <th>罰球%</th>
                                    <th>籃板</th>
                                    <th>助攻</th>
                                    <th>失誤</th>
                                    <th>抄截</th>
                                    <th>阻攻</th>
                                    <th>得分</th>
                                </tr>
                                </thead>
                                <tbody>
                                {player.statlines.map(function (game, index) {
                                    return (
                                        <tr key={index}>
                                            <td>{game.game_date}</td>
                                            <td>{game.game_name}</td>
                                            <td>{game.score_home} - {game.score_away}</td>
                                            <td>{this.timePlayed(game.seconds)}</td>
                                            <td>{game.two_m}-{game.two_a + game.two_m}</td>
                                            <td>{this.percent(game.two_m, game.two_a)}</td>
                                            <td>{game.trey_m}-{game.trey_m + game.trey_a}</td>
                                            <td>{this.percent(game.trey_m, game.trey_a)}</td>
                                            <td>{game.ft_m}-{game.ft_m + game.ft_a}</td>
                                            <td>{this.percent(game.ft_m, game.ft_a)}</td>
                                            <td>{game.reb}</td>
                                            <td>{game.ast}</td>
                                            <td>{game.stl}</td>
                                            <td>{game.blk}</td>
                                            <td>{game.pfoul}</td>
                                            <td>{game.points}</td>
                                        </tr>
                                    )
                                }, this)}
                                </tbody>
                            </table>
                        </div>
                        <div className="spacing40"/>
                        <div className="spacing40"/>
                    </div>
                </div>
            </div>
        )
    }
}
