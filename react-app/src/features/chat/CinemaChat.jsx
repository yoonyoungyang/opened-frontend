import { useEffect, useRef, useState } from "react";

import { CHAT_ROOMS, INITIAL_MESSAGES } from "./chatRooms";

function formatMessageTime(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function CinemaChat() {
  const [activeRoomId, setActiveRoomId] = useState(CHAT_ROOMS[0].id);
  const [messagesByRoom, setMessagesByRoom] = useState(INITIAL_MESSAGES);
  const [message, setMessage] = useState("");
  const messageEndRef = useRef(null);
  const activeRoom = CHAT_ROOMS.find((room) => room.id === activeRoomId);
  const activeMessages = messagesByRoom[activeRoomId] ?? [];

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRoomId, activeMessages.length]);

  function handleSubmit(event) {
    event.preventDefault();
    const text = message.trim();

    if (!text) return;

    setMessagesByRoom((current) => ({
      ...current,
      [activeRoomId]: [
        ...(current[activeRoomId] ?? []),
        {
          id: `${activeRoomId}-${Date.now()}`,
          author: "나",
          text,
          time: formatMessageTime(new Date()),
          mine: true,
        },
      ],
    }));
    setMessage("");
  }

  return (
    <div className="chat-shell">
      <aside className="chat-room-panel" aria-label="상영관 채팅방 목록">
        <div className="chat-room-panel-heading">
          <h3>채팅방</h3>
          <span>{CHAT_ROOMS.length}</span>
        </div>
        <div className="chat-room-list" role="tablist" aria-label="상영관 선택">
          {CHAT_ROOMS.map((room) => {
            const roomMessages = messagesByRoom[room.id] ?? [];
            const lastMessage = roomMessages.at(-1)?.text;

            return (
              <button
                key={room.id}
                type="button"
                role="tab"
                aria-selected={room.id === activeRoomId}
                className={`chat-room-button ${room.id === activeRoomId ? "is-active" : ""}`}
                onClick={() => setActiveRoomId(room.id)}
              >
                <span className={`chat-room-icon is-${room.accent}`} aria-hidden="true">{room.shortName.charAt(0)}</span>
                <span className="chat-room-copy">
                  <strong>{room.shortName}</strong>
                  <small>{lastMessage}</small>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="chat-conversation" aria-label={`${activeRoom.name} 채팅`}>
        <header className="chat-conversation-header">
          <div>
            <h3>{activeRoom.name}</h3>
            <p><span aria-hidden="true" /> 현재 {activeRoom.members}명 참여 중</p>
          </div>
          <span className="chat-live-badge">LIVE</span>
        </header>

        <div className="chat-message-list" role="log" aria-live="polite">
          <div className="chat-date-divider"><span>오늘</span></div>
          {activeMessages.map((item) => item.notice ? (
            <div key={item.id} className="chat-notice">{item.text}</div>
          ) : (
            <article key={item.id} className={`chat-message ${item.mine ? "is-mine" : ""}`}>
              {!item.mine && <div className="chat-message-avatar" aria-hidden="true">{item.author.charAt(0)}</div>}
              <div className="chat-message-content">
                {!item.mine && <strong>{item.author}</strong>}
                <div className="chat-message-row">
                  {item.mine && <time>{item.time}</time>}
                  <p>{item.text}</p>
                  {!item.mine && <time>{item.time}</time>}
                </div>
              </div>
            </article>
          ))}
          <div ref={messageEndRef} />
        </div>

        <form className="chat-composer" onSubmit={handleSubmit}>
          <label htmlFor="chat-message" className="visually-hidden">메시지 입력</label>
          <input
            id="chat-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={300}
            autoComplete="off"
            placeholder={`${activeRoom.shortName} 채팅방에 메시지 보내기`}
          />
          <button type="submit" disabled={!message.trim()} aria-label="메시지 보내기">↑</button>
        </form>
      </section>
    </div>
  );
}
