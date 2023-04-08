import React from "react";
import { Container } from '@mui/material';
import plusImg from './plus-logo.svg';
import news from './news.svg';
import chat from './chat.svg';
import user from './user.svg';

interface LayoutProps {
    children?: React.ReactNode;
}

const Header = ({children}: LayoutProps) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
                <img src={plusImg} alt="plus logo" style={{
                    paddingLeft: '1rem',
                    width: '30vw',
                    paddingTop: '0.3rem',
                }} />
                <div>
                   {children}
                </div>
        </div>
    );
};

interface logoProps {
    active : boolean;
    img : string;
}
const NavBarLogo = ({active, img}: logoProps) => {

    return (
        <div style={{
            stroke: '#491EC450'
        }}>
            <img src={img} alt="news logo" style={{
                width: '7vw',
                height: '7vw',
                opacity: active ? 1 : 0.5,
            }} />
        </div>
    )}


const NavBar = () => {
    const [currentPage, setCurrentPage] = React.useState(-1);
    React.useEffect(() => {
        switch (currentPage) {
            case 0:
                window.location.href = '/newsfeed';
                break;
            case 1:
                window.location.href = '/chat';
                break;
            case 2:
                window.location.href = '/profile';
                break;
            default:
                break;
        }
        console.log(window.location.pathname)
    }, [currentPage]);

    return (
        <div style={{
            display: 'flex',
            position: 'fixed',
            bottom: 0,
            paddingBottom: '1rem',
            width: '100%',
            textAlign: 'center',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: '5px',
            backgroundColor: 'white',
        }}>
            <div onClick={() => setCurrentPage(0)}>
            <NavBarLogo active={currentPage === 0 || window.location.pathname == '/newsfeed'
            } img={news}/>
            </div>
            <div onClick={() => setCurrentPage(1)}>
            <NavBarLogo active={currentPage === 1 || window.location.pathname == '/chat'
            } img={chat}/>
            </div>
            <div onClick={() => setCurrentPage(2)}>
            <NavBarLogo active={
                currentPage === 2 || window.location.pathname == '/profile'
                } img={user}/>
            </div>
        </div>
    );
};



export const Layout = ({ children }: LayoutProps) => {
    return (
        <div style={
            {
                display: 'flex',
                flexDirection: 'column',
                
        }}
        >
            <Header>
                Following
            </Header>
            {children}
            
            <NavBar />
        </div>
    );
};