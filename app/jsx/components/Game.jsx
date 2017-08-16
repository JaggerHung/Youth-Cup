import React from 'react'
import { Link } from 'react-router'

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        // this. _handleClick = this. _handleClick.bind(this);
        this.state = {
            game: null
        };
    }
    
    componentDidMount() {
        // console.log(this.props.loading)
        var game_id = this.props.params.id;
        // const games = TAFFY(this.props.route.data)
        // const game = games({id: game_id}).first();

        var url = api_host + 'games/' + game_id;
        $('#js-loading').show();
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                $('#js-loading').hide();
                // console.log(data)
                this.setState({game: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    isActive(value) {
        return 'btn btn-default' + " " + this.oT(value) + ((value === this.state.selected) ? 'active' : '');
    }

    oT(period_num) {
        var num = 0;
        if (period_num == "onep"){num=1;}
        if (period_num == "twop"){num=2;}
        if (period_num == "threep"){num=3;}
        if (period_num == "fourp"){num=4;}
        if (period_num == "fivep"){num=5;}
        if (period_num == ''){num=1;}
        var visible = false;
        this.state.game.teamstats.map(function (team) {
            team.period_stats.map(function (period) {
                if (period.period == num) {
                    visible = true;
                }
            })
        })
        if (visible) {
            return ''
        }
        else {
            return 'hidden';
        }
    }

    setFilter(filter) {
        this.setState({selected: filter});
    }

    render() {
        const game = this.state.game;
        console.log(game);

            var home_totalstat = {
                seconds: 0,
                two_m: 0,
                two_a: 0,
                trey_m: 0,
                trey_a: 0,
                ft_m: 0,
                ft_a: 0,
                points: 0,
                reb_o: 0,
                reb_d: 0,
                reb: 0,
                ast: 0,
                stl: 0,
                blk: 0,
                turnover: 0,
                pfoul: 0,
            };

            var away_totalstat = {
                seconds: 0,
                two_m: 0,
                two_a: 0,
                trey_m: 0,
                trey_a: 0,
                ft_m: 0,
                ft_a: 0,
                points: 0,
                reb_o: 0,
                reb_d: 0,
                reb: 0,
                ast: 0,
                stl: 0,
                blk: 0,
                turnover: 0,
                pfoul: 0,
            };
        
        if (!game)
            return (
                <div></div>
            )

        return (
            <div>
                <section id="schedule">
                    <div className="container">
                        <h4 className="printh4">Periods</h4>
                        <div className="btn-toolbar" role="toolbar">
                            
                            <div className="btn-group" role="group">
                                <button type="button" className={this.isActive('')}
                                        onClick={this.setFilter.bind(this, '')}>All
                                </button>
                                <button type="button" className={this.isActive('onep')}
                                        onClick={this.setFilter.bind(this, 'onep')}>1
                                </button>
                                <button type="button" className={this.isActive('twop')}
                                        onClick={this.setFilter.bind(this, 'twop')}>2
                                </button>
                                <button type="button" className={this.isActive('threep')}
                                        onClick={this.setFilter.bind(this, 'threep')}>3
                                </button>
                                <button type="button" className={this.isActive('fourp')}
                                        onClick={this.setFilter.bind(this, 'fourp')}>4
                                </button>
                                <button type="button" className={this.isActive('fivep')}
                                        onClick={this.setFilter.bind(this, 'fivep')}>5
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <h2 className="section-heading">{game.home_team_alt}</h2>
                                <hr className="primary" />
                                <div class="table-responsive">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th className="text-center">#</th>
                                            <th className="text-center hidden-xs hidden-sm">位置</th>
                                            <th className="text-center">姓名</th>
                                            <th className="text-center hidden-xs">上場時間</th>
                                            <th className="text-center hidden-xs">2分</th>
                                            <th className="text-center hidden-xs">3分</th>
                                            <th className="text-center hidden-xs">罰球</th>
                                            <th className="text-center hidden-xs hidden-sm">進攻籃板</th>
                                            <th className="text-center hidden-xs hidden-sm">防守籃板</th>
                                            <th className="text-center visible-xs">分數</th>
                                            <th className="text-center">籃板</th>
                                            <th className="text-center">助攻</th>
                                            <th className="text-center hidden-xs">抄截</th>
                                            <th className="text-center hidden-xs">阻攻</th>
                                            <th className="text-center hidden-xs">失誤</th>
                                            <th className="text-center hidden-xs">個人犯規</th>
                                            <th className="text-center">分數</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {game.statlines.map(function (player, index) {
                                            if (player.side){
                                                return (
                                                    <tr key={index}>
                                                        <td>{player.jersey}</td>
                                                        <td className="hidden-xs hidden-sm">{player.position}</td>
                                                        <td>{player.name_alt}</td>
                                                        <td className="hidden-xs">{player.seconds}</td>
                                                        <td className="hidden-xs">{player.two_m} - {player.two_a + player.two_m}</td>
                                                        <td className="hidden-xs">{player.trey_m} - {player.trey_m + player.trey_a}</td>
                                                        <td className="hidden-xs">{player.ft_m} - {player.ft_m + player.ft_a}</td>
                                                        <td className="hidden-xs hidden-sm">{player.reb_o}</td>
                                                        <td className="hidden-xs hidden-sm">{player.reb_d}</td>
                                                        <td className="visible-xs">{player.points}</td>
                                                        <td>{player.reb}</td>
                                                        <td>{player.ast}</td>
                                                        <td className="hidden-xs">{player.stl}</td>
                                                        <td className="hidden-xs">{player.blk}</td>
                                                        <td className="hidden-xs">{player.turnover}</td>
                                                        <td className="hidden-xs">{player.pfoul}</td>
                                                        <td className="hidden-xs">{player.points}</td>
                                                    </tr>
                                                )}
                                        }, this)}
                                        <tr>
                                            <td colSpan="4">總數</td>
                                            <td className="hidden-xs">{home_totalstat.seconds}</td>
                                            <td className="hidden-xs">{home_totalstat.two_m} - {home_totalstat.two_a + home_totalstat.two_m}</td>
                                            <td className="hidden-xs">{home_totalstat.trey_m} - {home_totalstat.trey_m + home_totalstat.trey_a}</td>
                                            <td className="hidden-xs">{home_totalstat.ft_m} - {home_totalstat.ft_m + home_totalstat.ft_a}</td>
                                            <td className="hidden-xs hidden-sm">{home_totalstat.reb_o}</td>
                                            <td className="hidden-xs hidden-sm">{home_totalstat.reb_d}</td>
                                            <td className="visible-xs">{home_totalstat.points}</td>
                                            <td>{home_totalstat.reb}</td>
                                            <td>{home_totalstat.ast}</td>
                                            <td className="hidden-xs">{home_totalstat.stl}</td>
                                            <td className="hidden-xs">{home_totalstat.blk}</td>
                                            <td className="hidden-xs">{home_totalstat.turnover}</td>
                                            <td className="hidden-xs">{home_totalstat.pfoul}</td>
                                            <td className="hidden-xs">{home_totalstat.points}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="standings">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <h2 className="section-heading">{game.away_team_alt}</h2>
                                <hr className="primary" />
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th className="text-center">#</th>
                                        <th className="text-center hidden-xs hidden-sm">位置</th>
                                        <th className="text-center">姓名</th>
                                        <th className="text-center hidden-xs">上場時間</th>
                                        <th className="text-center hidden-xs">2分</th>
                                        <th className="text-center hidden-xs">3分</th>
                                        <th className="text-center hidden-xs">罰球</th>
                                        <th className="text-center hidden-xs hidden-sm">進攻籃板</th>
                                        <th className="text-center hidden-xs hidden-sm">防守籃板</th>
                                        <th className="text-center visible-xs">分數</th>
                                        <th className="text-center">籃板</th>
                                        <th className="text-center">助攻</th>
                                        <th className="text-center hidden-xs">抄截</th>
                                        <th className="text-center hidden-xs">阻攻</th>
                                        <th className="text-center hidden-xs">失誤</th>
                                        <th className="text-center hidden-xs">個人犯規</th>
                                        <th className="text-center hidden-xs">分數</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {game.statlines.map(function (player, index) {
                                        if (!player.side){
                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey}</td>
                                                    <td className="hidden-xs hidden-sm">{player.position}</td>
                                                    <td>{player.name_alt}</td>
                                                    <td className="hidden-xs">{player.seconds}</td>
                                                    <td className="hidden-xs">{player.two_m} - {player.two_a + player.two_m}</td>
                                                    <td className="hidden-xs">{player.trey_m} - {player.trey_m + player.trey_a}</td>
                                                    <td className="hidden-xs">{player.ft_m} - {player.ft_m + player.ft_a}</td>
                                                    <td className="hidden-xs hidden-sm">{player.reb_o}</td>
                                                    <td className="hidden-xs hidden-sm">{player.reb_d}</td>
                                                    <td className="visible-xs">{player.points}</td>
                                                    <td>{player.reb}</td>
                                                    <td>{player.ast}</td>
                                                    <td className="hidden-xs">{player.stl}</td>
                                                    <td className="hidden-xs">{player.blk}</td>
                                                    <td className="hidden-xs">{player.turnover}</td>
                                                    <td className="hidden-xs">{player.pfoul}</td>
                                                    <td className="hidden-xs">{player.points}</td>
                                                </tr>
                                            )}
                                    }, this)}
                                    <tr>
                                        <td>TOTAL</td>
                                        <td className="hidden-xs hidden-sm"></td>
                                        <td></td>
                                        <td className="hidden-xs">{away_totalstat.seconds}</td>
                                        <td className="hidden-xs">{away_totalstat.two_m} - {away_totalstat.two_a + away_totalstat.two_m}</td>
                                        <td className="hidden-xs">{away_totalstat.trey_m} - {away_totalstat.trey_m + away_totalstat.trey_a}</td>
                                        <td className="hidden-xs">{away_totalstat.ft_m} - {away_totalstat.ft_m + away_totalstat.ft_a}</td>
                                        <td className="hidden-xs hidden-sm">{away_totalstat.reb_o}</td>
                                        <td className="hidden-xs hidden-sm">{away_totalstat.reb_d}</td>
                                        <td className="visible-xs">{away_totalstat.points}</td>
                                        <td>{away_totalstat.reb}</td>
                                        <td>{away_totalstat.ast}</td>
                                        <td className="hidden-xs">{away_totalstat.stl}</td>
                                        <td className="hidden-xs">{away_totalstat.blk}</td>
                                        <td className="hidden-xs">{away_totalstat.turnover}</td>
                                        <td className="hidden-xs">{away_totalstat.pfoul}</td>
                                        <td className="hidden-xs">{away_totalstat.points}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

