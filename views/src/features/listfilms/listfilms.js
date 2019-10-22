import  React from 'react';

const url_img = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const Films = (props) =>  <div id={props.id} >
<div className="image">
    <img src= {url_img + props.poster_path} alt={"Poster of " + props.title} />
    <div className="overlay">
        <h4>RESUME</h4>
        <div >
            <div className="play_hover">
                <a href="#" ><span> PLAY</span> </a>
            </div>
            <p>{props.overview}</p>
        </div>

        
    </div>
</div>
<h3>{props.title}</h3>
 </div>


export default Films 
