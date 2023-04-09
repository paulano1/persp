import React, { useCallback, useEffect, useRef, useState } from "react";
import './newsContainer.css'
import bar from './spectrum.png'
import heart from './heart.svg'
import addcomment from './comment.svg'
import isliked from './liked.svg'
import repost from './repost.svg'
import save from './save.svg'
import { Slider } from '../components/slider'
import { ConstantSlider } from '../components/constantSlider'
import { Box, Button, Modal, Typography } from "@mui/material";

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

interface RepostContainerProps {
    url : string;
    image : string;
    title : string;
}

const RepostContainer = ({url, title, image} : RepostContainerProps) => {
    const [comment, setComment] = React.useState('')
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '60%',
            justifyContent: 'center',
            marginTop: '50%',
            marginLeft: '20%',
            backgroundColor: 'white',
            borderRadius: '10px',
        }}>
            <img src={repost} style={{width: '50px', height: '50px', marginLeft: '10px'}}/>
            <textarea placeholder="Add a comment" style={{
                overflowWrap: 'break-word',
                border: 'none',
                outline: 'none',
                height: '100px',
                padding: '10px',
                borderRadius: '10px',
            }} value={comment} onChange={(e) => setComment(e.target.value)} />
            <Box>
                <Box>
                    {title}
                </Box>
                <img src={`${image}`} style={{width: '100px', height: '100px', borderRadius: '10px'}}/>
            </Box>
        </Box>
    )
}

export const NewsContainer = React.forwardRef<HTMLDivElement, NewsContainerProps>(
        ({ title, description, image, url, whyGotRecommended }, ref) => {
    const [comment, setComment] = React.useState('')
    const [ liked, setLiked ] = React.useState<boolean>(false)
    const [modalOpen, setModalOpen] = useState(false);
    const [open, setOpen] = React.useState(false);
    const onIntersection = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Key:', entry.target.getAttribute('data-key'));
                }
            });
        },
        []
    );
    useEffect(() => {
        if (ref && (typeof ref === 'object' && 'current' in ref) && ref.current) {
            const observer = new IntersectionObserver(onIntersection);
            observer.observe(ref.current);

            return () => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            };
        }
    }, [ref, onIntersection]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
   
        return (
            <div ref={ref} className="NewsContainer">
                <div className="NewsContainer-image" style={{ backgroundImage: `url(${image})` }}>
                    <div className="NewsContainer-title">{title}</div>
                    <img height="16" width="16" src='https://icons.duckduckgo.com/ip3/www.usnews.com.ico' className="News-logo"/>
                </div>
                <div className="NewsContainer-description">{description}. <a href="#">Tap to read more.</a></div>

                <ConstantSlider
                defaultValue={20}
                openModal={() => setModalOpen(true)}
                />
                <Button onClick={handleOpen}>Open modal</Button>
                            <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    >
                           <RepostContainer 
                                url={url}
                                title={title}
                                image={image}
                            />
                            </Modal>

                <div className="News-actions">
                    <div className="News-action-quote-container">
                        <img src={repost} className="News-quote-repost-icon"/>
                        <div className="News-action-quote">
                            <input type="text" placeholder="quote repost" onChange={
                                (e) =>{
                                    setComment(e.currentTarget.value)
                                }
                            } value = {comment}></input>
                        </div>    
                    </div>
                    
                    <div className="News-action-buttons">
                        {liked ? <img src={isliked} className="News-action-btn"
                            onClick={
                                () => {
                                    setLiked(false)
                                }
                            }
                        /> : <img src={heart} className="News-action-btn" onClick={
                            () => {
                                setLiked(true)
                            }
                        }/>}
                        
                        <img src={addcomment} className="News-action-btn"/>
                        <img src={repost} className="News-action-btn" onClick={
                            () => {
                                setModalOpen(true)
                            }
                        }/>
                        <img src={save} className="News-action-btn"/>
                    </div>
                </div>
            </div>
        );
}
)


