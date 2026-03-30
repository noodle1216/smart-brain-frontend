import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png'
import './Logo.css'

const Logo = () => {
	return (
		<div className='ma4 mt0'>
	    <Tilt className='Tilt br2 shadow-2' options={{ max: 55}} style={{ height: 150, width: 150 }}>
	      <div className='Tilt-inner pa3'>
	      	<img style={{ paddingTop: '5px'}} alt='logo' src={brain} />
	      	{/*<p><a target="_blank" href="https://icons8.com/icon/2070/brain">Brain</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a></p>*/}
	      </div>
	    </Tilt>
		</div>
	)
}

export default Logo;