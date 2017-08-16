import React from 'react'
import Lightbox from 'react-images'
//import NavLink from './NavLink'

export default class Photo extends React.Component {
    constructor(props) {
        super(props);
        // this.setFilter = this.setFilter.bind(this);

        this.state = {
            all: null,
            photos: [],
            date: null,
            lightboxIsOpen: false,
            currentImage: 0,
            lightboxImages: null
        };

        this.closeLightbox = this.closeLightbox.bind(this);
        this.openLightbox = this.openLightbox.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
    }

    componentWillMount(){
        // var url = 'http://api.v7stack.com/v2/photos?season=' + men_season_id;
        var url = 'http://cache.v7stack.com/v2/photos?season=' + men_season_id;

        $('#js-loading').show();
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(photos) {
                $('#js-loading').hide();
                console.log(photos);

                var dates = [];
                var lightboxImage = [];
                if (photos.length > 0) {
                    var date = photos[0].created_at;
                    dates.push(date);
                    photos.forEach(function (photo) {
                        lightboxImage.push({
                            src: photo.web
                        });

                        if (photo.created_at != date) {
                            date = photo.created_at;
                            dates.push(date);
                        }
                    })

                    this.setState({lightboxImages: lightboxImage});
                }
                this.setState({all: photos, dates: dates, photos: photos});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    componentDidUpdate(){
        var grid = $('.grid').imagesLoaded(function(){
            // options
            grid.masonry('destroy');
            grid.masonry({
                itemSelector: '.grid-item',
                percentPosition:true,
                columnWidth: '.grid-sizer'
            });
        });
    }
    
    openLightbox(index){
        this.setState({lightboxIsOpen: true, currentImage: index});
    }
    closeLightbox(){
        this.setState({lightboxIsOpen: false});
    }

    gotoPrevious () {
        this.setState({
            currentImage: this.state.currentImage - 1,
        });
    }

    gotoNext () {
        this.setState({
            currentImage: this.state.currentImage + 1,
        });
    }

    isActive(value) {
        return 'btn btn-default ' + ((value === this.state.selected) ? 'active' : '');
    }

    setFilter(date, e) {
        console.log(date)
        console.log(e)
        e.preventDefault();

        if (date) {
            var taffy_photos = TAFFY(this.state.all)
            var photos = taffy_photos({created_at: date}).get()
            var lightboxImage = [];

            photos.forEach(function (photo) {
                lightboxImage.push({
                    src: photo.web
                });
            })

            this.setState({photos: photos, date: date, lightboxImages: lightboxImage})
        } else
            this.setState({photos: this.state.all, lightboxImages: this.state.all })
    }

    render() {
        const photos = this.state.photos
        const dates = this.state.dates

        if (!photos.length || !dates)
            return (<div></div>)
        else
            return (
                <section id="photo-gallery">
                    <div className="container">
                    <div className="col-lg-12 text-center">

                        <h2 className="section-heading">照片</h2>
                        <hr className="primary" />
                        <div className="grid">
                            <div className="grid-sizer" />
                            {photos.map((photo, index) => (
                                <div key={index} className="grid-item">
                                    {/*<a href={photo.web} target="_blank"><img src={photo.thumbnail} /></a>*/}
                                    <div className="clickable" onClick={() => {this.openLightbox(index)}}><img src={photo.thumbnail} /></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
                    <Lightbox
                        currentImage={this.state.currentImage}
                        images={this.state.lightboxImages}
                        isOpen={this.state.lightboxIsOpen}
                        onClickPrev={this.gotoPrevious}
                        onClickNext={this.gotoNext}
                        onClose={this.closeLightbox}
                      />
                </section>
            )
    }    
}

