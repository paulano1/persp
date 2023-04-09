import React, { useEffect, useState } from "react";
import './chatPage.css'
import sendIcon from './send.svg'
import backIcon from './chats.svg'

interface ChatMessage {
    content: string;
    created: string;
    senderID: string;
  }

interface ChatProps {
    chatID: string;
    }




export const ChatPage = ({chatID} : ChatProps) => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>(temporaryData);
    const userID = 'jkahsdkjhajk'
    useEffect(() => {
        const interval = setInterval(() => {
            // console.log(chatID);
            // fetch(`http://198.74.61.204/getMessages/${chatID}`, {
            //     headers: {
            //       Accept: "application/json"
            //     }
            //   }).then((response) => response.json()).then((data) => {
            //     setMessages(data);
            //   });
        }, 5000);
    
        return () => clearInterval(interval);
      }, [])
    const onSendMessage = (message: string) => {
        //send a post request
        // fetch("http://198.74.61.204/sendMessage", {
        //             body: JSON.stringify({
        //                 session_id: chatID,
        //                 user_id: userID,
        //                 message: message,
        //             }),

        //             headers: {
        //                 Accept: "application/json",
        //                 "Content-Type": "application/json"
        //             },
        //             method: "POST"
        //                 }).catch((error) => {
        //                     console.log(error);
        //                 })
    }
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSendMessage(inputValue);
        setInputValue('');
    };
    return (
      <>
      <img src={backIcon} style={{width: '5rem', margin: '1rem'}}alt="" onClick={
        () => {
          window.location.href = '/chat'
      }}/>
        <div className="chat-container">
          <div className="messages-container">
            <span style={{backgroundColor: '#dbdbdb', height: '3rem', alignItems: 'center', borderRadius: '15px', padding: '1rem', marginBottom: '1rem'}}><b>Suggested topic:</b> Why should government invest in planned parenthood?</span>
            {messages.map((message: ChatMessage, index: number) => (
              message.senderID === userID ? (
                
                <div className="message-user" key={index}>
                    <div className="message-content">{message.content}</div>
                </div>) : (
               <div>
                 <p className="username" style={{marginLeft: '1rem'}}>{`Pakalu Pakito`}: </p>
                 <div className="message-reciever" key={index}>
                    <div className="message-content">{message.content}</div>
                </div>
               </div>  
                )
            ))}
          </div>
          <form className="sendTextContainer" onSubmit={handleFormSubmit}>
            <input type="text" placeholder="write a message (be respectful)" value={inputValue} onChange={handleInputChange} />
            <button type="submit"><img src={sendIcon} /></button>
          </form>
        </div>
    </>
      );
    };


const temporaryData = [

  {
    content: 'Honestly I strongly relate to it',
    created: 'string',
    senderID: 'string',
  },
  {
    content: 'Pretty controversial but makes sense',
    created: 'string',
    senderID: 'jkahsdkjhajk'
  },
  {
    content: 'what do you guys think?',
    created: 'string',
    senderID: 'jkahsdkjhajk'
  },
  {
    content: 'hmmm that sounds interesting',
    created: 'string',
    senderID: 'jkahsdkjhajk'
  },
]