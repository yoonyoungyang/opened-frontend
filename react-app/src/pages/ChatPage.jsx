import CinemaChat from "../features/chat/CinemaChat";

export default function ChatPage() {
  return (
    <main className="main chat-page">
      <section className="chat-section">
        <div className="chat-introduction">
          <p className="chat-eyebrow">LIVE CHAT</p>
          <h2>상영관 소식을 실시간으로 나눠보세요.</h2>
          <p>예매 오픈과 취소표 소식을 같은 상영관 이용자들과 공유할 수 있어요.</p>
        </div>
        <CinemaChat />
      </section>
    </main>
  );
}
