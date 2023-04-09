import React, { useState, useEffect, useRef } from "react";
import { TokenGroup } from "./tokenGroup";
import { Layout } from "../layout/layout";
import { NewsContainer } from "./newsContainer";
import './index.css'
import { QuizContainer } from "./quiz";
import { auth } from "../../firebase/firebase";

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
        console.log(sessionStorage.getItem('user'))
    }, []);

    const fetchNews = async () => {
      if (auth !== null) {
        setIsLoading(true);
        const uid = sessionStorage.getItem('user')
        if (uid === null) {
          return
        }
        const news = await returnMockNews(uid);
        setNewsList( (prevNewsList) => {
          return [...prevNewsList, ...news];
        });
        setIsLoading(false);
      }
    };

    const handleScroll = (index: number) => {
    };

    const conditionalRender = (index: number) => {
      console
        if (index % 7 === 0) {
            return true;
        }
        return false;
    };

    return (
        <Layout>
           <div style={{overflowX: 'scroll'}}>
                <TokenGroup tags={data} />
            </div>
            
            <div style={{ overflowY: "scroll", height: "calc(100vh - 200px)" }}>
              <div className="Goodmorning">
                  <p style={{fontSize:'6vw', textAlign:'left',margin: '0 2rem 1rem', fontFamily: 'Nunito'}}>
                  good afternoon! here are your news picks for today

                  </p>
              </div>
                {newsList.map((newsItem, index) => {
                    handleScroll(index);

                    if (conditionalRender(index)) {
                      return (
                           <QuizContainer question={quizData.question} options={quizData.options} answer={quizData.answer} />)
                      }
                      else {
                        return (
                            <NewsContainer
                            ref={containerRef as any}
                                key={index}
                                title={newsItem.title}
                                description={newsItem.description}
                                image={newsItem.image}
                                url={newsItem.url}
                                whyGotRecommended={newsItem.whyGotRecommended}
                            />)}
                })}
                {isLoading && <p>Loading...</p>}
            </div>
        </Layout>
    );
}

const data = [
   "Today's pick", 
   "left-leaning", 
   "right-leaning",
   "finance",
   "sports",
   "entertainment",
   "fashion",
   "travel",
   "food",
   "environment",
   "health",
]

async function returnMockNews(uid : string ): Promise<News[]> {
  const response = await fetch('https://fb6c-65-113-61-98.ngrok-free.app/match_user_posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid: "userid1",
    }),
  })
  const data = await response.json();
  console.log(data);
  return data.map((item: any) => {
    return {
      title: item.title,
      description: item.description,
      image: item.urlToImage,
      url: item.url,
      whyGotRecommended: item.whyGotRecommended,
    }
  })
}

const news = {
    title: "What could Trump’s arraignment mean for his political future?",
    description: "Former President Trump was charged with 34 felony counts today – but what could this mean for the future of his political career? NBC News’ Kristen Welker reports on the unprecedented shakeup for the race to the White House in 2024.",
    image: "https://www.usnews.com/object/image/00000187-3996-d0b6-a7e7-b9f67e3a0000/ap23064025376604.jpg?update-time=1680298477110&size=responsive640",
    url: "https://www.usnews.com/news/politics/articles/2021-01-13/what-could-trumps-arraignment-mean-for-his-political-future",
    whyGotRecommended: "You might be interested in this article because you are interested in politics."
}

const quizData = {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris"
}



