import React, { useContext } from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatContext } from '../context/ChatProvider';
import { Avatar, Tooltip } from '@mui/material';

const ScrollableChat = ({ messages }) => {
    const { user } = useContext(ChatContext);

    return (
        <ScrollableFeed>
            {
                messages && messages.map((m, i) => (
                    <div style={{ display: 'flex'}} key={m._id}>
                        {(isSameSender(messages, m, i, user._id)
                            || isLastMessage(messages, i, user._id))
                            && (<Tooltip title={m.sender.name} arrow>
                                <Avatar  sx={{fontSize:'25px', cursor: 'pointer', objectFit: 'cover', marginTop: '7px',marginRight:'2px' }} alt={m.sender.name} src={m.sender.pic === "" ? '/' : m.sender.pic} />
                            </Tooltip>
                            )}
                            <span style={{
                                backgroundColor: `${
                                    m.sender._id === user._id ? "#BEE3F8":"#B9F5D0"
                                }`,
                                marginLeft: isSameSenderMargin(messages,m,i,user._id),
                                marginTop: isSameUser(messages,m,i,user._id) ? 3:10,
                                borderRadius:"20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                                
                            }}>
                                {m.content}
                            </span>
                    </div>
                ))
            }
        </ScrollableFeed>
    )
}

export default ScrollableChat