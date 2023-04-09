import React, { useState, useEffect, useRef } from "react";
import { TokenGroup } from "./tokenGroup";
import { Layout } from "../layout/layout";
import { NewsContainer } from "./newsContainer";
import './index.css'
import { QuizContainer } from "./quiz";
import { auth } from "../../firebase/firebase";
import axios from "axios";
import { title } from "process";
import openai from "openai";

let flag = 0

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
    const [quizData, setQuizData] = useState<QuizContent>();
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
        const news = convertToNewsArray(mockData)
        setNewsList( (prevNewsList) => {
          return [...prevNewsList, ...news];
        });
        setIsLoading(false);
      }
    };

    const handleScroll = (index: number) => {
    };

    const conditionalRender = (index: number, url : string) => {
        if (index % 7 === 0) {
          axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'user',
                  content: `As a question generator, generate one specific question pertaining to this article: ${articleUrl}. Provide exactly four options for answers, as well as the right answer. Do not use indexing for the options. Format it to JSON with fields: question, options and answer.`,
                },
              ],
              "temperature": 0.7,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
            }
          ).then((response) => {
            const content = JSON.parse(response.data.choices[0].message.content);
        setQuizData( {
              question: content.question,
              options: content.options,
              answer: content.answer,
            })
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

                    if (conditionalRender(index, newsItem.url) ) {
                      return (
                           <QuizContainer question={quizContent.question} options={quizContent.options} answer={quizContent.answer} />)
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


const news = {
    title: "What could Trump’s arraignment mean for his political future?",
    description: "Former President Trump was charged with 34 felony counts today – but what could this mean for the future of his political career? NBC News’ Kristen Welker reports on the unprecedented shakeup for the race to the White House in 2024.",
    image: "https://www.usnews.com/object/image/00000187-3996-d0b6-a7e7-b9f67e3a0000/ap23064025376604.jpg?update-time=1680298477110&size=responsive640",
    url: "https://www.usnews.com/news/politics/articles/2021-01-13/what-could-trumps-arraignment-mean-for-his-political-future",
    whyGotRecommended: "You might be interested in this article because you are interested in politics."
}
const quizContent = {
  question: "What is the capital of the United States?",
  options: ["New York", "Washington", "Los Angeles", "Chicago"],
  answer: "Washington",
}

interface QuizContent {
  question: string;
  options: string[];
  answer: string;
}

async function generateQuestion(articleUrl: string): Promise<QuizContent> {
  const apiKey = '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';
  

  let quizContent: QuizContent;
 if (flag === 0) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `As a question generator, generate one specific question pertaining to this article: ${articleUrl}. Provide exactly four options for answers, as well as the right answer. Do not use indexing for the options. Format it to JSON with fields: question, options and answer.`,
          },
        ],
        "temperature": 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const content = JSON.parse(response.data.choices[0].message.content);
    quizContent = {
      question: content.question,
      options: content.options,
      answer: content.answer,
    };
    return quizContent;
    flag += 1;
  } catch (error) {
    quizContent = {
      question: "What is the capital of the United States?",
      options: ["New York", "Washington", "Los Angeles", "Chicago"],
      answer: "Washington",
    } }
    finally {
      return {
        question: "What is the capital of the United States?",
        options: ["New York", "Washington", "Los Angeles", "Chicago"],
        answer: "Washington",
      } ;
    }
  } else{
    return {
      question: "What is the capital of the United States?",
      options: ["New York", "Washington", "Los Angeles", "Chicago"],
      answer: "Washington",
    } ;
  }
}


const mockData = [
  {
      "author": "Natalie Musumeci",
      "content": "Former President Donald Trump sits at the defense table with his defense team in a Manhattan court, Tuesday, April 4, 2023.AP Photo/Seth Wenig, Pool\r\n<ul>\n<li>Many legal experts have said the indictm [+3707 chars]",
      "description": "Donald Trump was charged by a grand jury with 34 felony counts of falsifying business records in an indictment related to hush-money payments.",
      "title": "Even left-leaning publications are saying the Manhattan DA's criminal case against Donald Trump is anything but a slam dunk",
      "topic": "left-leaning",
      "url": "https://www.businessinsider.com/left-leaning-publications-donald-trump-indictment-2023-4",
      "urlToImage": "https://i.insider.com/642dc3b3de7d9200193a2ccd?width=1200&format=jpeg"
  },
  {
      "author": "Stephen Burgen in Barcelona",
      "content": "A new political party has launched in Spain, composed of more than a dozen left-leaning groups and led by a lifelong communist who aims to become the countrys first female president.\r\nYolanda Díaz, w [+3499 chars]",
      "description": "Communist Yolanda Díaz brings together multiple groups under Sumar banner and aims to become countrys first female presidentA new political party has launched in Spain, composed of more than a dozen left-leaning groups and led by a lifelong communist who aim",
      "title": "Spain launches new leftwing political party in major shake-up",
      "topic": "left-leaning",
      "url": "https://www.theguardian.com/world/2023/apr/03/spain-leftwing-political-party-sumar-major-shake-up-yolanda-diaz",
      "urlToImage": "https://i.guim.co.uk/img/media/f55261a0ce8a91c145a2a57248badfbaf30540c7/0_272_5000_3000/master/5000.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctZGVmYXVsdC5wbmc&enable=upscale&s=fae81712dad8160d0eda3fc6296e6260"
  },
  {
      "author": "David Rozado",
      "content": "The English linguist J. R. Firth famously said:\r\nYou shall know a word by the company it keeps (Firth, J. R. 1957:11)\r\nas a way of highlighting the context-dependent nature of meaning, a property wid [+4129 chars]",
      "description": "Visualizing what words often appear in the vicinity of woke/wokeness in news media content illustrates why communication is almost impossible between red and blue America",
      "title": "Define Wokeness Or how you shall know a word by the company it keeps",
      "topic": "left-leaning",
      "url": "https://davidrozado.substack.com/p/wo",
      "urlToImage": "https://substackcdn.com/image/fetch/w_1200,h_600,c_limit,f_jpg,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8411cd6b-71cc-42fd-a733-8b8047ba98d1_3991x3341.jpeg"
  },
  {
      "author": "Kyle Barr",
      "content": "Alex Jones is suffering under the weight of massive lawsuits and harsh social media bans, but hes still finding ways to get his crazed philosophy out into the wider web. A Media Matters for America i [+4522 chars]",
      "description": "Alex Jones is suffering under the weight of massive lawsuits and harsh social media bans, but hes still finding ways to get his crazed philosophy out into the wider web. A Media Matters for America investigation released Friday found that a website heavily l",
      "title": "Alex Jones' Alleged Secret Site Gets Around Social Media Bans",
      "topic": "left-leaning",
      "url": "https://gizmodo.com/alex-jones-infowars-national-file-facebook-twitter-1850238082",
      "urlToImage": "https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/c925a083a132e3cc19f49965048bf43f.jpg"
  },
  {
      "author": "https://www.facebook.com/bbcnews",
      "content": "A supporter of Donald Trump made headlines last year when he said: \"We are uncancellable by big tech.\"\r\nThe defiant claim came from Devin Nunes, who is the chief executive of Trump Media and Technolo [+7499 chars]",
      "description": "Website and app Rumble says it offers an uncensored rival to the likes of YouTube and Twitter.",
      "title": "The web firm that wants to stop you getting 'cancelled'",
      "topic": "left-leaning",
      "url": "https://www.bbc.co.uk/news/business-65050160",
      "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/932F/production/_129097673_rumble2.jpg"
  },
  {
      "author": "Andrew Winston",
      "content": "Retreat isnt just inadvisable; its dangerous.\r\n\"&gt;\r\nThe culture wars in the U.S. continue to rage, and theyve come for business. Companies are being dragged into issues that stir emotions, such a [+15070 chars]",
      "description": "U.S. business leaders are increasingly being exposed to the culture wars, with company decisions around issues like DEI, LGBTQ+ rights, abortion and even ESG investing being attacked by right-leaning politicians and pundits. Instead of retreating to the sidel",
      "title": "Why Business Leaders Must Resist the Anti-ESG Movement",
      "topic": "right-leaning",
      "url": "https://hbr.org/2023/04/why-business-leaders-must-resist-the-anti-esg-movement",
      "urlToImage": "https://hbr.org/resources/images/article_assets/2023/03/Apr23_05_3053550.jpg"
  },
  {
      "author": "Christian Edwards",
      "content": "Chris Pratt has opened up about how he met his now-wife, writer Katherine Schwarzenegger, and why their encounter came at just the right time.\r\nSpeaking on The Drew Barrymore ShowTuesday, the Super M [+1877 chars]",
      "description": "Chris Pratt has opened up about how he met his now-wife, writer Katherine Schwarzenegger, and why their encounter came at just the right time.",
      "title": "Chris Pratt says he felt 'broken' before meeting wife Katherine Schwarzenegger",
      "topic": "right-leaning",
      "url": "https://www.cnn.com/2023/04/05/entertainment/chris-pratt-katherine-schwarzenegger-intl-scli/index.html",
      "urlToImage": "https://media.cnn.com/api/v1/images/stellar/prod/230405051512-01-chris-pratt-katherine-schwarzenegger-040123-restricted.jpg?c=16x9&q=w_800,c_fill"
  },
  {
      "author": "Tami Luhby",
      "content": "President Joe Biden and House Republicans have promised not to touch Social Security in their battle over cutting spending to address the nations debt ceiling crisis.\r\nWhile that vow is intended to i [+3330 chars]",
      "description": "President Joe Biden and House Republicans have promised not to touch Social Security in their battle over cutting spending to address the nation's debt ceiling crisis. While that vow is intended to indicate support of the popular entitlement program, it could",
      "title": "Not touching Social Security could lead to 20% benefit cut within a decade",
      "topic": "right-leaning",
      "url": "https://www.cnn.com/2023/03/08/politics/social-security-benefit-cut/index.html",
      "urlToImage": "https://media.cnn.com/api/v1/images/stellar/prod/230307132423-social-security-benefit-cut.jpg?c=16x9&q=w_800,c_fill"
  },
  {
      "author": "Kyle Barr",
      "content": "Alex Jones is suffering under the weight of massive lawsuits and harsh social media bans, but hes still finding ways to get his crazed philosophy out into the wider web. A Media Matters for America i [+4522 chars]",
      "description": "Alex Jones is suffering under the weight of massive lawsuits and harsh social media bans, but hes still finding ways to get his crazed philosophy out into the wider web. A Media Matters for America investigation released Friday found that a website heavily l",
      "title": "Alex Jones' Alleged Secret Site Gets Around Social Media Bans",
      "topic": "right-leaning",
      "url": "https://gizmodo.com/alex-jones-infowars-national-file-facebook-twitter-1850238082",
      "urlToImage": "https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/c925a083a132e3cc19f49965048bf43f.jpg"
  },
  {
      "author": "Natalie Musumeci",
      "content": "Former President Donald Trump sits at the defense table with his defense team in a Manhattan court, Tuesday, April 4, 2023.AP Photo/Seth Wenig, Pool\r\n<ul>\n<li>Many legal experts have said the indictm [+3707 chars]",
      "description": "Donald Trump was charged by a grand jury with 34 felony counts of falsifying business records in an indictment related to hush-money payments.",
      "title": "Even left-leaning publications are saying the Manhattan DA's criminal case against Donald Trump is anything but a slam dunk",
      "topic": "right-leaning",
      "url": "https://www.businessinsider.com/left-leaning-publications-donald-trump-indictment-2023-4",
      "urlToImage": "https://i.insider.com/642dc3b3de7d9200193a2ccd?width=1200&format=jpeg"
  },
  {
      "author": "Ben Morse",
      "content": "It is one of the few things in sports which has never been achieved before. \r\nMarch Madness is a few weeks which many sports fans have circled on their calendars. And one of the favorite activities a [+5903 chars]",
      "description": "It is one of the few things in sports which has never been achieved before.",
      "title": "More likely for family of four to get hit by lightning: The astronomical odds of selecting a perfect March Madness bracket",
      "topic": "sports",
      "url": "https://www.cnn.com/2023/03/13/sport/march-madness-perfect-bracket-odds-spt-intl/index.html",
      "urlToImage": "https://media.cnn.com/api/v1/images/stellar/prod/230307104016-01-march-madness-2022.jpg?c=16x9&q=w_800,c_fill"
  },
  {
      "author": "Seth Godin",
      "content": "School sports can have some valuable outputs:\r\n<ul><li>Learning teamwork</li><li>A lifetime habit of fitness</li><li>Giving non-academically-focused kids a chance to shine</li><li>Offering leadership [+1131 chars]",
      "description": "School sports can have some valuable outputs: And yet, many schools act as if all they have is a trophy shortage. They bench kids who might not (yet) have the physical attributes necessary to win, or they build huge stadiums, go on long road trips, berate stu",
      "title": "Rethinking the Sports-Industrial Complex",
      "topic": "sports",
      "url": "https://seths.blog/2023/03/rethinking-the-sports-industrial-complex/",
      "urlToImage": "https://149521506.v2.pressablecdn.com/wp-content/uploads/2018/06/seth_godin_ogimages_v02_180613-1.jpg"
  },
  {
      "author": "Thomas Schlachter",
      "content": "It has become a rite of passage for sports fans to fill out their annual March Madness brackets for the NCAA basketball tournaments.\r\nHowever, all the planning and preparation for many has been blown [+1720 chars]",
      "description": "It has become a rite of passage for sports fans to fill out their annual March Madness brackets for the NCAA basketball tournaments.",
      "title": "March Madness: Princeton's shock victory leaves only 0.065% of brackets remaining intact",
      "topic": "sports",
      "url": "https://www.cnn.com/2023/03/17/sport/march-madness-princeton-shock-brackets-spt-intl/index.html",
      "urlToImage": "https://media.cnn.com/api/v1/images/stellar/prod/230317080955-02-march-madness-princeton-arizona-0316.jpg?c=16x9&q=w_800,c_fill"
  },
  {
      "author": "Wayne Sterling, Steve Almasy",
      "content": "Charlie Baker has been NCAA president for less than two weeks, but he knows he is coming into his role in the governing body of major college sports during a tumultuous time.\r\nBaker, most recently th [+5805 chars]",
      "description": "Charlie Baker has been NCAA president for less than two weeks, but he knows he is coming into his role in the governing body of major college sports during a tumultuous time.",
      "title": "New NCAA President Charlie Baker admits it's a 'tumultuous time' in college sports",
      "topic": "sports",
      "url": "https://www.cnn.com/2023/03/14/sport/ncaa-charlie-baker-president-spt-intl/index.html",
      "urlToImage": "https://media.cnn.com/api/v1/images/stellar/prod/230314173439-ncaa-president-charlie-baker-intv.jpg?c=16x9&q=w_800,c_fill"
  },
  {
      "author": "Guardian Staff",
      "content": "Going out:Cinema\r\nChampionsOut nowSince making a name for himself as a gross-out master with Dumb and Dumber (directed with his brother Peter), Bobby Farrellys films have been a mixed bag. Hes on fam [+9785 chars]",
      "description": "Whether its a film comedy about an unusual basketball team or a TV drama set on the Costa Del Crime, our critics have you covered for the next seven daysChampionsOut nowSince making a name for himself as a gross-out master with Dumb and Dumber (directed with",
      "title": "From Champions to A Town Called Malice: a complete guide to this weeks entertainment",
      "topic": "entertainment",
      "url": "https://www.theguardian.com/culture/2023/mar/11/going-out-staying-in-champions-a-town-called-malice-complete-guide-to-entertainment-this-week",
      "urlToImage": "https://i.guim.co.uk/img/media/518f5427d0a2735c40e2efe9b55503acbfdc954c/0_19_2837_1703/master/2837.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctZGVmYXVsdC5wbmc&enable=upscale&s=343414a6066ca240989de57224150927"
  },
  {
      "author": "Leah Dolan, CNN",
      "content": "Featuring the good, the bad and the ugly, 'Look of the Week' is a regular series dedicated to unpacking the most talked about outfit of the last seven days.\r\nLewis Hamilton is putting a new spin on t [+2230 chars]",
      "description": "Lewis Hamilton is putting a new spin on the term \"fast fashion.\" In recent years, the world champion Formula One driver has slowly but surely steered into the world of high fashion  using the racetrack, and accompanying appearances, as his own makeshift runw",
      "title": "Look of the Week: Lewis Hamilton's high fashion joyride",
      "topic": "fashion",
      "url": "https://www.cnn.com/style/article/lewis-hamilton-rick-owens-f1-fashion-lotw/index.html",
      "urlToImage": "https://cdn.cnn.com/cnnnext/dam/assets/230322120311-02-lotw-0322-louis-hamilton-fashion-grand-prix-rick-owens-super-tease.jpg"
  },
  {
      "author": "Sabina Graves",
      "content": "Walt Disney Worlds new Tronmerchandise capitalizes on Flynns arcade and the Grid with futuristic gear, program-inspired toys, and throwback fashion. \r\nio9 attended a preview of new attraction Tron: L [+284 chars]",
      "description": "Walt Disney Worlds new Tron merchandise capitalizes on Flynns arcade and the Grid with futuristic gear, program-inspired toys, and throwback fashion. Read more...",
      "title": "Tron Merch at Walt Disney World Offers Sci-Fi Fits, Retro Toys, and Custom Figures",
      "topic": "fashion",
      "url": "https://gizmodo.com/tron-merch-walt-disney-world-tron-legacy-disney-parks-1850301695",
      "urlToImage": "https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/df3c0283fedb0e87c541c7b175a89a9d.jpg"
  },
  {
      "author": "Michelle Toh, Robert North",
      "content": "HSBC has scooped up the UK arm of Silicon Valley Bank for £1 ($1.2), just days after its business in the United States collapsed in stunning fashion.\r\nSVB UK had been placed into insolvency by the Ba [+585 chars]",
      "description": "HSBC has scooped up the UK arm of Silicon Valley Bank for £1 ($1.2), just days after its business in the United States collapsed in stunning fashion.",
      "title": "HSBC is buying SVB's UK business for just over $1",
      "topic": "fashion",
      "url": "https://www.cnn.com/2023/03/13/investing/svb-uk-business-deal-intl-hnk/index.html",
      "urlToImage": "https://media.cnn.com/api/v1/images/stellar/prod/230313071812-hsbc-london-file-2022-restricted.jpg?c=16x9&q=w_800,c_fill"
  },
  {
      "author": "David Goldman",
      "content": "Silicon Valley Bank failed in rapid, stunning fashion Friday. This week, the tech and banking sector are growing skittish about the next shoe to drop.\r\nWhat took place Friday was an old-fashioned ban [+4773 chars]",
      "description": "Silicon Valley Bank failed in rapid, stunning fashion Friday. This week, the tech and banking sector are growing skittish about the next shoe to drop.",
      "title": "What's the next Silicon Valley Bank  and how can the US prevent more chaos?",
      "topic": "fashion",
      "url": "https://www.cnn.com/2023/03/12/investing/silicon-valley-bank-bailout/index.html",
      "urlToImage": "https://media.cnn.com/api/v1/images/stellar/prod/230312095700-02-silicon-valley-bank-031223.jpg?c=16x9&q=w_800,c_fill"
  },
  {
      "author": "Chloe Mac Donnell",
      "content": "Robotic dogs, crowd surfing models and a drag queen cosplaying as Jennifer Coolidge. Fashion month has officially come to a close but after four weeks of viral moments you have to ask: does anyone re [+5520 chars]",
      "description": "In this weeks newsletter: Kylie Jenner wearing a faux lion head, Doja Cat covered in Swarovski crystals  dressing to go viral is dominating fashion.<ul><li>Dont get Fashion Statement delivered to your inbox? Sign up here</li></ul>Robotic dogs, crowd surfin",
      "title": "Is anyone else bored of stunt dressing?",
      "topic": "fashion",
      "url": "https://www.theguardian.com/fashion/2023/mar/10/is-anyone-else-bored-of-stunt-dressing",
      "urlToImage": "https://i.guim.co.uk/img/media/133d4770ec756c0f06f3dbf016dedfca6f45db14/0_278_1999_1198/master/1999.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctZGVmYXVsdC5wbmc&enable=upscale&s=e9b5b70e8a7ed15e8190e368293a7bce"
  },
  {
      "author": "Jake Peterson",
      "content": "Heres a familiar travel scenario: You just checked out of your hotel, but you have a while before your flight. Thats fine, because you have plenty of time to relax and explore the city before you lea [+2567 chars]",
      "description": "Heres a familiar travel scenario: You just checked out of your hotel, but you have a while before your flight. Thats fine, because you have plenty of time to relax and explore the city before you leave. But just before you step out into the world for a fun ",
      "title": "This Service Will Hang Onto Your Luggage While You Explore a New City",
      "topic": "travel",
      "url": "https://lifehacker.com/this-service-will-hang-onto-your-luggage-while-you-expl-1850274154",
      "urlToImage": "https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/604b77afdcd8c4189586f4b2e8967e8e.png"
  },
  {
      "author": "https://www.facebook.com/bbcnews",
      "content": "China is to resume issuing visas to foreign tourists for the first time since the Covid pandemic broke out three years ago.\r\nThe major easing of restrictions comes after Beijing declared victory over [+1444 chars]",
      "description": "The move marks a major easing of travel curbs in place since the start of the Covid pandemic.",
      "title": "China reopening borders to foreign tourists for first time since Covid erupted",
      "topic": "travel",
      "url": "https://www.bbc.co.uk/news/world-asia-china-64948594",
      "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/88A1/production/_128977943_gettyimages-1247937388.jpg"
  }
]

interface InitialNewsFormat {
  author: string;
  content: string;
  description: string;
  title: string;
  topic: string;
  url: string;
  urlToImage: string;
}

function convertToNewsArray(initialNewsArray: InitialNewsFormat[]): News[] {
  return initialNewsArray.map((newsItem) => {
    return {
      title: newsItem.title,
      description: newsItem.description,
      image: newsItem.urlToImage,
      url: newsItem.url,
      whyGotRecommended: `Recommended based on ${newsItem.topic} preference`,
    };
  });
}
