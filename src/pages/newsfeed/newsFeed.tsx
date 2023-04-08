import React, { useState, useEffect } from "react";
import { TokenGroup } from "./tokenGroup";
import { Layout } from "../layout/layout";
import { NewsContainer } from "./newsContainer";
import './index.css'

interface News {
    title: string;
    description: string;
    image: string;
    url: string;
    whyGotRecommended: string;
}

export const NewsFeed = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setIsLoading(true);
        const response = returnMockNews()
        const data = response
        setNewsList(prevList => [...prevList, ...data]);
        setIsLoading(false);
    };

    const handleScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
        if (scrollTop === 0 && !isLoading) {
            setPage(prevPage => prevPage + 1);
            fetchNews();
        }
    };

    return (
        <Layout>
           <div style={{overflowX: 'scroll'}}>
                <TokenGroup tags={data} />
            </div>
            <div className="Goodmorning">
                <p style={{fontSize:'6vw', textAlign:'left',margin: '0 2rem 1rem', font: 'Nunito'}}>
                good afternoon! here’s your news pick for today

                </p>
            </div>
            <div onScroll={handleScroll} style={{ overflowY: "scroll", height: "calc(100vh - 200px)" }}>
                {newsList.map((newsItem, index) => (
                    <NewsContainer
                        key={index}
                        title={newsItem.title}
                        description={newsItem.description}
                        image={newsItem.image}
                        url={newsItem.url}
                        whyGotRecommended={newsItem.whyGotRecommended}
                    />
                ))}
                {isLoading && <p>Loading...</p>}
            </div>
        </Layout>
    );
}




const data = [
    'hello',
    'world',
    'hello1',
    'world1',
    'hello2',
    'world2',
    'hello3',
]

function returnMockNews(): News[] {
    return Array.from({ length: 10 }, (_, index) => ({
        title: `News ${index}`,
        description: `Description ${index}`,
        image: `https://picsum.photos/200/300?random=${index}`,
        url: `https://www.google.com/search?q=${index}`,
        whyGotRecommended: `You might be interested in this article because you are interested in ${data[index]}.`
    }));
}
const news = {
    title: "What could Trump’s arraignment mean for his political future?",
    description: "Former President Trump was charged with 34 felony counts today – but what could this mean for the future of his political career? NBC News’ Kristen Welker reports on the unprecedented shakeup for the race to the White House in 2024.",
    image: "https://www.usnews.com/object/image/00000187-3996-d0b6-a7e7-b9f67e3a0000/ap23064025376604.jpg?update-time=1680298477110&size=responsive640",
    url: "https://www.usnews.com/news/politics/articles/2021-01-13/what-could-trumps-arraignment-mean-for-his-political-future",
    whyGotRecommended: "You might be interested in this article because you are interested in politics."
}
