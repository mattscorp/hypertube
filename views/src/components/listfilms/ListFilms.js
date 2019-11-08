import  React from 'react';

const url_img = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const Films = (props) => (
    <div id={props.id} >
        <div className="image">
            <img src= {props.poster_path ? url_img + props.poster_path : "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png"} alt={"Poster of " + props.title} />
            <div className="overlay">
                <div className="topright">
                    <p>
                    <span className="glyphicon glyphicon-star">{props.vote_average}</span>
                    </p> 
                </div>
                <div>
                    {
                        props.overview.split(' ').map((elem , index)=> 
                            <span key={index}>
                                {index < 25 ? elem : null}
                                {index < 24 ? ' ' : null}
                                {index  === 25 ? '...' : null}
                                {index === 0 ? (!elem ? 'No resume available' : null) : null}                        
                            </span>
                        )
                    }
                    <div className="play_hover">
                        <a href="#" className="btn btn-info btn-lg">
                        <span className="glyphicon glyphicon-play"></span> Play
                        </a>
                    </div>         
                </div>
            </div>
        </div>
        <h5 className={props.darkModeState ? "text-white" : "text-dark"}>{props.title}</h5>
    </div>
 )


export default Films 
