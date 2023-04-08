import React, { CSSProperties } from "react";
import { Layout } from "../layout/layout";
import { Chip } from "@mui/material";
import add from './Add.png'
import startConvoButton from './startConvo.svg'
import './chatController.css'
import chatAvatar from './chatAvatar.svg'

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
}
const CreateAConversation = ({input, setInput, chips, setChips} : ChatProps) => {
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

        </div><div className="Create-Convo-button">
                <img src={startConvoButton} alt="start conversation" />
            </div></>

    );
}

interface availableChats {
    chatTopic : string;
    chatId : string;
    tags : string[];
}


const ShowAvailableChats = ({availableChats} : any) => {
    return (
        <>
        <div className="Available-Chats">
            {availableChats.map((chat : availableChats) => (
                <div className="Available-Chats-chat">
                    <div className="Available-Chats-chat-topic">
                        {chat.chatTopic}
                    </div>
                    <div className="Available-Chats-chat-tags">
                        {chat.tags.map((tag) => (
                            <Chip label={tag} variant="outlined" />
                        ))}
                    </div>
                    <div className="Available-Chats-chat-avatar"style={{...generateRandomGradient as CSSProperties}}>
                        <img src={chatAvatar} alt="chat avatar"  />
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
    return (
        <Layout>
            <div className="Chat-landing">
                <CreateAConversation
                    input={input}
                    setInput={setInput}
                    chips={chips}
                    setChips={setChips}
                />
                <ShowAvailableChats availableChats={availableChats} />
            </div>
            
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
    {
        chatTopic: 'PLEASE NO CSSS',
        chatId: '1234',
        tags: ['stock market', 'finance', 'investing']
    }]