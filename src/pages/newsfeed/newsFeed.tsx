import React from "react";
import { TokenGroup } from "./tokenGroup";
import { Layout } from "../layout/layout";
import { NewsContainer } from "./newsContainer";
import './index.css'

const data = [
    'hello',
    'world',
    'hello1',
    'world1',
    'hello2',
    'world2',
    'hello3',
]
const news = {
    title: "What could Trump’s arraignment mean for his political future?",
    description: "Former President Trump was charged with 34 felony counts today – but what could this mean for the future of his political career? NBC News’ Kristen Welker reports on the unprecedented shakeup for the race to the White House in 2024.",
    image: "https://www.usnews.com/object/image/00000187-3996-d0b6-a7e7-b9f67e3a0000/ap23064025376604.jpg?update-time=1680298477110&size=responsive640",
    url: "https://www.usnews.com/news/politics/articles/2021-01-13/what-could-trumps-arraignment-mean-for-his-political-future",
    whyGotRecommended: "You might be interested in this article because you are interested in politics."
}

export const NewsFeed = () => {

    return (
        <Layout>
           <div style={{overflowX: 'scroll'}}>
                <TokenGroup tags={data} />
            </div>
            <div className="Goodmorning">
                <p style={{fontSize:'6vw', textAlign:'left',margin: '0 2rem 1rem'}}>
                good afternoon! here’s your news pick for today

                </p>
            </div>
            <div>
            <NewsContainer
                title={news.title}
                description={news.description}
                image={news.image}
                url={news.url}
                whyGotRecommended={news.whyGotRecommended}
            />
        </div>
        
        </Layout>
    );
}


