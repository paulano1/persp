import React, { useState } from 'react';
import './slider.css'
import info from '../newsfeed/info.png'

interface SliderProps {
  defaultValue?: number;
}

export const Slider: React.FC<SliderProps> = ({ defaultValue = 50 }) => {
  const [value, setValue] = useState(defaultValue);
  
  return (
    <div style={{width: "100%"}}>
      <div className="main-container">
        <div className="slider-container">
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            className="slider"
          />
            <div className="SpectrumContainer-directions">
            <p>Left</p>
            <p>Center</p>
            <p>Right</p>
        </div>  
        </div>
        <img src={info} className="Info-icon"/>

     

      </div>
      
    </div>
  );
};
