import { useEffect, useRef, useState } from "react";
import {
  createStompClient,
  sendMessage,
  subscribeRoom,
  getChatMessages,
  getChatRooms,
} from "./chat.js";

function formatMessageTime(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function CinemaChat() {
  const [chatRooms, setChatRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [message, setMessage] = useState("");
  const messageEndRef = useRef(null);
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);
  console.log("chatRooms:", chatRooms);
  console.log("activeRoomId:", activeRoomId);
  const activeMessages = messagesByRoom[activeRoomId] ?? [];
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function loadChatrooms() {
      try {
        const chatRooms = await getChatRooms();
        setChatRooms(chatRooms);
        if (chatRooms.length > 0) {
          setActiveRoomId(chatRooms[0].roomId);
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadChatrooms();
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRoomId, activeMessages.length]);

  function handleSubmit(event) {
    event.preventDefault();
    const text = message.trim();
    console.log("전송 함수 실행", text, activeRoomId);

    if (!text) return;
    console.log("클라이언트:", clientRef.current);
    console.log("연결 상태:", clientRef.current?.connected);

    if (!clientRef.current || !clientRef.current.connected) {
      return;
    }

    sendMessage(clientRef.current, activeRoomId, text);
    setMessage("");
  }

  useEffect(() => {
    if (!activeRoomId) {
      return;
    }
    async function loadMessages() {
      try {
        const chatMessages = await getChatMessages(activeRoomId);
        console.log(chatMessages);

        const loginUserId = Number(localStorage.getItem("user_id"));
        const formattedMessages = chatMessages.map((message) => ({
          id: message.messageId,
          author: message.senderNickname,
          text: message.content,
          time: formatMessageTime(new Date(message.sendAt)),
          mine: message.senderId === loginUserId,
        }));

        setMessagesByRoom((prev) => ({
          ...prev,
          [activeRoomId]: formattedMessages,
        }));
      } catch (error) {
        console.error(error);
      }
    }
    loadMessages();
  }, [activeRoomId]);

  function handleReceivedMessage(receivedMessage) {
    const loginUserId = Number(localStorage.getItem("user_id"));
    const newMessage = {
      id: receivedMessage.messageId,
      author: receivedMessage.senderNickname,
      text: receivedMessage.content,
      time: formatMessageTime(new Date(receivedMessage.sendAt)),
      mine: receivedMessage.senderId === loginUserId,
    };

    setMessagesByRoom((current) => {
      const roomMessages = current[receivedMessage.roomId] ?? [];
      const isDuplicate = roomMessages.some(
        (message) => message.id === receivedMessage.messageId,
      );
      if (isDuplicate) {
        return current;
      }
      return {
        ...current,
        [receivedMessage.roomId]: [...roomMessages, newMessage],
      };
    });

    console.log("현재 방:", activeRoomId, typeof activeRoomId);
    console.log(
      "수신 방:",
      receivedMessage.roomId,
      typeof receivedMessage.roomId,
    );
  }

  useEffect(() => {
    const client = createStompClient(
      () => {
        setIsConnected(true);
      },
      () => {
        setIsConnected(false);
      },
    );

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    const subscription = subscribeRoom(
      clientRef.current,
      activeRoomId,
      handleReceivedMessage,
    );

    subscriptionRef.current = subscription;

    return () => {
      subscription.unsubscribe();
    };
  }, [activeRoomId, isConnected]);

  const activeRoom = chatRooms.find((room) => room.roomId === activeRoomId);
  if (!activeRoom) {
    return <p>채팅방을 불러오는 중입니다.</p>;
  }
  console.log("activeRoom:", activeRoom);

  return (
    <div className="chat-shell">
      <aside className="chat-room-panel" aria-label="상영관 채팅방 목록">
        <div className="chat-room-panel-heading">
          <h3>채팅방</h3>
          <span>{chatRooms.length}</span>
        </div>
        <div className="chat-room-list" role="tablist" aria-label="상영관 선택">
          {chatRooms.map((room) => {
            const roomMessages = messagesByRoom[room.roomId] ?? [];
            const lastMessage = roomMessages.at(-1)?.text;

            return (
              <button
                key={room.roomId}
                type="button"
                role="tab"
                aria-selected={room.roomId === activeRoomId}
                className={`chat-room-button ${room.roomId === activeRoomId ? "is-active" : ""}`}
                onClick={() => setActiveRoomId(room.roomId)}
              >
                <span
                  className={`chat-room-icon is-${room.accent}`}
                  aria-hidden="true"
                >
                  {room.roomName.charAt(0)}
                </span>
                <span className="chat-room-copy">
                  <strong>{room.roomName}</strong>
                  <small>{lastMessage}</small>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section
        className="chat-conversation"
        aria-label={`${activeRoom.roomName} 채팅`}
      >
        <header className="chat-conversation-header">
          <div>
            <h3>{activeRoom.roomName}</h3>
            <p>
              <span aria-hidden="true" /> 현재 {activeRoom.members}명 참여 중
            </p>
          </div>
          <span className="chat-live-badge">LIVE</span>
        </header>

        <div className="chat-message-list" role="log" aria-live="polite">
          <div className="chat-date-divider">
            <span>오늘</span>
          </div>
          {activeMessages.map((item) =>
            item.notice ? (
              <div key={item.id} className="chat-notice">
                {item.text}
              </div>
            ) : (
              <article
                key={item.id}
                className={`chat-message ${item.mine ? "is-mine" : ""}`}
              >
                {!item.mine && (
                  <div className="chat-message-avatar" aria-hidden="true">
                    {item.author.charAt(0)}
                  </div>
                )}
                <div className="chat-message-content">
                  {!item.mine && <strong>{item.author}</strong>}
                  <div className="chat-message-row">
                    {item.mine && <time>{item.time}</time>}
                    <p>{item.text}</p>
                    {!item.mine && <time>{item.time}</time>}
                  </div>
                </div>
              </article>
            ),
          )}
          <div ref={messageEndRef} />
        </div>

        {!isConnected && <p>서버와 재 연결 중입니다.</p>}

        <form className="chat-composer" onSubmit={handleSubmit}>
          <label htmlFor="chat-message" className="visually-hidden">
            메시지 입력
          </label>
          <input
            id="chat-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={300}
            autoComplete="off"
            placeholder={`${activeRoom.roomName} 채팅방에 메시지 보내기`}
          />
          <button
            type="submit"
            disabled={!message.trim() || !isConnected}
            aria-label="메시지 보내기"
          >
            ↑
          </button>
        </form>
      </section>
    </div>
  );
}
