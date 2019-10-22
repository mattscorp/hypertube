import  React from 'react';

const url_img = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const Films = (props) =>  <div id={props.id} >
<div className="image">
    <img src= {url_img + props.poster_path} alt={"Poster of " + props.title} />
    <div className="overlay">
        <div >
            <div className="play_hover">
                <a href="#" ><span> PLAY</span> </a>
            </div>
            {
                props.overview.split(' ').map((elem , index)=> 
                     <span>
                        {index < 25 ? elem : null}
                        {index < 24 ? ' ' : null}
                        {index  === 25 ? '...' : null}
                        {index === 0 ? (!elem ? 'No resume available' : null) : null}                        
                     </span>
                )
            }
            
        </div>

        
    </div>
</div>
<h3>{props.title}</h3>
 </div>


export default Films 
