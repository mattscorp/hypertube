import React, { Component } from 'react';
import FilmsList from '../features/listfilms'; 


class HomePage extends Component {




render () {
        return (

  <div className="container">
    <h1>Film</h1>
    <FilmsList />
  </div>
// <div className="container">
//   <div className="row">
//     <div className="col-sm-3">
//       <h3>Titre 1</h3>
//       <div className="view overlay zoom">
//         <img src="../../public/img/ibiza.jpeg"  alt="description of 12345"/>
//       </div>
      
//       <br />
//       <h4>Année de production : </h4>
//       <br />
//       <h5>Note : </h5>
//      </div>
//     <div className="col-sm-3">
// 	      <h3>Titre 2</h3>
// 	      <img src="../../public/img/jason.jpeg"  alt="description of 12345"/>
// 	      <br />
// 	      <h4>Année de production : </h4>
// 	      <br />
// 	      <h5>Note : </h5>
//    	</div>
//     <div className="col-sm-3">
//       <h3>Titre 3</h3>
//       <img src="../../public/img/lion.jpeg"  alt="description of 12345"/>
//       <br />
//       <h4>Année de production : </h4>
//       <br />
//       <h5>Note : </h5>
//     </div>
//     <div className="col-sm-3">
//       <h3>Titre 4</h3>
//       <img src="../../public/img/loup.jpeg"  alt="description of 12345"/>
//       <br />
//       <h4>Année de production : </h4>
//       <br />
//       <h5>Note : </h5>
//     </div>
//   </div>
// </div>
        	);
    }
}


export default HomePage;