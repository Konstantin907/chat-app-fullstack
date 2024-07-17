import React from "react";
import "./detail.css";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } =
  useChatStore();
const { currentUser } = useUserStore();

const handleBlock = async() => {
  if(!user) return;

  const userDocRef = doc(db, "users", currentUser.id)

  try {
    await updateDoc(userDocRef,{
      blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
    })
    changeBlock();
  } catch (error) {
      console.log(error);
  }

}


  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "/avatar.png" } alt="" />
        <h2>{user?.username}</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p> 
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>

              <img src="./download.png" alt="" className="icon"/>
            </div>

            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>

              <img src="./download.png" alt="" className="icon"/>
            </div>

            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>

              <img src="./download.png" alt="" className="icon"/>
            </div>
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
              <button
                onClick={handleBlock}
              >
               {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
              </button>
              <button 
                className="logout"
                onClick={()=>auth.signOut()}
                >Logout</button>
      </div>
    </div>
  );
};

export default Detail;
