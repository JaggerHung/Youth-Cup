import React from 'react'
// import List from 'list.js'

export default class PlayerList extends React.Component {
    constructor(props) {
        super(props);
        // this. _handleClick = this. _handleClick.bind(this);
        this.state = {
            type: null,
            teams: null,
            players: null,
        };
    }

    componentDidMount() {
        var url_players = "";
        var url_teams = "";
        if (this.props.params.type == "men") {
            url_players = api_host + 'seasons/ehCFp7guicmh6QX2rFzBGQ/rosters';
            url_teams = api_host + 'seasons/ehCFp7guicmh6QX2rFzBGQ/teamadds';
        }
        else {
            url_players = api_host + 'seasons/ZIYLIGiuqw1oWwRI1C4aDQ/rosters';
            url_teams = api_host + 'seasons/ZIYLIGiuqw1oWwRI1C4aDQ/teamadds';
        }

        this.setState({type: this.props.params.type});

        var player_data = null;
        var team_data = null;
        // $('#js-loading').show();
        $.when(
            $.ajax({
                url: url_players, //Temp URL
                type: 'GET',
                dataType: 'JSON',
                success: function (data) {
                    player_data = data;
                    // console.log('Success: Mounted');
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            }),
            $.ajax({
                url: url_teams, //Temp URL
                type: 'GET',
                dataType: 'JSON',
                success: function (data) {
                    team_data = data;
                    // console.log('Success: Mounted');
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            })
        ).then(function () {
            // $('#js-loading').hide();
            this.setState({players: player_data});
            this.setState({teams: team_data});
            console.log(this.state.teams);
        }.bind(this));

    }

    componentWillReceiveProps(nextProps) {
        var type = nextProps.routeParams.type  //change url param (same route)
        if (type != this.state.type) {
            this.setState({type: type})

            var url_players = "";
            var url_teams = "";
            if (type == "men") {
                url_players = api_host + 'seasons/ehCFp7guicmh6QX2rFzBGQ/rosters';
                url_teams = api_host + 'seasons/ehCFp7guicmh6QX2rFzBGQ/teamadds';
            }
            else {
                url_players = api_host + 'seasons/ZIYLIGiuqw1oWwRI1C4aDQ/rosters';
                url_teams = api_host + 'seasons/ZIYLIGiuqw1oWwRI1C4aDQ/teamadds';
            }
            var player_data = null;
            var team_data = null;
            // $('#js-loading').show();
            $.when(
                $.ajax({
                    url: url_players, //Temp URL
                    type: 'GET',
                    dataType: 'JSON',
                    success: function (data) {
                        player_data = data;
                        console.log('Success: Mounted');
                    }.bind(this),
                    error: function (xhr, status, err) {
                        console.error(status, err.toString());
                    }.bind(this)
                }),
                $.ajax({
                    url: url_teams, //Temp URL
                    type: 'GET',
                    dataType: 'JSON',
                    success: function (data) {
                        team_data = data;
                        console.log('Success: Mounted');
                    }.bind(this),
                    error: function (xhr, status, err) {
                        console.error(status, err.toString());
                    }.bind(this)
                })
            ).then(function () {
                // $('#js-loading').hide();
                this.setState({players: player_data});
                this.setState({teams: team_data});
                console.log(this.state.teams);
            }.bind(this));
        }
    }

    sorttest() {
        var columnName = $(this).attr('data-sort');
        userList.sort(columnName, {order: "desc"});
    }

    render() {
        // const { splat, url } = this.props.params
        //
        // const posts = TAFFY(this.props.route.data.posts)
        // // const pages = TAFFY(this.props.route.data.pages)
        //
        // const post = posts({url: url}).first()
        $(document).ready(function () {
            var options = {
                valueNames: ['data-player-name', 'data-team-name', 'data-min-total', 'data-min-avg', 'data-2pt-total', 'data-2pt-avg', 'data-3pt-total', 'data-3pt-avg', 'data-ft-total', 'data-ft-avg', 'data-points-total', 'data-points-avg', 'data-rebounds-total', 'data-rebounds-avg', 'data-assists-total', 'data-assists-avg', 'data-steals-total', 'data-steals-avg', 'data-blocks-total', 'data-blocks-avg', 'data-turnover-total', 'data-turnover-avg']
            };
            var userList = new List('jonescup-data', options);
            var columnName = null;
            var team = null;
            $('.sortable').click(function () {
                remove_highlight();
                columnName = $(this).attr('data-sort');
                userList.sort(columnName, {order: "desc"});
                highlight_column();
            });
            $('#sortable-menu').change(function () {
                team = $(this).val();
                console.log('test');
                if (team == "nil") {
                    userList.search("");
                } else {
                    userList.search(team, 'data-team-name');
                }
            });
            function highlight_column() {
                $('td.' + columnName).css({backgroundColor: "#ccc"});
            };

            function remove_highlight() {
                $('td.' + columnName).css({backgroundColor: ""});
            };
        })
        if (this.state.teams && this.state.players) {
            $('#js-loading').hide();

            return (
                <div id="container" className="body-site">
                    <div className="container">
                        <div className="row">
                            <div id="jonescup-data" style={{marginTop: 150}}>
                                <input className="search" placeholder="Search Player" style={{marginBottom: 25}}/>
                                <select id="sortable-menu" onChange={this.sortableMenu} style={{marginLeft: 50}}>
                                    <option value="nil">*通過團隊搜索*</option>
                                    {this.state.teams.map(function (teamc, index) {
                                        return (
                                            <option value={teamc.name} key={index}>{teamc.name}</option>
                                        );
                                    })}
                                </select>
                                <table className="table data-table-sortable">
                                    <thead>
                                    <tr style={{border: 'none'}}>
                                        <th colSpan={3} style={{border: 'none'}}/>
                                        <th colSpan={2} style={{border: '1px solid #ccc', textAlign: 'center'}}>時間</th>
                                        <th colSpan={2} style={{border: '1px solid #ccc', textAlign: 'center'}}>二分</th>
                                        <th colSpan={2} style={{border: '1px solid #ccc', textAlign: 'center'}}>三分</th>
                                        <th colSpan={2} style={{border: '1px solid #ccc', textAlign: 'center'}}>罰球</th>
                                        <th colSpan={2} style={{border: '1px solid #ccc', textAlign: 'center'}}>得分</th>
                                        <th colSpan={2} style={{border: '1px solid #ccc', textAlign: 'center'}}>籃板</th>
                                        <th colSpan={2} style={{border: '1px solid #ccc', textAlign: 'center'}}>助攻</th>
                                        <th colSpan={2} style={{border: '1px solid #ccc', textAlign: 'center'}}>抄截</th>
                                        <th colSpan={2} style={{border: '1px solid #ccc', textAlign: 'center'}}>阻攻</th>
                                        <th colSpan={2} style={{border: '1px solid #ccc', textAlign: 'center'}}>失誤</th>
                                    </tr>
                                    <tr>
                                        <th>球員</th>
                                        <th>球隊</th>
                                        <th>出賽場次</th>
                                        <th>
                                            <a className="sortable" data-sort="data-min-total" onClick={this.sorttest}
                                               href="#">總</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-min-avg" href="#">平均</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-2pt-total" href="#">總</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-2pt-avg" href="#">平均</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-3pt-total" href="#">總</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-3pt-avg" href="#">平均</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-ft-total" href="#">總</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-ft-avg" href="#">平均</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-points-total" href="#">總</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-points-avg" href="#">平均</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-rebounds-total" href="#">總</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-rebounds-avg" href="#">平均</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-assists-total" href="#">總</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-assists-avg" href="#">平均</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-steals-total" href="#">總</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-steals-avg" href="#">平均</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-blocks-total" href="#">總</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-blocks-avg" href="#">平均</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-turnover-total" href="#">總</a>
                                        </th>
                                        <th>
                                            <a className="sortable" data-sort="data-turnover-avg" href="#">平均</a>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="list">
                                    {this.state.players.map(function (player, index) {
                                        var avg_stats = null;
                                        var total_stats = null;
                                        player.season_stats.map(function (stats) {
                                            if (stats.value_type == "Total") {
                                                total_stats = stats;
                                            }
                                            else {
                                                avg_stats = stats;
                                            }
                                        })
                                        return (
                                            <tr key={index}>
                                                <td className="data-player-name">{player.player_name}</td>
                                                <td className="data-team-name">{player.team_name}</td>
                                                <td className="data-gp-total">{total_stats.gp}</td>
                                                <td className="data-min-total">{Math.round(total_stats.seconds / 60)}</td>
                                                <td className="data-min-avg">{Math.round(avg_stats.seconds / 60)}</td>
                                                <td className="data-2pt-total">{total_stats.two_m}</td>
                                                <td className="data-2pt-avg">{avg_stats.two_m}</td>
                                                <td className="data-3pt-total">{total_stats.trey_m}</td>
                                                <td className="data-3pt-avg">{avg_stats.trey_m}</td>
                                                <td className="data-ft-total">{total_stats.ft_m}</td>
                                                <td className="data-ft-avg">{avg_stats.ft_m}</td>
                                                <td className="data-points-total">{total_stats.points}</td>
                                                <td className="data-points-avg">{avg_stats.points}</td>
                                                <td className="data-rebounds-total">{total_stats.reb}</td>
                                                <td className="data-rebounds-avg">{avg_stats.reb}</td>
                                                <td className="data-assists-total">{total_stats.ast}</td>
                                                <td className="data-assists-avg">{avg_stats.ast}</td>
                                                <td className="data-steals-total">{total_stats.stl}</td>
                                                <td className="data-steals-avg">{avg_stats.stl}</td>
                                                <td className="data-blocks-total">{total_stats.blk}</td>
                                                <td className="data-blocks-avg">{avg_stats.blk}</td>
                                                <td className="data-turnover-total">{total_stats.turnover}</td>
                                                <td className="data-turnover-avg">{avg_stats.turnover}</td>
                                            </tr>
                                        )
                                    }, this)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            $('#js-loading').show();
            return (<div/>)
        }
    }
}

