import React, { CSSProperties, useEffect } from "react";
import { Layout } from "../layout/layout";
import { Chip } from "@mui/material";
import add from './Add.png'
import startConvoButton from './startConvo.svg'
import './chatController.css'
import chatAvatar from './chatAvatar.svg'
import { ChatPage } from "./chatPage";

function generateRandomGradient() {
    const colors = [
      "#FF4136",
      "#FF851B",
      "#FFDC00",
      "#2ECC40",
      "#0074D9",
      "#B10DC9",
      "#85144b",
      "#F012BE",
      "#DDDDDD",
      "#111111"
    ];
  
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    const color2 = colors[Math.floor(Math.random() * colors.length)];
  
    const angle = Math.floor(Math.random() * 361);
  
    return `background: linear-gradient(${angle}deg, ${color1}, ${color2})`;
  }

interface ChatProps {
    input : string;
    setInput : React.Dispatch<React.SetStateAction<string>>;
    chips : string[];
    setChips : React.Dispatch<React.SetStateAction<string[]>>;
    setID : React.Dispatch<React.SetStateAction<string>>;
}
const CreateAConversation = ({input, setInput, chips, setChips, setID} : ChatProps) => {
    const onSubmit = () => {
        setID('1234');
    }
    return (
        <>
        <div className="Create-Convo-title">
                Talk about...
            </div>
        <div className="Create-Convo">
            
            <div className="Create-Convo-chips">
                {chips.map((chip) => (
                    <Chip label={chip}
                        variant="outlined"
                        onDelete={() => {
                            setChips(chips.filter((c) => c !== chip));
                        } } />
                ))}
            </div>
            <div className="Create-Convo-input-bar">
                <input type="text" placeholder="Add a topic you are interested in" value={input} onChange={(e) => setInput(e.target.value)} />
                <img src={add} alt="add" onClick={() => {
                    if (input !== '') {
                        setChips([...chips, input]);
                        setInput('');
                    }
                } } />
            </div>

        </div><div className="Create-Convo-button" onClick={onSubmit}>
                <img src={startConvoButton} alt="start conversation" />
            </div></>

    );
}

interface availableChats {
    chatTopic : string;
    chatId : string;
    tags : string[];
}

interface ShowAvailableChatsProps {
    availableChats : availableChats[];
    setID : React.Dispatch<React.SetStateAction<string>>;
}
const ShowAvailableChats = ({availableChats, setID} : ShowAvailableChatsProps) => {
    return (
        <>
        <div className="Available-Chats">
            {availableChats.map((chat : availableChats) => (
                <div className="Available-Chats-chat" onClick={
                    () => {
                        setID(chat.chatId);
                    }
                }>
                    <div className="Available-Chats-chat-avatar"style={{...generateRandomGradient as CSSProperties}}>
                        <img src={chatAvatar} alt="chat avatar"  />
                    </div>
                    <div className="Available-Chats-chat-topic">
                        {chat.chatTopic}
                    </div>
                    <div className="Available-Chats-chat-tags">
                        {
                            chat.tags.slice(0, 1).map((tag) => (
                                <Chip label={tag} variant="outlined" />
                            ))
                        }
                    </div>
                    
                </div>
            ))}
        </div>
        </>
    );
}


export const Chat = () => {
    const [input, setInput] = React.useState<string>('');
    const [chips, setChips] = React.useState<string[]>([]);
    const [availableChats, setAvailableChats] = React.useState<availableChats[]>(tmp);
    const [id, setId] = React.useState<string>('');
   
    return (
        <Layout>
            { id !== '' ? <ChatPage chatID={id} /> : 
            <div className="Chat-landing">
                <CreateAConversation
                    input={input}
                    setInput={setInput}
                    chips={chips}
                    setChips={setChips}
                    setID={setId}
                />
                <ShowAvailableChats availableChats={availableChats} setID={setId} />
            </div>}
            
        </Layout>
    );
}

//generate mock data: 
const tmp : availableChats[] = [
    {
        chatTopic: 'I am interested in learning about the stock market',
        chatId: '1234',
        tags: ['stock market', 'finance', 'investing']
    },
    {
        chatTopic: 'I am interested in aborting your dad',
        chatId: '1234',
        tags: ['stock market', 'finance', 'investing']
    },
   ]