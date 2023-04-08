import React from "react";
import './newsContainer.css'
import bar from './spectrum.png'
import info from './info.png'

const exampleQuery = [[{"label":"Democrat","score":0.9850274324417114},{"label":"Republican","score":0.014972536824643612}]]


async function query(data: any) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/m-newhauser/distilbert-political-tweets",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}


const data = {
        title: "What could Trump’s arraignment mean for his political future?",
        description: "Former President Trump was charged with 34 felony counts today – but what could this mean for the future of his political career? NBC News’ Kristen Welker reports on the unprecedented shakeup for the race to the White House in 2024.",
        image: "https://www.usnews.com/object/image/00000187-3996-d0b6-a7e7-b9f67e3a0000/ap23064025376604.jpg?update-time=1680298477110&size=responsive640",
        url: "https://www.usnews.com/news/politics/articles/2021-01-13/what-could-trumps-arraignment-mean-for-his-political-future",
        whyGotRecommended: "You might be interested in this article because you are interested in politics."
    }


interface NewsContainerProps {
        title: string;
        description: string;
        image: string;
        url: string;
        whyGotRecommended: string;
    }
    
export const NewsContainer = ({ title, description, image, url, whyGotRecommended }: NewsContainerProps) => {
        return (
            <div className="NewsContainer">
                <div className="NewsContainer-image" style={{ backgroundImage: `url(${image})` }}>
                    <div className="NewsContainer-title">{title}</div>
                    <img height="16" width="16" src='https://icons.duckduckgo.com/ip3/www.usnews.com.ico' className="News-logo"/>
                </div>
                <div className="NewsContainer-description">{description}. <a href="#">Tap to read more.</a></div>
                <div className="LeaningContainer">
                    <div className="SpectrumContainer">
                        {/* <img src={bar} className="Spectrum-image"/> */}
                        <div className="Spectrum-gradient">
                            <div className="Spectrum-slider">
                            </div>
                        </div>
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
}




