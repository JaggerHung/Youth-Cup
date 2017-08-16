import React from 'react'
import {Link} from 'react-router'
// import NavLink from './NavLink.jsx'

export default class BlankPage extends React.Component {
    constructor(props) {
        super(props);
        // this. _handleClick = this. _handleClick.bind(this);
        /*this.state = {
            men_games: [],
            men_standings: [],
            women_games: [],
            women_standings: []
        };*/
    }

    /*componentDidMount() {
        var url = api_host + 'seasons/' + men_season_id + '/games';
        var url2 = api_host + 'seasons/' + men_season_id + '/teamadds';
        var url3 = api_host + 'seasons/' + women_season_id + '/games';
        var url4 = api_host + 'seasons/' + women_season_id + '/teamadds';

        // this.props.toggleLoading()
        $('#js-loading').show();

        $.when(
            $.ajax({
                url: url,
                type: 'GET',
                /!*data: {
                 upcoming: 5
                 },*!/
                dataType: 'json',
                success: function(data) {
                    // console.log(data)
                    this.setState({men_games: data});
                    // this.props.toggleLoading()
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            }),
            $.ajax({
                url: url2,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    this.setState({men_standings: data});
                    // this.props.toggleLoading()
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            }),
            $.ajax({
                url: url3,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    this.setState({women_games: data});
                    // this.props.toggleLoading()
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            }),
            $.ajax({
                url: url4,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    this.setState({women_standings: data});
                    // this.props.toggleLoading()
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            })
        ).done(function(){
            $('#js-loading').hide();
        });

        /!*season_id = 'ZIYLIGiuqw1oWwRI1C4aDQ';      //women
        url = api_host + 'seasons/' + season_id + '/games';

        $.ajax({
            url: url,
            type: 'GET',
            data: {
                upcoming: 5
            },
            dataType: 'json',
            success: function(data) {
                // console.log(data)
                $('#js-loading').hide();
                this.setState({upcoming_women_games: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });*!/
    }*/

    // componentDidMount() {
    //     console.log('yyy')
    //     this.props.toggleLoading()
    // }

    /*link(game){
        return(<Link to={`/game/${game.id}`}>{game.score_home} - {game.score_away}</Link>);
    }

    location(location) {
        if (location.indexOf("*") == -1)
            return location
        else
            return (<div>{location.replace("*", "")} <i className="fa fa-television"></i></div>)
    }*/

    render() {
        /*const teams = TAFFY(this.props.route.teams)
        const men_teams = teams({type: 'men'}).get()
        const women_teams = teams({type: 'women'}).get()*/

        /*const men_games = this.state.men_games
        const men_standings = this.state.men_standings
        const women_games = this.state.women_games
        const women_standings = this.state.women_standings*/

        return (
            <div>
            </div>
        )
    }
}
