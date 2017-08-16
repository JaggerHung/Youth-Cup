
import React from 'react'
import { Link } from 'react-router'


export default class Stats extends React.Component {
    constructor(props) {
        super(props);

        const seasons = [
            {
                id: reg_season_id,
                name_alt: '2016例行賽'
            }
        ]

        // const startDate = moment().subtract(7, 'days');
        // const endDate = moment();

        this.state = {
            teams: null,
            players: null,
            sort: '',
            filter: '',
            keyword: null,
            descending: false,
            players_filter: null,
            players_search: null,
            selected_season: {
                id: reg_season_id,
                name_alt: '2016例行賽'
            },
            seasons: seasons,
            loading: false,
            page: 'TOTAL',
            games: null,
            cacheGames: null,
            startDate: null,
            endDate: null,
            player_ranking: null,
            rankOpts: [
                {
                    type: 'points',
                    name: '得分'
                },
                {
                    type: 'ast',
                    name: '助攻'
                },
                {
                    type: 'stl',
                    name: '抄截'
                },
                {
                    type: 'blk',
                    name: '阻攻'
                },
                {
                    type: 'reb',
                    name: '籃板'
                },
                {
                    type: 'fg_pct',
                    name: '投籃命中率'
                },
                {
                    type: 'trey_pct',
                    name: '三分命中率'
                },
            ],
            rankType: 'points'
        };

        this.fetchData = this.fetchData.bind(this);
        this.selectSeason = this.selectSeason.bind(this);
        this.getAllSeasons = this.getAllSeasons.bind(this);
        this.runFilter = this.runFilter.bind(this);
        this.setPage = this.setPage.bind(this);
        this.getRanking = this.getRanking.bind(this);
        this.setRankType = this.setRankType.bind(this);
        this.changeStartDate = this.changeStartDate.bind(this);
        this.changeEndDate = this.changeEndDate.bind(this);
        this.checkRankType = this.checkRankType.bind(this);
    }


    componentWillMount() {

        this.getAllSeasons();

        this.fetchData(this.state.selected_season.id);
        this.fetchGames(this.state.selected_season.id);
    }



    getAllSeasons() {
        var url = cache_host2 + 'seasons';

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

    // Code for TOTAL page

    fetchData(season_id) {

        var url_players = cache_host + 'seasons/' + season_id + '/rosters';
        var url_teams = cache_host + 'seasons/' + season_id + '/teamadds';

        this.setState({loading: true});

        $.ajax({
            url: url_players, //Temp URL
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                $('#js-loading').hide();
                data = data.filter((value) => {
                    if(value.season_stats[0].gp > 0) {
                        return true
                    }
                });
                var players = this.calculatePctAndAttempts(data);
                this.setState({players: players});
                this.runFilter(data);

                $.ajax({
                    url: url_teams,
                    type: 'GET',
                    dataType: 'json',
                    success: function (teams) {
                        this.setState({teams: teams});
                        this.setState({loading: false});
                    }.bind(this),
                    error: function (xhr, status, err) {
                        console.error(status, err.toString());
                    }.bind(this)
                });

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    calculatePctAndAttempts(players) {
        players.forEach(function(p) {
            let ft_pct;
            let indexOfAverage;
            let gp;
            p.season_stats.forEach(function(stat, index) {
                if(stat.value_type == "Total") {
                    ft_pct = stat.ft_m / (stat.ft_m + stat.ft_a);
                    gp = stat.gp;
                    stat.two_a = stat.two_a + stat.two_m;
                    stat.trey_a = stat.trey_a + stat.trey_m;
                    stat.ft_a = stat.ft_a + stat.ft_m;
                    if(isNaN(ft_pct)) {
                        stat.ft_pct = 0;
                    } else {
                        stat.ft_pct = ft_pct;
                    }
                } else {
                    indexOfAverage = index;
                }
            });
            var averageStat = p.season_stats[indexOfAverage];
            ft_pct = (averageStat.ft_m / gp) / ((averageStat.ft_m + averageStat.ft_a) / gp);

            averageStat.two_a = averageStat.two_a + averageStat.two_m;
            averageStat.trey_a = averageStat.trey_a + averageStat.trey_m;
            averageStat.ft_a = averageStat.ft_a + averageStat.ft_m;

            if(isNaN(ft_pct)) {
                p.season_stats[indexOfAverage].ft_pct = 0;
            } else {
                p.season_stats[indexOfAverage].ft_pct = ft_pct;
            }
        })
        return players;
    }

    runFilter(players) {
        let new_player_list = [];
        //If filter exist run it
        if(this.state.filter && this.state.filter !== 'nil') {
            let filter = this.state.filter;
            players.forEach(function(player) {
                if (player.team_name == filter) {
                    new_player_list.push(player);
                }
            })
        } else {
            new_player_list = this.state.players;
        }
        //If there's words in the search
        if(this.state.keyword) {
            const db = TAFFY(new_player_list)

            const result = db({player_name_alt: {like: this.state.keyword}}).get()
            this.setState({players_search: result});
        } else {
            this.setState({players_filter: new_player_list});
            this.setState({players_search: new_player_list});
        }
    }

    setSort(e) {
        var player_list = this.state.players_search;
        var name = e.target.name;
        var descend = this.state.descending;
        this.remove_highlight(this.state.sort);
        this.setState({sort: e.target.name});
        this.setState({descending: !this.state.descending});
        var typeOfStat = name.slice(name.indexOf('-') + 1, name.lastIndexOf('-'));
        var avgOrTotal = name.slice(name.lastIndexOf('-') + 1, name.length);
        var value_type;
        if(avgOrTotal == 'total') {
            value_type = 'Total';
        }
        if(avgOrTotal == 'avg') {
            value_type = 'Average';
        }

        player_list.sort(sort);

        function sort(one, two) {
            var compare1, compare2;
            if (descend) {
                //Because total and average could both either be in index 0 or 1, so we need to loop through both to calculate the right value
                one.season_stats.forEach(function(stat1) {
                    if(stat1.value_type === value_type) {
                        compare1 = stat1
                    }
                })
                two.season_stats.forEach(function(stat2) {
                    if(stat2.value_type === value_type) {
                        compare2 = stat2;
                    }
                })

                return ( compare1[typeOfStat] - compare2[typeOfStat] )

            } else {
                one.season_stats.forEach(function(stat1) {
                    if(stat1.value_type === value_type) {
                        compare1 = stat1
                    }
                })
                two.season_stats.forEach(function(stat2) {
                    if(stat2.value_type === value_type) {
                        compare2 = stat2;
                    }
                })

                return ( compare2[typeOfStat] - compare1[typeOfStat] )
            }
        }


        this.setState({players_search: player_list});
        this.highlight_column(name);
    }

    highlight_column(column) {
        $('td.' + column).css({"background-color": "#ccc"});
    }

    remove_highlight(column) {
        if (column) {
            $('td.' + column).css({"background-color": ""});
        }
    }

    setSearch(e) {
        var search = e.target.value;
        var player_list_push = [];
        if (search != '') {
            const db = TAFFY(this.state.players_filter)

            const result = db({player_name_alt: {like: search}}).get()
            this.setState({keyword: search});
            this.setState({players_search: result});

        } else {
            this.setState({keyword: null});
            this.setState({players_search: this.state.players_filter})
        }

    }

    // Code for TOTAL page ends
    // Code for STANDING page starts

    fetchGames(season_id) {

        var url = cache_host + 'seasons/' + season_id + '/games';

        this.setState({loading: true});

        let filter = this.state.filter;

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                $('#js-loading').hide();
                var new_games = [];
                if(filter) {
                    data.forEach(function(game) {
                        if (game.away_team == filter || game.home_team == filter) {
                            new_games.push(game);
                        }
                        if (filter == "nil") {
                            new_games.push(game);
                        }
                    })
                } else {
                    new_games = data;
                }
                this.setState({
                    cacheGames: data,
                    games: new_games,
                    loading: false
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    // Code for STANDING page starts

    fetchPlayerByDate(season_id, start, end) {

        let url = cache_host2 + 'seasons/' + season_id + '/stats';

        if(start && end) {
            //date format YYYY-MM-DD
            let s = start.format('YYYY-MM-DD');
            let e = end.format('YYYY-MM-DD');
            url += '?date_begin=' + s + '&date_end=' + e;
        }


        this.setState({loading: true});

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                $('#js-loading').hide();

                let newPlayerList = {};
                let averagedData = [];

                data.forEach(function(player) {
                    if(player.seconds > 0) {
                        let fg_m = player.two_m + player.trey_m;
                        let fg_a = player.two_a + player.trey_a;
                        if(!newPlayerList[player.player_id]) {

                            newPlayerList[player.player_id] = {
                                name: player.player_name_alt,
                                team: player.team_name_alt,
                                gp: 1,
                                seconds: player.seconds,
                                reb: player.reb,
                                ast: player.ast,
                                stl: player.stl,
                                blk: player.blk,
                                fg_m: fg_m,
                                fg_a: fg_a,
                                trey_m: player.trey_m,
                                trey_a: player.trey_a,
                                points: player.points
                            }
                        } else {
                            newPlayerList[player.player_id].gp += 1;
                            newPlayerList[player.player_id].seconds += player.seconds;
                            newPlayerList[player.player_id].reb += player.reb;
                            newPlayerList[player.player_id].ast += player.ast;
                            newPlayerList[player.player_id].stl += player.stl;
                            newPlayerList[player.player_id].blk += player.blk;
                            newPlayerList[player.player_id].fg_m += fg_m;
                            newPlayerList[player.player_id].fg_a += fg_a;
                            newPlayerList[player.player_id].trey_m += player.trey_m;
                            newPlayerList[player.player_id].trey_a += player.trey_a;
                            newPlayerList[player.player_id].points += player.points;
                        }
                    }
                });

                for(var key in newPlayerList) {
                    let data = newPlayerList[key];
                    let trey_pct = data.trey_m / (data.trey_a + data.trey_m);
                    let fg_pct = data.fg_m / (data.fg_a + data.fg_m);


                    trey_pct = isNaN(trey_pct) || trey_pct == Infinity ? 0 : trey_pct * 100;
                    fg_pct = isNaN(fg_pct) || fg_pct == Infinity ? 0 : fg_pct * 100;

                    let averagedObj = {
                        name: data.name,
                        team: data.team,
                        gp: data.gp,
                        seconds: data.seconds / data.gp,
                        reb: data.reb / data.gp,
                        ast: data.ast / data.gp,
                        stl: data.stl / data.gp,
                        blk: data.blk / data.gp,
                        fg_pct: fg_pct,
                        trey_pct: trey_pct,
                        points: data.points / data.gp,
                        player_id: key,
                        fg_a: data.fg_a,
                        fg_m: data.fg_m,
                        trey_m: data.trey_m,
                        trey_a: data.trey_a + data.trey_m
                    };
                    averagedData.push(averagedObj);
                }

                let playerDB = TAFFY(averagedData);


                let sortedPlayers = playerDB().order(this.state.rankType + " desc").get();

                this.setState({
                    player_ranking: sortedPlayers,
                    loading: false
                });

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    getRanking(e) {
        e.preventDefault();
        this.fetchPlayerByDate(this.state.selected_season.id, this.state.startDate, this.state.endDate);
    }

    setRankType(e) {
        let type = e.target.value;
        let playerDB = TAFFY(this.state.player_ranking);
        let sortedPlayers = playerDB().order(type + " desc").get();

        this.setState({
            rankType: type,
            player_ranking: sortedPlayers
        });
    }

    checkRankType(type) {
        return 'highlighted-td'
    }

    changeStartDate(date) {
        this.setState({startDate: date});
    }

    changeEndDate(date) {
        this.setState({endDate: date});
    }

    // Code for STANDING page ends

    // Code Shared between TOTAL, INDIV, STANDING

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
            if(this.state.page === 'TOTAL') {
                this.fetchData(id);
            }
            if(this.state.page === 'INDIV') {
                this.fetchGames(id);
            }
            if(this.state.page === 'STANDING') {
                this.setState({
                    startDate: moment(selected_season.date_begin),
                    endDate: moment(selected_season.date_end)
                })
            }
        }
    }

    // Code Shared between TOTAL and INDIV

    setFilter(e) {
        var filter = e.target.value;
        this.setState({filter: filter});

        if(this.state.page === 'TOTAL') {
            var player_list_push = [];
            this.state.players.forEach(function (player) {
                if (player.team_name == filter) {
                    player_list_push.push(player);
                }
                if (filter == "nil") {
                    player_list_push.push(player);
                }
            })
            //Should check for the search keywords here too
            if(this.state.keyword) {
                const db = TAFFY(player_list_push)
                const result = db({player_name_alt: {like: this.state.keyword}}).get()
                this.setState({players_search: result});
            } else {
                this.setState({players_filter: player_list_push});
                this.setState({players_search: player_list_push});
            }
        }

        if(this.state.page === 'INDIV') {
            var new_games = [];
            this.state.cacheGames.forEach(function(game) {
                if (game.away_team == filter || game.home_team == filter) {
                    new_games.push(game);
                }
                if (filter == "nil") {
                    new_games.push(game);
                }
            })
            this.setState({games: new_games});
        }
    }

    // Used outside of the pages

    setPage(page) {
        if(page === 'TOTAL') {
            this.fetchData(this.state.selected_season.id);
        }
        if(page === 'INDIV') {
            this.fetchGames(this.state.selected_season.id);
        }
        if(page === 'STANDING') {
            this.fetchPlayerByDate(this.state.selected_season.id, this.state.startDate, this.state.endDate);
        }

        this.setState({
            page: page
        });
    }

    render() {
        const teams = this.state.teams;
        const seasons = this.state.seasons;

        if (teams && this.state.players_search) {
            $('#js-loading').hide();
            return (
                <div id="container" className="body-site">
                    <div className="container-fluid stats-header">
                        <div className="spacing100" />
                        <div className="container">
                            <div className="box-blackBanner-left">
                                <h2 style={{fontSize: '32px', marginBottom: '10px', textAlign: 'center'}}>
                                    數據
                                </h2>
                            </div>
                            <div className="box-blackBanner-right">
                                <ul className="games-type" style={{listStyle:'none'}}>
                                    <li className={this.state.page === 'TOTAL' ? 'active-page' : ''} style={{cursor: 'pointer'}} onClick={()=>{this.setPage("TOTAL")}}><strong><a>球員數據</a></strong></li>
                                    <li className={this.state.page === 'INDIV' ? 'active-page' : ''} style={{cursor: 'pointer'}} onClick={()=>{this.setPage("INDIV")}}><strong><a>個別比賽</a></strong></li>
                                    <li className={this.state.page === 'STANDING' ? 'active-page' : ''} style={{cursor: 'pointer'}} onClick={()=>{this.setPage("STANDING")}}><strong><a>排行榜</a></strong></li>
                                    <li className={this.state.page === 'TEAM' ? 'active-page' : ''} style={{cursor: 'pointer'}} onClick={()=>{this.setPage("TEAM")}}><strong><a>團隊數據</a></strong></li>
                                </ul>
                            </div>

                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            {(() => {
                                if(this.state.page === 'TOTAL') {
                                    return (
                                        <div className="sbl-data" style={{marginTop: 20}}>
                                            <form className="form-inline stat-selection">
                                                {/* <div className="form"> */}

                                                    <div className="form-group">
                                                        {/* <label>選擇賽季</label> */}
                                                        <select className="form-control" id="sortable-menu"  value={this.state.selected_season.id} onChange={this.selectSeason}>
                                                            {seasons.map(function(season, index){
                                                                return(<option key={index} value={season.id}>{season.name_alt}</option>);
                                                            })}
                                                        </select>
                                                        <i className="glyphicon glyphicon-menu-down"></i>
                                                    </div>


                                                    <div className="form-group">
                                                        {/* <label>選擇球隊</label> */}
                                                        <select className="form-control" id="sortable-menu"  value={this.state.filter} onChange={this.setFilter.bind(this)}>
                                                            <option value="nil">---- 所有球隊 ----</option>
                                                            {teams.map(function(team, index){
                                                                return(<option key={index} value={team.name}>{team.name_alt}</option>);
                                                            })}
                                                        </select>
                                                        <i className="glyphicon glyphicon-menu-down"></i>
                                                    </div>

                                                <div className="form-group search-player">
                                                    <input type="search" className="text form-control" placeholder="搜尋球員姓名..." defaultValue="" onChange={this.setSearch.bind(this)}/>
                                                </div>
                                            </form>

                                            <h3>{this.state.selected_season.name_alt}</h3>
                                            <p className="table-notes">
                                                <i className="glyphicon glyphicon-sort"></i>
                                                點擊 <span>總</span>、<span>平均</span> 更改排序方式
                                            </p>
                                            <div className="panel">
                                                <div className="table-responsive">
                                                    {/* <p className="table-notes">
                                                        <i className="glyphicon glyphicon-sort"></i>
                                                        點擊 <span>總</span>、<span>平均</span> 更改排序方式
                                                    </p> */}
                                                    {(() => {
                                                        if(this.state.loading) {
                                                            return (
                                                                <div className="container" style={{height: '300px'}}>
                                                                    <div className="cp-spinner cp-balls" style={{marginTop: '200px', position: 'absolute', left: '50%'}}></div>
                                                                </div>
                                                            )
                                                        } else {
                                                            return (
                                                                <table id="stats-table-head" className="table table-hover data-table-sortable stats-table-head">
                                                                    <thead className="stats-table-head-head">
                                                                    <tr style={{border: 'none'}}>
                                                                        <th>背號</th>
                                                                        <th>球員</th>
                                                                        <th>球隊</th>
                                                                        <th>出賽場次</th>
                                                                        <th colSpan={2}>時間 (分)</th>
                                                                        <th colSpan={2}>二分</th>
                                                                        <th colSpan={2}>二分出手</th>
                                                                        <th>二分%</th>
                                                                        <th colSpan={2}>三分</th>
                                                                        <th colSpan={2}>三分出手</th>
                                                                        <th>三分%</th>
                                                                        <th colSpan={2}>罰球</th>
                                                                        <th colSpan={2}>罰球出手</th>
                                                                        <th>罰球%</th>
                                                                        <th colSpan={2}>籃板</th>
                                                                        <th colSpan={2}>進攻籃板</th>
                                                                        <th colSpan={2}>防守籃板</th>
                                                                        <th colSpan={2}>助攻</th>
                                                                        <th colSpan={2}>抄截</th>
                                                                        <th colSpan={2}>阻攻</th>
                                                                        <th colSpan={2}>失誤</th>
                                                                        <th colSpan={2}>得分</th>
                                                                    </tr>
                                                                    <tr className="sub-heading">
                                                                        <th></th>
                                                                        <th></th>
                                                                        <th></th>
                                                                        <th></th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-seconds-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-seconds-avg"href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-two_m-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-two_m-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-two_a-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-two_a-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-two_pct-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-trey_m-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-trey_m-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-trey_a-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-trey_a-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-trey_pct-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-ft_m-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-ft_m-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-ft_a-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-ft_a-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-ft_pct-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-reb-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-reb-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-reb_o-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-reb_o-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-reb_d-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-reb_d-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-ast-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-ast-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-stl-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-stl-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-blk-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-blk-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-turnover-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-turnover-avg" href="#">平均</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-points-total" href="#">總</a>
                                                                        </th>
                                                                        <th>
                                                                            <a onClick={this.setSort.bind(this)} className="sortable" name="data-points-avg" href="#">平均</a>
                                                                        </th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody className="list stats-table">
                                                                    {this.state.players_search.map(function(player, index){
                                                                        var avg_stats = null;
                                                                        var total_stats = null;
                                                                        player.season_stats.map(function(stats){
                                                                            if(stats.value_type=="Total"){
                                                                                total_stats=stats;
                                                                            } else{
                                                                                avg_stats = stats;
                                                                            }
                                                                        })
                                                                        return(
                                                                            <tr key={index}>
                                                                                <td className="data-player-jersey">{player.jersey}</td>
                                                                                <td className="data-player-name_alt">
                                                                                    <Link to={`/player/${player.player_id}`} style={{fontFamily: 'Noto Sans TC', color: '#3766c7'}}>
                                                                                        {player.player_name_alt}
                                                                                    </Link>
                                                                                </td>
                                                                                {/*<td className="data-player-name">{player.player_name}</td>*/}
                                                                                <td className="data-team-name">{player.team_name_alt}</td>
                                                                                <td className="data-gp-total">{total_stats.gp}</td>
                                                                                <td className="data-seconds-total">{Math.round(total_stats.seconds/60)}</td>
                                                                                <td className="data-seconds-avg">{Math.round(avg_stats.seconds/60)}</td>
                                                                                <td className="data-two_m-total">{total_stats.two_m}</td>
                                                                                <td className="data-two_m-avg">{Math.round(avg_stats.two_m * 10)/10}</td>
                                                                                <td className="data-two_a-total">{total_stats.two_a}</td>
                                                                                <td className="data-two_a-avg">{Math.round((avg_stats.two_a) * 10)/10}</td>
                                                                                <td className="data-two_pct-avg">{avg_stats.two_pct > 0 ? Math.round(avg_stats.two_pct * 100) + "%" : 0 + "%"}</td>
                                                                                <td className="data-trey_m-total">{total_stats.trey_m}</td>
                                                                                <td className="data-trey_m-avg">{Math.round(avg_stats.trey_m * 10)/10}</td>
                                                                                <td className="data-trey_a-total">{total_stats.trey_a}</td>
                                                                                <td className="data-trey_a-avg">{Math.round((avg_stats.trey_a) * 10)/10}</td>
                                                                                <td className="data-trey_pct-avg">{avg_stats.trey_pct > 0 ? Math.round(avg_stats.trey_pct * 100) + "%" : 0 + "%"}</td>
                                                                                <td className="data-ft_m-total">{total_stats.ft_m}</td>
                                                                                <td className="data-ft_m-avg">{Math.round(avg_stats.ft_m * 10)/10}</td>
                                                                                <td className="data-ft_a-total">{total_stats.ft_a}</td>
                                                                                <td className="data-ft_a-avg">{Math.round((avg_stats.ft_a) * 10)/10}</td>
                                                                                <td className="data-ft_pct-avg">{avg_stats.ft_pct > 0 ? Math.round(avg_stats.ft_pct * 100) + "%" : 0 + "%"}</td>
                                                                                <td className="data-reb-total">{total_stats.reb}</td>
                                                                                <td className="data-reb-avg">{Math.round(avg_stats.reb * 10)/10}</td>
                                                                                <td className="data-reb_o-total">{total_stats.reb_o}</td>
                                                                                <td className="data-reb_o-avg">{Math.round(avg_stats.reb_o * 10)/10}</td>
                                                                                <td className="data-reb_d-total">{total_stats.reb_d}</td>
                                                                                <td className="data-reb_d-avg">{Math.round(avg_stats.reb_d * 10)/10}</td>
                                                                                <td className="data-ast-total">{total_stats.ast}</td>
                                                                                <td className="data-ast-avg">{Math.round(avg_stats.ast * 10)/10}</td>
                                                                                <td className="data-stl-total">{total_stats.stl}</td>
                                                                                <td className="data-stl-avg">{Math.round(avg_stats.stl * 10)/10}</td>
                                                                                <td className="data-blk-total">{total_stats.blk}</td>
                                                                                <td className="data-blk-avg">{Math.round(avg_stats.blk * 10)/10}</td>
                                                                                <td className="data-turnover-total">{total_stats.turnover}</td>
                                                                                <td className="data-turnover-avg">{Math.round(avg_stats.turnover * 10)/10}</td>
                                                                                <td className="data-points-total">{total_stats.points}</td>
                                                                                <td className="data-points-avg">{Math.round(avg_stats.points*10)/10}</td>
                                                                            </tr>
                                                                        )
                                                                    }, this)}
                                                                    </tbody>
                                                                </table>
                                                            )
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                if(this.state.page === 'INDIV') {
                                    return (
                                        <div className="sbl-data" style={{marginTop: 20}}>
                                            <form className="form-inline stat-selection">
                                                <div className="form-group">
                                                    {/* <label>選擇賽季</label> */}
                                                    <select className="form-control" id="sortable-menu"  value={this.state.selected_season.id} onChange={this.selectSeason}>
                                                        {seasons.map(function(season, index){
                                                            return(<option key={index} value={season.id}>{season.name_alt}</option>);
                                                        })}
                                                    </select>
                                                    <i className="glyphicon glyphicon-menu-down"></i>
                                                </div>
                                                <div className="form-group">
                                                    {/* <label>選擇球隊</label> */}
                                                    <select className="form-control" id="sortable-menu"  value={this.state.filter} onChange={this.setFilter.bind(this)}>
                                                        <option value="nil">--- 所有球隊 ---</option>
                                                        {teams.map(function(team, index){
                                                            return(<option key={index} value={team.name}>{team.name_alt}</option>);
                                                        })}
                                                    </select>
                                                    <i className="glyphicon glyphicon-menu-down"></i>
                                                </div>
                                            </form>
                                            {(() => {
                                                if(this.state.loading) {
                                                    return (
                                                        <div className="container">
                                                            <div className="cp-spinner cp-balls" style={{marginTop: '200px', position: 'absolute', left: '50%'}}></div>
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div>
                                                            <h3>
                                                                {this.state.selected_season.name_alt}
                                                            </h3>
                                                            <Schedule season={this.state.games} />
                                                        </div>
                                                    )
                                                }
                                            })()}
                                        </div>
                                    )
                                }
                                if(this.state.page === 'STANDING') {
                                    return (
                                        <div className="sbl-data" style={{marginTop: 20}}>
                                            <form className="form-inline stat-selection" onSubmit={this.getRanking}>
                                                <div className="form-group">
                                                    {/* <label>選擇賽季</label> */}
                                                    <select className="form-control" id="sortable-menu"  value={this.state.selected_season.id} onChange={this.selectSeason}>
                                                        {seasons.map(function(season, index){
                                                            return(<option key={index} value={season.id}>{season.name_alt}</option>);
                                                        })}
                                                    </select>
                                                    <i className="glyphicon glyphicon-menu-down"></i>
                                                </div>
                                                <div className="form-group">
                                                    {/* <label>開始日期</label> */}
                                                    <DatePicker
                                                    className="form-control"
                                                    placeholderText="選擇開始日期"
                                                    selected={this.state.startDate}
                                                    onChange={this.changeStartDate} />
                                                    <i className="glyphicon glyphicon-menu-down"></i>
                                                </div>
                                                <div className="form-group">
                                                    {/* <label>結束日期</label> */}
                                                    <DatePicker
                                                    className="form-control"
                                                    placeholderText="選擇結束日期"
                                                    selected={this.state.endDate}
                                                    onChange={this.changeEndDate} />
                                                    <i className="glyphicon glyphicon-menu-down"></i>
                                                </div>
                                                <div className="form-group">
                                                    {/* <label>排名方式</label> */}
                                                    <select className="form-control" id="sortable-menu"  value={this.state.rankType} onChange={this.setRankType}>
                                                        {this.state.rankOpts.map(function(team, index){
                                                            return(<option key={index} value={team.type}>{team.name}</option>);
                                                        })}
                                                    </select>
                                                    <i className="glyphicon glyphicon-menu-down"></i>
                                                </div>
                                                <div className="form-group">
                                                    <input className="form-control" type="submit" value="搜尋"/>
                                                </div>
                                            </form>

                                            <div className="panel">
                                                <div className="table-responsive">
                                                    {(() => {
                                                        if(this.state.loading) {
                                                            return (
                                                                <div className="container">
                                                                    <div className="cp-spinner cp-balls" style={{marginTop: '200px', position: 'absolute', left: '50%'}}></div>
                                                                </div>
                                                            )
                                                        } else {
                                                            return (
                                                                <table id="stats-table-head" className="table table-hover data-table-sortable stats-table-head">
                                                                    <thead className="stats-table-head-head">
                                                                    <tr style={{border: 'none'}}>
                                                                        <th>排名</th>
                                                                        <th>球員</th>
                                                                        <th>球隊</th>
                                                                        <th>出賽場次</th>
                                                                        <th>時間 (分)</th>
                                                                        <th>籃板</th>
                                                                        <th>助攻</th>
                                                                        <th>抄截</th>
                                                                        <th>阻攻</th>
                                                                        <th>投籃命中率</th>
                                                                        <th>三分命中率</th>
                                                                        <th>得分</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody className="list stats-table">
                                                                    {this.state.player_ranking.map(function(player, index){
                                                                        return(
                                                                            <tr key={index}>
                                                                                <td className="data-player-jersey">{index + 1}</td>
                                                                                <td className="data-player-name_alt">
                                                                                    <Link to={`/player/${player.player_id}`}>
                                                                                        {player.name}
                                                                                    </Link>
                                                                                </td>
                                                                                <td>{player.team}</td>
                                                                                <td>{player.gp}</td>
                                                                                <td>{Math.round(player.seconds/60)}</td>
                                                                                <td className={this.state.rankType === 'reb' ? 'highlighted-td' : ''}>{Math.round(player.reb * 10)/10}</td>
                                                                                <td className={this.state.rankType === 'ast' ? 'highlighted-td' : ''}>{Math.round(player.ast * 10)/10}</td>
                                                                                <td className={this.state.rankType === 'stl' ? 'highlighted-td' : ''}>{Math.round(player.stl * 10)/10}</td>
                                                                                <td className={this.state.rankType === 'blk' ? 'highlighted-td' : ''}>{Math.round(player.blk * 10)/10}</td>
                                                                                <td className={this.state.rankType === 'fg_pct' ? 'highlighted-td' : ''}>({player.fg_m + "-" + (player.fg_a + player.fg_m) + ") " + Math.round(player.fg_pct) + "%"}</td>
                                                                                <td className={this.state.rankType === 'trey_pct' ? 'highlighted-td' : ''}>({player.trey_m + "-" + player.trey_a + ") " + Math.round(player.trey_pct) + "%"}</td>
                                                                                <td className={this.state.rankType === 'points' ? 'highlighted-td' : ''}>{Math.round(player.points * 10)/10}</td>
                                                                            </tr>
                                                                        )
                                                                    }, this)}
                                                                    </tbody>
                                                                </table>
                                                            )
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                if(this.state.page === 'TEAM') {
                                    return (
                                        <div className="sbl-data" style={{marginTop: 20}}>
                                            <TeamStat seasons={seasons}/>
                                        </div>
                                    )
                                }
                            })()}
                        </div>
                        <div className="spacing100" />
                    </div>
                </div>
            )
        } else
            {
                $('#js-loading').show();
                return (<div/>)
            }
        }
    }
