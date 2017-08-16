import React from 'react'
import { Link } from 'react-router'

export default class GameList extends React.Component {
    constructor(props) {
        super(props);
        // this. _handleClick = this. _handleClick.bind(this);
        this.state = {
            type: null,
            banner: 'https://s3-ap-southeast-1.amazonaws.com/cxn/jonescup/schedule_m.jpg',
            games: []
        };
    }

    componentDidMount() {
        // console.log(this.props.loading)

        var type = this.props.params.type
        this.setState({type: type});

        console.log(type)
        var season_id;
        if (type == 'men') {
            season_id = 'ehCFp7guicmh6QX2rFzBGQ';
            this.setState({banner: 'https://s3-ap-southeast-1.amazonaws.com/cxn/jonescup/schedule_m.jpg'});
        } else {
            season_id = 'ZIYLIGiuqw1oWwRI1C4aDQ';
            this.setState({banner: 'https://s3-ap-southeast-1.amazonaws.com/cxn/jonescup/schedule_f.jpg'});
        }
        var url = api_host + 'seasons/' + season_id + '/games';

        $('#js-loading').show();
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                $('#js-loading').hide();
                // console.log(data)
                this.setState({games: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log('xxx')
        var type = nextProps.routeParams.type  //change url param (same route)
        if (type != this.state.type) {
            this.setState({type: type})

            var season_id;
            if (type == 'men') {
                season_id = 'ehCFp7guicmh6QX2rFzBGQ';
                this.setState({banner: 'https://s3-ap-southeast-1.amazonaws.com/cxn/jonescup/schedule_m.jpg'});
            } else {
                season_id = 'ZIYLIGiuqw1oWwRI1C4aDQ';
                this.setState({banner: 'https://s3-ap-southeast-1.amazonaws.com/cxn/jonescup/schedule_f.jpg'});
            }
            var url = api_host + 'seasons/' + season_id + '/games';

            $('#js-loading').show();
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    $('#js-loading').hide();
                    // console.log(data)
                    this.setState({games: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });
        }
    }

    render() {
        const games = this.state.games
        const banner = this.state.banner

        return (
            <div id="container" className="body-site">
                <div className="block table-stat no-h2">
                    <img src={banner} style={{marginTop: 85, width: '100%'}}/>
                    <div className="container" style={{marginTop: 20}}>
                        <div className="table-responsive">
                            <table className="table same-bg">
                                <tbody><tr>
                                    <th>日期</th>
                                    <th>時間</th>
                                    <th>地點</th>
                                    <th>對手</th>
                                    <th>得分</th>
                                </tr>
                                {games.map((game, index) => (
                                    <tr key={index}>
                                        <td>{game.date}</td>
                                        <td>{game.time.substring(0, game.time.length - 3)} CST</td>
                                        <td>{game.location}</td>
                                        <td>{game.name}</td>
										<td><Link to={`/game/${game.id}`}>{game.score_home} - {game.score_away}</Link></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
