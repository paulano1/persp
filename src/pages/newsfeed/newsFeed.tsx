import React, { useState, useEffect, useRef } from "react";
import { TokenGroup } from "./tokenGroup";
import { Layout } from "../layout/layout";
import { NewsContainer } from "./newsContainer";
import './index.css'
import { useCallback } from 'react';
interface News {
    title: string;
    description: string;
    image: string;
    url: string;
    whyGotRecommended: string;
}
function useOnScreen(options: any) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, options);
  
      if (ref.current) {
        observer.observe(ref.current);
      }
  
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [options]);
  
    return [ref, isVisible];
  }

export const NewsFeed = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [containerRef, isVisible] = useOnScreen({ rootMargin: '0px', threshold: 0.5 });
    useEffect(() => {
        if (isVisible) {
            if (containerRef && (typeof containerRef === 'object' && 'current' in containerRef) && containerRef.current) {
            console.log('The key of the NewsContainer on the screen:', containerRef.current);
          } else {
            console.log('The ref does not have a current property.');
          }
        }
      }, [isVisible, containerRef]);
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

    const handleScroll = (index: number) => {
    };

    return (
        <Layout>
           <div style={{overflowX: 'scroll'}}>
                <TokenGroup tags={data} />
            </div>
            
            <div style={{ overflowY: "scroll", height: "calc(100vh - 200px)" }}>
              <div className="Goodmorning">
                  <p style={{fontSize:'6vw', textAlign:'left',margin: '0 2rem 1rem', font: 'Nunito'}}>
                  good afternoon! here’s your news pick for today

                  </p>
              </div>
                {newsList.map((newsItem, index) => {
                    handleScroll(index);
                    return (
                        <NewsContainer
                        ref={containerRef as any}
                            key={index}
                            title={newsItem.title}
                            description={newsItem.description}
                            image={newsItem.image}
                            url={newsItem.url}
                            whyGotRecommended={newsItem.whyGotRecommended}
                        />
                    );
                })}
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