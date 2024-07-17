import React, { useEffect, useRef, useState } from 'react';
import './chat.css';
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [chat, setChat] = useState(null);
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      });
      console.log("Image selected:", e.target.files[0]);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    console.log("Image uploaded, URL:", url);
    return url;
  };

  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
      setChat(res.data());
      console.log("Chat data:", res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleSend = async () => {
    if (!chatId || !currentUser || (!text.trim() && !img.file)) return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await uploadImage(img.file);
      }

      const chatDocRef = doc(db, 'chats', chatId);

      const chatDocSnapshot = await getDoc(chatDocRef);
      if (!chatDocSnapshot.exists()) {
        await setDoc(chatDocRef, { messages: [] });
      }

      const messageData = {
        senderId: currentUser.id,
        text,
        createdAt: new Date(),
      };

      if (imgUrl) {
        messageData.img = imgUrl;
      }

      await updateDoc(chatDocRef, {
        messages: arrayUnion(messageData),
      });

      console.log("Message sent:", messageData);

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, 'userchats', id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);

          if (chatIndex !== -1) {
            userChatsData.chats[chatIndex].lastMessage = text;
            userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
            userChatsData.chats[chatIndex].updatedAt = new Date();

            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });

            console.log("User chat updated:", userChatsData.chats[chatIndex]);
          }
        }
      });

      setText('');
      setImg({ file: null, url: "" });
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  console.log(chat); // Provjerite podatke u konzoli

  return (
    <div className='chat'>
      <div className='top'>
        <div className='user'>
          <img src={user?.avatar || './avatar.png'} alt='' />
          <div className='texts'>
            <span>{user?.username}</span>
            <p>{user?.statusMessage}</p>
          </div>
        </div>
        <div className='icons'>
          <img src='./phone.png' alt='' />
          <img src='./video.png' alt='' />
          <img src='./info.png' alt='' />
        </div>
      </div>
      {/* center */}
      <div className='center'>
        {chat?.messages?.map((message, index) => (
          <div
            key={index}
            className={`message ${message.senderId === currentUser.id ? 'own' : ''}`}
          >
            {message.senderId !== currentUser.id && <img src={user?.avatar || './avatar.png'} alt='' />}
            <div className='text'>
              {message.text && <p>{message.text}</p>}
              {message.img && <img src={message.img} alt="uploaded" />}
              <span>{new Date(message.createdAt.seconds * 1000).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
      {/* bottom */}
      <div className='bottom'>
        <div className='icons'>
          <label htmlFor="fileInput">
            <img src='./img.png' alt='' />
          </label>
          <input type="file" id='fileInput' style={{ display: "none" }} onChange={handleImage} />
          <img src='./camera.png' alt='' />
          <img src='./mic.png' alt='' />
        </div>
        <input
          type='text'
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className='emoji'>
          <img
            src='./emoji.png'
            alt=''
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className='picker'>
            {open && <EmojiPicker onEmojiClick={handleEmoji} />}
          </div>
        </div>
        <button className='sendButton' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;


