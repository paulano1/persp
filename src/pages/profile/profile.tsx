import React from "react";
import { Layout } from "../layout/layout";
import './profile.css'
import newsicon from './news-white.png'
import info from './info.png'
import { Slider } from '../components/slider'

export const Profile = () =>{
    const personName = "Jo" 
    const [ isChecked, setIsChecked ] = React.useState<boolean>(false)
    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
      };
    return(
    
        <Layout>
            <div className="Profile-container">
                <div className="Profile">
                    <h1 style={{fontSize:'6vw', textAlign:'left',margin: '1rem 2rem 1rem', fontFamily: 'Nunito'}}>Hello, {personName}</h1>
                    <p style={{textAlign: 'left', margin: '0 2rem 0'}}>We care about your privacy. We collect data to better understand your preferences and needs. <a href="">Read our privacy statement.</a></p>
                    <button className="View-posts-btn">
                        <img src={newsicon} style={{color: 'white'}} /> View your Purrs
                    </button>
                   
                    <label className="checkbox-container">
                        <span className="checkbox-title">Stay Anonymous</span>
                        <input type="checkbox" checked={isChecked} onChange={toggleCheckbox}/>
                        <span className="checkmark"></span>
                    </label>
                    {/* line break */}
                    
                    <span style={{width: 'auto', height: '1px', margin: '1rem 0rem 0.5rem 2rem', background: '#00000050'}}></span>
                    <p style={{textAlign: 'left', marginLeft: '2rem', fontWeight: 'bold'}}>Your leanings</p>
                    <div className="LeaningContainer">

                    <Slider/>

                </div>
                </div>
            </div>
            
        </Layout>
    )
}