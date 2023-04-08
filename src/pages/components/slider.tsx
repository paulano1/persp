import React, { useState } from 'react';
import './slider.css'

interface SliderProps {
  defaultValue?: number;
}

export const Slider: React.FC<SliderProps> = ({ defaultValue = 50 }) => {
  const [value, setValue] = useState(defaultValue);
  
  return (
    <div>
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
  );
};
