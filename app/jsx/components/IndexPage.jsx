import React from 'react'
import {Link} from 'react-router'
import Loading from './Loading.jsx'
// import NavLink from './NavLink.jsx'
import NavBar from './Navbar.jsx'

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        // this. _handleClick = this. _handleClick.bind(this);
        this.state = {
            games: [],
            // men_standings: [],
            // women_games: [],
            // women_standings: [],
            teams: [],
            gender_opts: [
                {
                    type: 'men',
                    name_alt: '高男',
                    name: 'Men',
                    season_id: 'w4KFF2C4kwq2TqsK9sz5w2'
                },
                {
                    type: 'women',
                    name: 'Women',
                    name_alt: '國男',
                    season_id: 'M38SJr4eDE9wq4m4ph47sh'
                }
            ],
            selected_gender: {
                type: 'men',
                name: 'Men',
                name_alt: '高男',
                season_id: 'w4KFF2C4kwq2TqsK9sz5w2'
            },
            selected_season: {
                id: "w4KFF2C4kwq2TqsK9sz5w2",
                name: "Round 1 (16 teams)",
                name_alt: "十六強預賽",
                date_begin: "2016-12-01",
                date_end: "2016-12-04"
            },
        };

        this.selectGender = this.selectGender.bind(this);
        this.selectSeason = this.selectSeason.bind(this);
    }

    componentDidMount() {
        this.getAllSeasons(this.state.selected_gender.league_id);
        this.getGames(this.state.selected_season.id);
        this.getTeams(this.state.selected_season.id);
        // var url = api_host + 'seasons/' + men_season_id + '/games';
        // var url2 = api_host + 'seasons/' + men_season_id + '/teamadds';
        // var url3 = api_host + 'seasons/' + women_season_id + '/games';
        // var url4 = api_host + 'seasons/' + women_season_id + '/teamadds';


        // $('#js-loading').show();

        // $.when(
        //     $.ajax({
        //         url: url,
        //         type: 'GET',
        //         /*data: {
        //          upcoming: 5
        //          },*/
        //         dataType: 'json',
        //         success: function(data) {
        //             // console.log(data)
        //             this.setState({men_games: data});

        //         }.bind(this),
        //         error: function(xhr, status, err) {
        //             console.error(status, err.toString());
        //         }.bind(this)
        //     }),
        //     $.ajax({
        //         url: url2,
        //         type: 'GET',
        //         dataType: 'json',
        //         success: function(data) {
        //             this.setState({men_standings: data});

        //         }.bind(this),
        //         error: function(xhr, status, err) {
        //             console.error(status, err.toString());
        //         }.bind(this)
        //     }),
        //     $.ajax({
        //         url: url3,
        //         type: 'GET',
        //         dataType: 'json',
        //         success: function(data) {
        //             this.setState({women_games: data});

        //         }.bind(this),
        //         error: function(xhr, status, err) {
        //             console.error(status, err.toString());
        //         }.bind(this)
        //     }),
        //     $.ajax({
        //         url: url4,
        //         type: 'GET',
        //         dataType: 'json',
        //         success: function(data) {
        //             this.setState({women_standings: data});

        //         }.bind(this),
        //         error: function(xhr, status, err) {
        //             console.error(status, err.toString());
        //         }.bind(this)
        //     })
        // ).done(function(){
        //     $('#js-loading').hide();
        // });

    }

    getGames(season_id) {
         var url = api_host + 'seasons/' + season_id + '/games';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                this.setState({games: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        })
    }

    getTeams(season_id) {
        var url2 = api_host + 'seasons/' + season_id + '/teamadds';
        $.ajax({
            url: url2,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                this.setState({teams: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        })
    }

    getAllSeasons(league_id) {
        var url = api_host2 + 'seasons';
        $.ajax({
            url: url, //Temp URL
            type: 'GET',
            data: {
                league: league_id
            },
            dataType: 'JSON',
            success: function (data) {
                this.setState({
                    seasons: data
                })

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    selectGender(e) {
        var type = e.target.value;
        var DB = TAFFY(this.state.gender_opts)
        var thisGender = DB({type: type}).first()

        this.setState({
            selected_gender: thisGender
        });
        //this.getAllSeasons(thisGender.league_id);
        this.getGames(thisGender.season_id);
        this.getTeams(thisGender.season_id);
    }

    selectSeason(e) {
        var id = e.target.value;
        var seasonDB = TAFFY(this.state.seasons)
        var selected_season = seasonDB({id: id}).first();
        if(this.state.selected_season.id === id) {
            return
        } else {
            this.setState({
                selected_season: selected_season
            })
            this.getGames(id);
        }
    }

    link(game){
        return(<Link to={`/game/${game.id}`}>{game.score_home} - {game.score_away}</Link>);
    }

    location(location) {
        if (location.indexOf("*") == -1)
            return location
        else
            return (<div>{location.replace("*", "")} <i className="fa fa-television"></i></div>)
    }

    render() {
        // const men_games = this.state.men_games
        // const men_standings = this.state.men_standings
        // const women_games = this.state.women_games
        // const women_standings = this.state.women_standings
        const games = this.state.games
        const seasons = this.state.seasons
        var sortTeams = this.state.teams;
        let teamStandings = sortTeams.sort(function(a,b){
            let overallA = a.win_count - a.loss_count;
            let overallB = b.win_count - b.loss_count;
            return(overallB- overallA);
        })
        const locale = this.props.locale;
        var zh = false;
        if(locale == 'zh'){
            zh = true;
        }
        else{
            zh = false;
        }
        if(seasons && games) {
            return (
                <div>
                  <div className= "col-md-12">
                    <div className="col-md-6" id="live">
                      <iframe width="480" height="270" src="https://www.youtube.com/embed/live_stream?channel=UCgjUzUkWc-3DOZ3zQFYxWfQ">
                      </iframe>
                    </div>
                    <div className="col-md-6" id="live">
                      <iframe width="480" height="270" src="https://www.youtube.com/embed/live_stream?channel=UCQ8sZVBYBUSkOfcSloA1_OA">
                      </iframe>
                    </div>
                    </div>
                    <section id="schedule_m">
                        <div className="standings container">
                            <div className="row">
                                <div className="col-lg-10 col-lg-offset-1 text-center">
                                    <h2 className="section-heading">{zh ? '戰績排名' : 'Standings'}</h2>
                                    <hr className="primary" />
                                    <form className="form-inline stat-selection">
                                        <div className="form-group">
                                            <label style={{marginRight: '10px'}}>{zh ? '選擇組別' : 'Choose Gender'}</label>
                                            <select className="form-control" id="sortable-menu"  value={this.state.selected_gender.type} onChange={this.selectGender}>
                                                {this.state.gender_opts.map(function(gender, index){
                                                    return(<option key={index} value={gender.type}>{zh ? gender.name_alt : gender.name}</option>);
                                                })}
                                            </select>
                                        </div>
                                      {/*<div className="form-group">
                                            <label style={{marginLeft: '10px', marginRight: '10px'}}>選擇賽事</label>
                                            <select className="form-control" id="sortable-menu"  value={this.state.selected_season.id} onChange={this.selectSeason}>
                                                {this.state.seasons.map(function(season, index){
                                                    return(<option key={index} value={season.id}>{season.name_alt}</option>);
                                                })}
                                            </select>
                                        </div>*/}
                                    </form>

                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th className="text-center">{zh ?this.state.selected_gender.name_alt : this.state.selected_gender.name}{zh ? '組' : "'s Teams"}</th>
                                            <th className="text-center">{zh ? '勝' : 'Wins'}</th>
                                            <th className="text-center">{zh ? '負' : 'Losses'}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {teamStandings.map((team, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}. {zh ? team.name_alt : team.name}</td>
                                                <td>{team.win_count}</td>
                                                <td>{team.loss_count}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="container" id="schedule_youth">
                            <div className="row">
                                <div className="col-lg-10 col-lg-offset-1 text-center">
                                    <h2 className="section-heading">{zh ? '賽程' : 'Schedule'}</h2>
                                    <hr className="primary" />
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th className="text-center">{zh ? '日期' : 'Date'}</th>
                                            <th className="text-center">{zh ? '時間' : 'Time'}</th>
                                            <th className="text-center">{zh ? '地點' : 'Location'}</th>
                                            <th className="text-center">{zh ? '主場' : 'Home'}</th>
                                            <th className="text-center">{zh ? '客場' : 'Guest'}</th>
                                            <th className="text-center">{zh ? '分數' : 'Score'}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {games.map((game, index) => (
                                            <tr key={index}>
                                                <td>{game.date}</td>
                                                <td>{game.time.substring(0, game.time.length - 3)} CST</td>
                                                <td>{this.location(game.location)}</td>
                                                <td>{zh ? game.home_team_alt : game.home_team}</td>
                                                <td>{zh ? game.away_team_alt : game.away_team}</td>
                                                <td>{this.link(game)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/*<section id="schedule_f">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-10 col-lg-offset-1 text-center">
                                    <h2 className="section-heading">賽程</h2>
                                    <hr className="primary" />
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th className="text-center">日期</th>
                                            <th className="text-center">時間</th>
                                            <th className="text-center">地點</th>
                                            <th className="text-center">主場</th>
                                            <th className="text-center">客場</th>
                                            <th className="text-center">分數</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {women_games.map((game, index) => (
                                            <tr key={index}>
                                                <td>{game.date}</td>
                                                <td>{game.time.substring(0, game.time.length - 3)} CST</td>
                                                <td>{this.location(game.location)}</td>
                                                <td>{game.home_team_alt}</td>
                                                <td>{game.away_team_alt}</td>
                                                <td>{this.link(game)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>*/}

                </div>
            )
        } else {
            return (
                <div>
                    <Loading/>
                </div>
            )
        }
    }
}
