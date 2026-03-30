import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes }) => {
	if (!imageUrl) return null;
	
	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img 
					id='inputimage' 
					alt='' 
					src={imageUrl || null} 
					width='500px' 
					height='auto' 
				/>
				{boxes.map((box, i) => (
				  <div
				    key={i}
				    className='bounding-box'
				    style={{
				      top: box.topRow,
				      right: box.rightCol,
				      bottom: box.bottomRow,
				      left: box.leftCol
				    }}
				  />
				))}
				
			</div>
		</div>
	)
}

export default FaceRecognition;