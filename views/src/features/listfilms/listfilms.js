import  React from 'react';

const url_img = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const Films = (props) =>  <div id={props.id} >

<img src= {url_img + props.poster_path} alt={"Poster of " + props.title} />
<h3>{props.title}</h3>
 </div>


export default Films 

//<h4>RESUME</h4>
// <p>{props.overview}</p>
