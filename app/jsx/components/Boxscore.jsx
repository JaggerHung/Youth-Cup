import React from 'react'
import {Link} from 'react-router'

export default class Boxscore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game_id: null,
            game: null,
            current_period: null,
            total_periods: [],
            halfs: [],
            refs: null
        };
    }

    componentWillMount() {
        var game_id = this.props.params.id;
        this.setState({game_id: game_id});
        var self = this;
        var url = api_host + 'games/' + game_id;
        $('#js-loading').show();
        $.ajax({
            url: url, //Temp URL
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                $('#js-loading').hide();

                this.setState({game: data});
                self.calculatePeriodNum(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });

        url = api_host2 + 'games/' + game_id + '/personnel';

        $.ajax({
            url: url, //Temp URL
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                $('#js-loading').hide();
                this.setState({
                    refs: data
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    componentDidMount() {
        if (this.state.game && this.state.game.status == 'pending')
            this.interval = setInterval(this.reloadData, 60000);    //60s
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    calculatePeriodNum(data) {
        var total_periods = []
        var halfs = []
        data.teamstats.map(function(teamstat) {
            if (teamstat.side) {

                teamstat.period_stats.map(function(period_stats) {
                    if (period_stats.period > 0) {
                        total_periods.push(period_stats.period);
                        if(period_stats.period < 3) {
                            halfs[0] = '上半場';
                        } else {
                            halfs[1] = '下半場';
                        }
                    }
                })
            }
        })
        this.setState({
            total_periods: total_periods,
            halfs: halfs
        });
    }

    reloadData() {
        var url = api_host + 'games/' + this.state.game_id;
        $('#js-loading').show();
        $('#js-loading-message').text('Updating...');
        $.ajax({
            url: url, //Temp URL
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                $('#js-loading').hide();
                this.setState({game: data});
                self.calculatePeriodNum(data);
                if (data.status != 'pending')
                    clearInterval(this.interval);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
        //this.setState({current: this.state.current + 1});
    }

    setCurrentPeriod(period) {
        this.setState({current_period: period})
    }

    activeClass(period){
        if (period === this.state.current_period) {
            return "active"
        } else {
            return ""
        }
    }

    convertTime(seconds) {
        var time = moment("2016-01-01").startOf('day').seconds(seconds).format('hh:mm:ss');
        if (seconds < 3600)
            time = '00:' + moment("2016-01-01").startOf('day').seconds(seconds).format('mm:ss');
        var minute = Math.floor(moment.duration(time).asMinutes());
        return minute + moment("2016-01-01").startOf('day').seconds(seconds).format(':ss')
    }

    render() {
        const game = this.state.game
        const refs = this.state.refs
        const current_period = this.state.current_period
        const total_periods = this.state.total_periods
        const halfs = this.state.halfs
        const locale = this.props.locale;
        var zh = false;
        if(locale == 'zh'){
            zh = true;
        }
        else{
            zh = false;
        }
        if (game) {
            var home_teamstat = null
            var away_teamstat = null

            var statlines = TAFFY(game.statlines)
            statlines = statlines().order('starter').get()
            statlines.reverse();

            game.teamstats.map(function(teamstat) {
                //Get rid of period -1 here
                var teamstatDB = TAFFY(teamstat.period_stats);
                var adjustmentStat = teamstatDB({period: -1}).first();
                if(adjustmentStat) {
                    teamstat.period_stats.shift();
                }
                if (teamstat.side) {
                    if (!current_period) {
                        home_teamstat = teamstat;
                    } else if(isNaN(current_period)) {
                        var stat = {
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
                        if(current_period === '上半場') {
                            for(var i = 0; i < 2; i++) {
                                var periodStat = teamstat.period_stats[i];
                                stat.seconds += periodStat.seconds;
                                stat.two_m += periodStat.two_m;
                                stat.two_a += periodStat.two_a;
                                stat.trey_m += periodStat.trey_m;
                                stat.trey_a += periodStat.trey_a;
                                stat.ft_m += periodStat.ft_m;
                                stat.ft_a += periodStat.ft_a;
                                stat.points += periodStat.points;
                                stat.reb_o += periodStat.reb_o;
                                stat.reb_d += periodStat.reb_d;
                                stat.reb += periodStat.reb;
                                stat.ast += periodStat.ast;
                                stat.stl += periodStat.stl;
                                stat.blk += periodStat.blk;
                                stat.turnover += periodStat.turnover;
                                stat.pfoul += periodStat.pfoul;
                            }
                        }

                        if(current_period === '下半場') {
                            for(var i = 2; i < 4; i++) {
                                var periodStat = teamstat.period_stats[i];
                                stat.seconds += periodStat.seconds;
                                stat.two_m += periodStat.two_m;
                                stat.two_a += periodStat.two_a;
                                stat.trey_m += periodStat.trey_m;
                                stat.trey_a += periodStat.trey_a;
                                stat.ft_m += periodStat.ft_m;
                                stat.ft_a += periodStat.ft_a;
                                stat.points += periodStat.points;
                                stat.reb_o += periodStat.reb_o;
                                stat.reb_d += periodStat.reb_d;
                                stat.reb += periodStat.reb;
                                stat.ast += periodStat.ast;
                                stat.stl += periodStat.stl;
                                stat.blk += periodStat.blk;
                                stat.turnover += periodStat.turnover;
                                stat.pfoul += periodStat.pfoul;
                            }
                        }
                        home_teamstat = stat;
                    } else {
                        var team_period_stats = TAFFY(teamstat.period_stats)
                        home_teamstat = team_period_stats({period: current_period}).first();
                    }
                } else {

                    if (!current_period) {
                        away_teamstat = teamstat;
                    } else if(isNaN(current_period)) {
                        var stat = {
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
                        if(current_period === '上半場') {
                            for(var i = 0; i < 2; i++) {
                                var periodStat = teamstat.period_stats[i];
                                stat.seconds += periodStat.seconds;
                                stat.two_m += periodStat.two_m;
                                stat.two_a += periodStat.two_a;
                                stat.trey_m += periodStat.trey_m;
                                stat.trey_a += periodStat.trey_a;
                                stat.ft_m += periodStat.ft_m;
                                stat.ft_a += periodStat.ft_a;
                                stat.points += periodStat.points;
                                stat.reb_o += periodStat.reb_o;
                                stat.reb_d += periodStat.reb_d;
                                stat.reb += periodStat.reb;
                                stat.ast += periodStat.ast;
                                stat.stl += periodStat.stl;
                                stat.blk += periodStat.blk;
                                stat.turnover += periodStat.turnover;
                                stat.pfoul += periodStat.pfoul;
                            }
                        }

                        if(current_period === '下半場') {
                            for(var i = 2; i < 4; i++) {
                                var periodStat = teamstat.period_stats[i];
                                stat.seconds += periodStat.seconds;
                                stat.two_m += periodStat.two_m;
                                stat.two_a += periodStat.two_a;
                                stat.trey_m += periodStat.trey_m;
                                stat.trey_a += periodStat.trey_a;
                                stat.ft_m += periodStat.ft_m;
                                stat.ft_a += periodStat.ft_a;
                                stat.points += periodStat.points;
                                stat.reb_o += periodStat.reb_o;
                                stat.reb_d += periodStat.reb_d;
                                stat.reb += periodStat.reb;
                                stat.ast += periodStat.ast;
                                stat.stl += periodStat.stl;
                                stat.blk += periodStat.blk;
                                stat.turnover += periodStat.turnover;
                                stat.pfoul += periodStat.pfoul;
                            }
                        }

                        away_teamstat = stat;
                    } else {
                        var team_period_stats = TAFFY(teamstat.period_stats)
                        away_teamstat = team_period_stats({period: current_period}).first();
                    }

                }
            })


            return (
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="refs">
                                <div className="ref-items"></div>
                                {refs.map((ref) => (
                                    <div className="ref-items"></div>
                                ))}
                            </div>
                            <ul className="quarter-select">
                                {total_periods.map((period, index) => (
                                    <li key={index} role="presentation" className={this.activeClass(period)} onClick={()=>{this.setCurrentPeriod(index+1)}}><a>{`Q${index+1}`}</a></li>
                                ))}
                                {halfs.map((half, index) => (
                                    <li key={index} role="presentation" className={this.activeClass(half)} onClick={()=>{this.setCurrentPeriod(half)}}><a>{half}</a></li>
                                ))}
                                <li role="presentation" className={this.activeClass(null)} onClick={()=>{this.setCurrentPeriod(null)}}><a>{zh ? '整場' : 'Entire Match'}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="title-container">
                            <h2 className="section-heading">{zh ? '主場:' : 'Home: '}{zh ?game.home_team_alt : game.home_team}</h2>
                            <hr className="primary" />
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover table-team-info">
                                <thead>
                                    <tr>
                                        <th>{zh ? '先發' : 'Starter'}</th>
                                        <th>{zh ? '兩分' : '2Pt'}</th>
                                        <th>{zh ? '兩分%' : '2P%'}</th>
                                        <th>{zh ? '罰球' : 'FT'}</th>
                                        <th>{zh ? '罰球%' : 'FT%'}</th>
                                        <th>{zh ? '三分' : '3Pt'}</th>
                                        <th>{zh ? '三分%' : '3P%'}</th>
                                        <th>{zh ? '籃板' : 'Rebs'}</th>
                                        <th>{zh ? '進攻籃板' : 'O.Rebs'}</th>
                                        <th>{zh ? '防守籃板' : 'D.Rebs'}</th>
                                        <th>{zh ? '助攻' : 'Asts'}</th>
                                        <th>{zh ? '抄截' : 'Stls'}</th>
                                        <th>{zh ? '阻攻' : 'Blks'}</th>
                                        <th>{zh ? '失誤' : 'TOs'}</th>
                                        <th>{zh ? '犯規' : 'Fouls'}</th>
                                        <th>{zh ? '得分' : 'Pts'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {statlines.map(function(player, index) {
                                    //Get rid of period -1 here
                                    var teamstatDB = TAFFY(player.period_stats);
                                    var adjustmentStat = teamstatDB({period: -1}).first();
                                    if(adjustmentStat) {
                                        player.period_stats.shift();
                                    }
                                    if (player.side && player.starter) {
                                        if (!current_period) {
                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey < 10 ? "0" : ""}{player.jersey} - {zh ? player.name_alt : player.name}</td>
                                                    <td>{player.two_m} - {player.two_m + player.two_a}</td>
                                                    <td>{player.two_m + player.two_a ? parseFloat(player.two_m / (player.two_m + player.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{player.ft_m} - {player.ft_m + player.ft_a}</td>
                                                    <td>{player.ft_m + player.ft_a ? parseFloat(player.ft_m / (player.ft_m + player.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{player.trey_m} - {player.trey_m + player.trey_a}</td>
                                                    <td>{player.trey_m + player.trey_a ? parseFloat(player.trey_m / (player.trey_m + player.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{player.reb}</td>
                                                    <td>{player.reb_o}</td>
                                                    <td>{player.reb_d}</td>
                                                    <td>{player.ast}</td>
                                                    <td>{player.stl}</td>
                                                    <td>{player.blk}</td>
                                                    <td>{player.turnover}</td>
                                                    <td>{player.pfoul}</td>
                                                    <td>{player.points}</td>
                                                </tr>
                                            )
                                        } else if(isNaN(current_period)) {
                                            var stat = {
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
                                            //When current period is string, which is halfs 上半場 and 下半場
                                            if(current_period === '上半場') {
                                                for(var i = 0; i < 2; i++) {
                                                    var periodStat = player.period_stats[i];
                                                    stat.seconds += periodStat.seconds;
                                                    stat.two_m += periodStat.two_m;
                                                    stat.two_a += periodStat.two_a;
                                                    stat.trey_m += periodStat.trey_m;
                                                    stat.trey_a += periodStat.trey_a;
                                                    stat.ft_m += periodStat.ft_m;
                                                    stat.ft_a += periodStat.ft_a;
                                                    stat.points += periodStat.points;
                                                    stat.reb_o += periodStat.reb_o;
                                                    stat.reb_d += periodStat.reb_d;
                                                    stat.reb += periodStat.reb;
                                                    stat.ast += periodStat.ast;
                                                    stat.stl += periodStat.stl;
                                                    stat.blk += periodStat.blk;
                                                    stat.turnover += periodStat.turnover;
                                                    stat.pfoul += periodStat.pfoul;
                                                }
                                            }

                                            if(current_period === '下半場') {
                                                for(var i = 2; i < 4; i++) {
                                                    var periodStat = player.period_stats[i];
                                                    stat.seconds += periodStat.seconds;
                                                    stat.two_m += periodStat.two_m;
                                                    stat.two_a += periodStat.two_a;
                                                    stat.trey_m += periodStat.trey_m;
                                                    stat.trey_a += periodStat.trey_a;
                                                    stat.ft_m += periodStat.ft_m;
                                                    stat.ft_a += periodStat.ft_a;
                                                    stat.points += periodStat.points;
                                                    stat.reb_o += periodStat.reb_o;
                                                    stat.reb_d += periodStat.reb_d;
                                                    stat.reb += periodStat.reb;
                                                    stat.ast += periodStat.ast;
                                                    stat.stl += periodStat.stl;
                                                    stat.blk += periodStat.blk;
                                                    stat.turnover += periodStat.turnover;
                                                    stat.pfoul += periodStat.pfoul;
                                                }
                                            }

                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey < 10 ? "0" : ""}{player.jersey} - {zh ? player.name_alt : player.name}</td>
                                                    <td>{stat.two_m} - {stat.two_m + stat.two_a}</td>
                                                    <td>{stat.two_m + stat.two_a ? parseFloat(stat.two_m / (stat.two_m + stat.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.ft_m} - {stat.ft_m + stat.ft_a}</td>
                                                    <td>{stat.ft_m + stat.ft_a ? parseFloat(stat.ft_m / (stat.ft_m + stat.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.trey_m} - {stat.trey_m + stat.trey_a}</td>
                                                    <td>{stat.trey_m + stat.trey_a ? parseFloat(stat.trey_m / (stat.trey_m + stat.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.reb}</td>
                                                    <td>{stat.reb_o}</td>
                                                    <td>{stat.reb_d}</td>
                                                    <td>{stat.ast}</td>
                                                    <td>{stat.stl}</td>
                                                    <td>{stat.blk}</td>
                                                    <td>{stat.turnover}</td>
                                                    <td>{stat.pfoul}</td>
                                                    <td>{stat.points}</td>
                                                </tr>
                                            )
                                        } else {

                                            var stat = player.period_stats[current_period - 1]
                                            if (typeof stat === "undefined") {
                                                stat = {
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
                                                }
                                            }
                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey < 10 ? "0" : ""}{player.jersey} - {zh ? player.name_alt : player.name}</td>
                                                    <td>{stat.two_m} - {stat.two_m + stat.two_a}</td>
                                                    <td>{stat.two_m + stat.two_a ? parseFloat(stat.two_m / (stat.two_m + stat.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.ft_m} - {stat.ft_m + stat.ft_a}</td>
                                                    <td>{stat.ft_m + stat.ft_a ? parseFloat(stat.ft_m / (stat.ft_m + stat.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.trey_m} - {stat.trey_m + stat.trey_a}</td>
                                                    <td>{stat.trey_m + stat.trey_a ? parseFloat(stat.trey_m / (stat.trey_m + stat.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.reb}</td>
                                                    <td>{stat.reb_o}</td>
                                                    <td>{stat.reb_d}</td>
                                                    <td>{stat.ast}</td>
                                                    <td>{stat.stl}</td>
                                                    <td>{stat.blk}</td>
                                                    <td>{stat.turnover}</td>
                                                    <td>{stat.pfoul}</td>
                                                    <td>{stat.points}</td>
                                                </tr>
                                            )
                                        }
                                    }
                                })}
                                <tr>
                                    <th>{zh ? '替補' : 'Sub'}</th>
                                    <th>{zh ? '兩分' : '2Pt'}</th>
                                    <th>{zh ? '兩分%' : '2P%'}</th>
                                    <th>{zh ? '罰球' : 'FT'}</th>
                                    <th>{zh ? '罰球%' : 'FT%'}</th>
                                    <th>{zh ? '三分' : '3Pt'}</th>
                                    <th>{zh ? '三分%' : '3P%'}</th>
                                    <th>{zh ? '籃板' : 'Rebs'}</th>
                                    <th>{zh ? '進攻籃板' : 'O.Rebs'}</th>
                                    <th>{zh ? '防守籃板' : 'D.Rebs'}</th>
                                    <th>{zh ? '助攻' : 'Asts'}</th>
                                    <th>{zh ? '抄截' : 'Stls'}</th>
                                    <th>{zh ? '阻攻' : 'Blks'}</th>
                                    <th>{zh ? '失誤' : 'TOs'}</th>
                                    <th>{zh ? '犯規' : 'Fouls'}</th>
                                    <th>{zh ? '得分' : 'Pts'}</th>
                                </tr>
                                {statlines.map(function(player, index) {
                                    if (player.side && !player.starter) {
                                        if (!current_period) {
                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey < 10 ? "0" : ""}{player.jersey} - {zh ? player.name_alt : player.name}</td>
                                                    <td>{player.two_m} - {player.two_m + player.two_a}</td>
                                                    <td>{player.two_m + player.two_a ? parseFloat(player.two_m / (player.two_m + player.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{player.ft_m} - {player.ft_m + player.ft_a}</td>
                                                    <td>{player.ft_m + player.ft_a ? parseFloat(player.ft_m / (player.ft_m + player.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{player.trey_m} - {player.trey_m + player.trey_a}</td>
                                                    <td>{player.trey_m + player.trey_a ? parseFloat(player.trey_m / (player.trey_m + player.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{player.reb}</td>
                                                    <td>{player.reb_o}</td>
                                                    <td>{player.reb_d}</td>
                                                    <td>{player.ast}</td>
                                                    <td>{player.stl}</td>
                                                    <td>{player.blk}</td>
                                                    <td>{player.turnover}</td>
                                                    <td>{player.pfoul}</td>
                                                    <td>{player.points}</td>
                                                </tr>
                                            )
                                        } else if(isNaN(current_period)) {
                                            var stat = {
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
                                            //When current period is string, which is halfs 上半場 and 下半場
                                            if(current_period === '上半場') {
                                                for(var i = 0; i < 2; i++) {
                                                    var periodStat = player.period_stats[i];
                                                    stat.seconds += periodStat.seconds;
                                                    stat.two_m += periodStat.two_m;
                                                    stat.two_a += periodStat.two_a;
                                                    stat.trey_m += periodStat.trey_m;
                                                    stat.trey_a += periodStat.trey_a;
                                                    stat.ft_m += periodStat.ft_m;
                                                    stat.ft_a += periodStat.ft_a;
                                                    stat.points += periodStat.points;
                                                    stat.reb_o += periodStat.reb_o;
                                                    stat.reb_d += periodStat.reb_d;
                                                    stat.reb += periodStat.reb;
                                                    stat.ast += periodStat.ast;
                                                    stat.stl += periodStat.stl;
                                                    stat.blk += periodStat.blk;
                                                    stat.turnover += periodStat.turnover;
                                                    stat.pfoul += periodStat.pfoul;
                                                }
                                            }

                                            if(current_period === '下半場') {
                                                for(var i = 2; i < 4; i++) {
                                                    var periodStat = player.period_stats[i];
                                                    stat.seconds += periodStat.seconds;
                                                    stat.two_m += periodStat.two_m;
                                                    stat.two_a += periodStat.two_a;
                                                    stat.trey_m += periodStat.trey_m;
                                                    stat.trey_a += periodStat.trey_a;
                                                    stat.ft_m += periodStat.ft_m;
                                                    stat.ft_a += periodStat.ft_a;
                                                    stat.points += periodStat.points;
                                                    stat.reb_o += periodStat.reb_o;
                                                    stat.reb_d += periodStat.reb_d;
                                                    stat.reb += periodStat.reb;
                                                    stat.ast += periodStat.ast;
                                                    stat.stl += periodStat.stl;
                                                    stat.blk += periodStat.blk;
                                                    stat.turnover += periodStat.turnover;
                                                    stat.pfoul += periodStat.pfoul;
                                                }
                                            }

                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey < 10 ? "0" : ""}{player.jersey} - {zh ? player.name_alt : player.name}</td>
                                                    <td>{stat.two_m} - {stat.two_m + stat.two_a}</td>
                                                    <td>{stat.two_m + stat.two_a ? parseFloat(stat.two_m / (stat.two_m + stat.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.ft_m} - {stat.ft_m + stat.ft_a}</td>
                                                    <td>{stat.ft_m + stat.ft_a ? parseFloat(stat.ft_m / (stat.ft_m + stat.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.trey_m} - {stat.trey_m + stat.trey_a}</td>
                                                    <td>{stat.trey_m + stat.trey_a ? parseFloat(stat.trey_m / (stat.trey_m + stat.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.reb}</td>
                                                    <td>{stat.reb_o}</td>
                                                    <td>{stat.reb_d}</td>
                                                    <td>{stat.ast}</td>
                                                    <td>{stat.stl}</td>
                                                    <td>{stat.blk}</td>
                                                    <td>{stat.turnover}</td>
                                                    <td>{stat.pfoul}</td>
                                                    <td>{stat.points}</td>
                                                </tr>
                                            )
                                        } else {
                                            var stat = player.period_stats[current_period - 1]
                                            if (typeof stat === "undefined") {
                                                stat = {
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
                                                }
                                            }
                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey < 10 ? "0" : ""}{player.jersey} - {zh ? player.name_alt : player.name}</td>
                                                    <td>{stat.two_m} - {stat.two_m + stat.two_a}</td>
                                                    <td>{stat.two_m + stat.two_a ? parseFloat(stat.two_m / (stat.two_m + stat.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.ft_m} - {stat.ft_m + stat.ft_a}</td>
                                                    <td>{stat.ft_m + stat.ft_a ? parseFloat(stat.ft_m / (stat.ft_m + stat.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.trey_m} - {stat.trey_m + stat.trey_a}</td>
                                                    <td>{stat.trey_m + stat.trey_a ? parseFloat(stat.trey_m / (stat.trey_m + stat.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.reb}</td>
                                                    <td>{stat.reb_o}</td>
                                                    <td>{stat.reb_d}</td>
                                                    <td>{stat.ast}</td>
                                                    <td>{stat.stl}</td>
                                                    <td>{stat.blk}</td>
                                                    <td>{stat.turnover}</td>
                                                    <td>{stat.pfoul}</td>
                                                    <td>{stat.points}</td>
                                                </tr>
                                            )
                                        }
                                    }
                                })}
                                <tr>
                                    <th>TOTALS</th>
                                    <th>{zh ? '兩分' : '2Pt'}</th>
                                    <th>{zh ? '兩分%' : '2P%'}</th>
                                    <th>{zh ? '罰球' : 'FT'}</th>
                                    <th>{zh ? '罰球%' : 'FT%'}</th>
                                    <th>{zh ? '三分' : '3Pt'}</th>
                                    <th>{zh ? '三分%' : '3P%'}</th>
                                    <th>{zh ? '籃板' : 'Rebs'}</th>
                                    <th>{zh ? '進攻籃板' : 'O.Rebs'}</th>
                                    <th>{zh ? '防守籃板' : 'D.Rebs'}</th>
                                    <th>{zh ? '助攻' : 'Asts'}</th>
                                    <th>{zh ? '抄截' : 'Stls'}</th>
                                    <th>{zh ? '阻攻' : 'Blks'}</th>
                                    <th>{zh ? '失誤' : 'TOs'}</th>
                                    <th>{zh ? '犯規' : 'Fouls'}</th>
                                    <th>{zh ? '得分' : 'Pts'}</th>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>{home_teamstat.two_m} - {home_teamstat.two_m + home_teamstat.two_a}</td>
                                    <td>{home_teamstat.two_m + home_teamstat.two_a ? parseFloat(home_teamstat.two_m / (home_teamstat.two_m + home_teamstat.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                    <td>{home_teamstat.ft_m} - {home_teamstat.ft_m + home_teamstat.ft_a}</td>
                                    <td>{home_teamstat.ft_m + home_teamstat.ft_a ? parseFloat(home_teamstat.ft_m / (home_teamstat.ft_m + home_teamstat.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                    <td>{home_teamstat.trey_m} - {home_teamstat.trey_m + home_teamstat.trey_a}</td>
                                    <td>{home_teamstat.trey_m + home_teamstat.trey_a ? parseFloat(home_teamstat.trey_m / (home_teamstat.trey_m + home_teamstat.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                    <td>{home_teamstat.reb}</td>
                                    <td>{home_teamstat.reb_o}</td>
                                    <td>{home_teamstat.reb_d}</td>
                                    <td>{home_teamstat.ast}</td>
                                    <td>{home_teamstat.stl}</td>
                                    <td>{home_teamstat.blk}</td>
                                    <td>{home_teamstat.turnover}</td>
                                    <td>{home_teamstat.pfoul}</td>
                                    <td>{home_teamstat.points}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="title-container">
                            <h2 className="section-heading">{zh ? '客場: ' : 'Away: '}{zh ?game.away_team_alt : game.away_team}</h2>
                            <hr className="primary" />
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover table-team-info">
                                <thead>
                                    <tr>
                                        <th>{zh ? '先發' : 'Starter'}</th>
                                        <th>{zh ? '兩分' : '2Pt'}</th>
                                        <th>{zh ? '兩分%' : '2P%'}</th>
                                        <th>{zh ? '罰球' : 'FT'}</th>
                                        <th>{zh ? '罰球%' : 'FT%'}</th>
                                        <th>{zh ? '三分' : '3Pt'}</th>
                                        <th>{zh ? '三分%' : '3P%'}</th>
                                        <th>{zh ? '籃板' : 'Rebs'}</th>
                                        <th>{zh ? '進攻籃板' : 'O.Rebs'}</th>
                                        <th>{zh ? '防守籃板' : 'D.Rebs'}</th>
                                        <th>{zh ? '助攻' : 'Asts'}</th>
                                        <th>{zh ? '抄截' : 'Stls'}</th>
                                        <th>{zh ? '阻攻' : 'Blks'}</th>
                                        <th>{zh ? '失誤' : 'TOs'}</th>
                                        <th>{zh ? '犯規' : 'Fouls'}</th>
                                        <th>{zh ? '得分' : 'Pts'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {statlines.map(function(player, index) {
                                    //Get rid of period -1 here
                                    var teamstatDB = TAFFY(player.period_stats);
                                    var adjustmentStat = teamstatDB({period: -1}).first();
                                    if(adjustmentStat) {
                                        player.period_stats.shift();
                                    }
                                    if (!player.side && player.starter) {
                                        if (!current_period) {
                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey < 10 ? "0" : ""}{player.jersey} - {zh ? player.name_alt : player.name}</td>
                                                    <td>{player.two_m} - {player.two_m + player.two_a}</td>
                                                    <td>{player.two_m + player.two_a ? parseFloat(player.two_m / (player.two_m + player.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{player.ft_m} - {player.ft_m + player.ft_a}</td>
                                                    <td>{player.ft_m + player.ft_a ? parseFloat(player.ft_m / (player.ft_m + player.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{player.trey_m} - {player.trey_m + player.trey_a}</td>
                                                    <td>{player.trey_m + player.trey_a ? parseFloat(player.trey_m / (player.trey_m + player.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{player.reb}</td>
                                                    <td>{player.reb_o}</td>
                                                    <td>{player.reb_d}</td>
                                                    <td>{player.ast}</td>
                                                    <td>{player.stl}</td>
                                                    <td>{player.blk}</td>
                                                    <td>{player.turnover}</td>
                                                    <td>{player.pfoul}</td>
                                                    <td>{player.points}</td>
                                                </tr>
                                            )
                                        } else if(isNaN(current_period)) {
                                            var stat = {
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
                                            //When current period is string, which is halfs 上半場 and 下半場
                                            if(current_period === '上半場') {
                                                for(var i = 0; i < 2; i++) {
                                                    var periodStat = player.period_stats[i];
                                                    stat.seconds += periodStat.seconds;
                                                    stat.two_m += periodStat.two_m;
                                                    stat.two_a += periodStat.two_a;
                                                    stat.trey_m += periodStat.trey_m;
                                                    stat.trey_a += periodStat.trey_a;
                                                    stat.ft_m += periodStat.ft_m;
                                                    stat.ft_a += periodStat.ft_a;
                                                    stat.points += periodStat.points;
                                                    stat.reb_o += periodStat.reb_o;
                                                    stat.reb_d += periodStat.reb_d;
                                                    stat.reb += periodStat.reb;
                                                    stat.ast += periodStat.ast;
                                                    stat.stl += periodStat.stl;
                                                    stat.blk += periodStat.blk;
                                                    stat.turnover += periodStat.turnover;
                                                    stat.pfoul += periodStat.pfoul;
                                                }
                                            }

                                            if(current_period === '下半場') {
                                                for(var i = 2; i < 4; i++) {
                                                    var periodStat = player.period_stats[i];
                                                    stat.seconds += periodStat.seconds;
                                                    stat.two_m += periodStat.two_m;
                                                    stat.two_a += periodStat.two_a;
                                                    stat.trey_m += periodStat.trey_m;
                                                    stat.trey_a += periodStat.trey_a;
                                                    stat.ft_m += periodStat.ft_m;
                                                    stat.ft_a += periodStat.ft_a;
                                                    stat.points += periodStat.points;
                                                    stat.reb_o += periodStat.reb_o;
                                                    stat.reb_d += periodStat.reb_d;
                                                    stat.reb += periodStat.reb;
                                                    stat.ast += periodStat.ast;
                                                    stat.stl += periodStat.stl;
                                                    stat.blk += periodStat.blk;
                                                    stat.turnover += periodStat.turnover;
                                                    stat.pfoul += periodStat.pfoul;
                                                }
                                            }

                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey < 10 ? "0" : ""}{player.jersey} -{player.name_alt}</td>
                                                    <td>{stat.two_m} - {stat.two_m + stat.two_a}</td>
                                                    <td>{stat.two_m + stat.two_a ? parseFloat(stat.two_m / (stat.two_m + stat.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.ft_m} - {stat.ft_m + stat.ft_a}</td>
                                                    <td>{stat.ft_m + stat.ft_a ? parseFloat(stat.ft_m / (stat.ft_m + stat.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.trey_m} - {stat.trey_m + stat.trey_a}</td>
                                                    <td>{stat.trey_m + stat.trey_a ? parseFloat(stat.trey_m / (stat.trey_m + stat.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.reb}</td>
                                                    <td>{stat.reb_o}</td>
                                                    <td>{stat.reb_d}</td>
                                                    <td>{stat.ast}</td>
                                                    <td>{stat.stl}</td>
                                                    <td>{stat.blk}</td>
                                                    <td>{stat.turnover}</td>
                                                    <td>{stat.pfoul}</td>
                                                    <td>{stat.points}</td>
                                                </tr>
                                            )
                                        } else {

                                            var stat = player.period_stats[current_period - 1]
                                            if (typeof stat === "undefined") {
                                                stat = {
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
                                                }
                                            }
                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey < 10 ? "0" : ""}{player.jersey} - {zh ? player.name_alt : player.name}</td>
                                                    <td>{stat.two_m} - {stat.two_m + stat.two_a}</td>
                                                    <td>{stat.two_m + stat.two_a ? parseFloat(stat.two_m / (stat.two_m + stat.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.ft_m} - {stat.ft_m + stat.ft_a}</td>
                                                    <td>{stat.ft_m + stat.ft_a ? parseFloat(stat.ft_m / (stat.ft_m + stat.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.trey_m} - {stat.trey_m + stat.trey_a}</td>
                                                    <td>{stat.trey_m + stat.trey_a ? parseFloat(stat.trey_m / (stat.trey_m + stat.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.reb}</td>
                                                    <td>{stat.reb_o}</td>
                                                    <td>{stat.reb_d}</td>
                                                    <td>{stat.ast}</td>
                                                    <td>{stat.stl}</td>
                                                    <td>{stat.blk}</td>
                                                    <td>{stat.turnover}</td>
                                                    <td>{stat.pfoul}</td>
                                                    <td>{stat.points}</td>
                                                </tr>
                                            )
                                        }
                                    }
                                })}
                                <tr>
                                    <th>{zh ? '替補' : 'Sub'}</th>
                                    <th>{zh ? '兩分' : '2Pt'}</th>
                                    <th>{zh ? '兩分%' : '2P%'}</th>
                                    <th>{zh ? '罰球' : 'FT'}</th>
                                    <th>{zh ? '罰球%' : 'FT%'}</th>
                                    <th>{zh ? '三分' : '3Pt'}</th>
                                    <th>{zh ? '三分%' : '3P%'}</th>
                                    <th>{zh ? '籃板' : 'Rebs'}</th>
                                    <th>{zh ? '進攻籃板' : 'O.Rebs'}</th>
                                    <th>{zh ? '防守籃板' : 'D.Rebs'}</th>
                                    <th>{zh ? '助攻' : 'Asts'}</th>
                                    <th>{zh ? '抄截' : 'Stls'}</th>
                                    <th>{zh ? '阻攻' : 'Blks'}</th>
                                    <th>{zh ? '失誤' : 'TOs'}</th>
                                    <th>{zh ? '犯規' : 'Fouls'}</th>
                                    <th>{zh ? '得分' : 'Pts'}</th>
                                </tr>
                                {statlines.map(function(player, index) {
                                    if ((!player.side && !player.starter) && player.seconds >0) {
                                        if (!current_period) {
                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey < 10 ? "0" : ""}{player.jersey} - {zh ? player.name_alt : player.name}</td>
                                                    <td>{player.two_m} - {player.two_m + player.two_a}</td>
                                                    <td>{player.two_m + player.two_a ? parseFloat(player.two_m / (player.two_m + player.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{player.ft_m} - {player.ft_m + player.ft_a}</td>
                                                    <td>{player.ft_m + player.ft_a ? parseFloat(player.ft_m / (player.ft_m + player.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{player.trey_m} - {player.trey_m + player.trey_a}</td>
                                                    <td>{player.trey_m + player.trey_a ? parseFloat(player.trey_m / (player.trey_m + player.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{player.reb}</td>
                                                    <td>{player.reb_o}</td>
                                                    <td>{player.reb_d}</td>
                                                    <td>{player.ast}</td>
                                                    <td>{player.stl}</td>
                                                    <td>{player.blk}</td>
                                                    <td>{player.turnover}</td>
                                                    <td>{player.pfoul}</td>
                                                    <td>{player.points}</td>
                                                </tr>
                                            )
                                        } else if(isNaN(current_period)) {
                                            var stat = {
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
                                            //When current period is string, which is halfs 上半場 and 下半場
                                            if(current_period === '上半場') {
                                                for(var i = 0; i < 2; i++) {
                                                    var periodStat = player.period_stats[i];
                                                    stat.seconds += periodStat.seconds;
                                                    stat.two_m += periodStat.two_m;
                                                    stat.two_a += periodStat.two_a;
                                                    stat.trey_m += periodStat.trey_m;
                                                    stat.trey_a += periodStat.trey_a;
                                                    stat.ft_m += periodStat.ft_m;
                                                    stat.ft_a += periodStat.ft_a;
                                                    stat.points += periodStat.points;
                                                    stat.reb_o += periodStat.reb_o;
                                                    stat.reb_d += periodStat.reb_d;
                                                    stat.reb += periodStat.reb;
                                                    stat.ast += periodStat.ast;
                                                    stat.stl += periodStat.stl;
                                                    stat.blk += periodStat.blk;
                                                    stat.turnover += periodStat.turnover;
                                                    stat.pfoul += periodStat.pfoul;
                                                }
                                            }

                                            if(current_period === '下半場') {
                                                for(var i = 2; i < 4; i++) {
                                                    var periodStat = player.period_stats[i];
                                                    stat.seconds += periodStat.seconds;
                                                    stat.two_m += periodStat.two_m;
                                                    stat.two_a += periodStat.two_a;
                                                    stat.trey_m += periodStat.trey_m;
                                                    stat.trey_a += periodStat.trey_a;
                                                    stat.ft_m += periodStat.ft_m;
                                                    stat.ft_a += periodStat.ft_a;
                                                    stat.points += periodStat.points;
                                                    stat.reb_o += periodStat.reb_o;
                                                    stat.reb_d += periodStat.reb_d;
                                                    stat.reb += periodStat.reb;
                                                    stat.ast += periodStat.ast;
                                                    stat.stl += periodStat.stl;
                                                    stat.blk += periodStat.blk;
                                                    stat.turnover += periodStat.turnover;
                                                    stat.pfoul += periodStat.pfoul;
                                                }
                                            }

                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey < 10 ? "0" : ""}{player.jersey} - {zh ? player.name_alt : player.name}</td>
                                                    <td>{stat.two_m} - {stat.two_m + stat.two_a}</td>
                                                    <td>{stat.two_m + stat.two_a ? parseFloat(stat.two_m / (stat.two_m + stat.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.ft_m} - {stat.ft_m + stat.ft_a}</td>
                                                    <td>{stat.ft_m + stat.ft_a ? parseFloat(stat.ft_m / (stat.ft_m + stat.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.trey_m} - {stat.trey_m + stat.trey_a}</td>
                                                    <td>{stat.trey_m + stat.trey_a ? parseFloat(stat.trey_m / (stat.trey_m + stat.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.reb}</td>
                                                    <td>{stat.reb_o}</td>
                                                    <td>{stat.reb_d}</td>
                                                    <td>{stat.ast}</td>
                                                    <td>{stat.stl}</td>
                                                    <td>{stat.blk}</td>
                                                    <td>{stat.turnover}</td>
                                                    <td>{stat.pfoul}</td>
                                                    <td>{stat.points}</td>
                                                </tr>
                                            )
                                        } else {
                                            var stat = player.period_stats[current_period - 1]
                                            if (typeof stat === "undefined") {
                                                stat = {
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
                                                }
                                            }
                                            return (
                                                <tr key={index}>
                                                    <td>{player.jersey < 10 ? "0" : ""}{player.jersey} - {zh ? player.name_alt : player.name}</td>
                                                    <td>{stat.two_m} - {stat.two_m + stat.two_a}</td>
                                                    <td>{stat.two_m + stat.two_a ? parseFloat(stat.two_m / (stat.two_m + stat.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.ft_m} - {stat.ft_m + stat.ft_a}</td>
                                                    <td>{stat.ft_m + stat.ft_a ? parseFloat(stat.ft_m / (stat.ft_m + stat.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.trey_m} - {stat.trey_m + stat.trey_a}</td>
                                                    <td>{stat.trey_m + stat.trey_a ? parseFloat(stat.trey_m / (stat.trey_m + stat.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                                    <td>{stat.reb}</td>
                                                    <td>{stat.reb_o}</td>
                                                    <td>{stat.reb_d}</td>
                                                    <td>{stat.ast}</td>
                                                    <td>{stat.stl}</td>
                                                    <td>{stat.blk}</td>
                                                    <td>{stat.turnover}</td>
                                                    <td>{stat.pfoul}</td>
                                                    <td>{stat.points}</td>
                                                </tr>
                                            )
                                        }
                                    }
                                })}
                                <tr>
                                    <th>TOTALS</th>
                                    <th>{zh ? '兩分' : '2Pt'}</th>
                                    <th>{zh ? '兩分%' : '2P%'}</th>
                                    <th>{zh ? '罰球' : 'FT'}</th>
                                    <th>{zh ? '罰球%' : 'FT%'}</th>
                                    <th>{zh ? '三分' : '3Pt'}</th>
                                    <th>{zh ? '三分%' : '3P%'}</th>
                                    <th>{zh ? '籃板' : 'Rebs'}</th>
                                    <th>{zh ? '進攻籃板' : 'O.Rebs'}</th>
                                    <th>{zh ? '防守籃板' : 'D.Rebs'}</th>
                                    <th>{zh ? '助攻' : 'Asts'}</th>
                                    <th>{zh ? '抄截' : 'Stls'}</th>
                                    <th>{zh ? '阻攻' : 'Blks'}</th>
                                    <th>{zh ? '失誤' : 'TOs'}</th>
                                    <th>{zh ? '犯規' : 'Fouls'}</th>
                                    <th>{zh ? '得分' : 'Pts'}</th>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>{away_teamstat.two_m} - {away_teamstat.two_m + away_teamstat.two_a}</td>
                                    <td>{away_teamstat.two_m + away_teamstat.two_a ? parseFloat(away_teamstat.two_m / (away_teamstat.two_m + away_teamstat.two_a) * 100).toFixed(0) + '%' : '---'}</td>
                                    <td>{away_teamstat.ft_m} - {away_teamstat.ft_m + away_teamstat.ft_a}</td>
                                    <td>{away_teamstat.ft_m + away_teamstat.ft_a ? parseFloat(away_teamstat.ft_m / (away_teamstat.ft_m + away_teamstat.ft_a) * 100).toFixed(0) + '%' : '---'}</td>
                                    <td>{away_teamstat.trey_m} - {away_teamstat.trey_m + away_teamstat.trey_a}</td>
                                    <td>{away_teamstat.trey_m + away_teamstat.trey_a ? parseFloat(away_teamstat.trey_m / (away_teamstat.trey_m + away_teamstat.trey_a) * 100).toFixed(0) + '%' : '---'}</td>
                                    <td>{away_teamstat.reb}</td>
                                    <td>{away_teamstat.reb_o}</td>
                                    <td>{away_teamstat.reb_d}</td>
                                    <td>{away_teamstat.ast}</td>
                                    <td>{away_teamstat.stl}</td>
                                    <td>{away_teamstat.blk}</td>
                                    <td>{away_teamstat.turnover}</td>
                                    <td>{away_teamstat.pfoul}</td>
                                    <td>{away_teamstat.points}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            // $('#js-loading').show();
            return (<div></div>);
        }
    }
}
