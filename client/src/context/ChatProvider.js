import { createContext, useEffect, useState } from 'react';

export const ChatContext = createContext(null);

export const DOMAIN = 'https://gossip-a-mern-chat-app.onrender.com'

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userInfo");
        return savedUser ? JSON.parse(savedUser) : {};
    });
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);
    const [isAuthenticated, isUserAuthenticated] = useState(() => {
        const savedUser = localStorage.getItem("userInfo");
        return savedUser ? true : false;
    });

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            setUser(userInfo)
            isUserAuthenticated(true)
        }
    }, []);
    

    return (<ChatContext.Provider value={{DOMAIN, user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification, isAuthenticated, isUserAuthenticated }}>{children}</ChatContext.Provider>)
}

// export const ChatState = ()=>{
//     return useContext(ChatContext);
// }
// useContext(ChatContext);

export default ChatProvider;