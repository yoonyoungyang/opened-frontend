import { Client } from "@stomp/stompjs";
import { apiRequest } from "../../shared/api/client";

export function createStompClient(onConnected) {
  const token = localStorage.getItem("access_token");

  const stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws",

    onConnect: () => {
      onConnected();
    },
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    onStompError: (frame) => {
      console.error("STOMP 오류:", frame.headers["message"]);
      console.error("오류 내용:", frame.body);
    },

    onWebSocketError: (error) => {
      console.error("WebSocket 오류:", error);
    },
  });
  return stompClient;
}

export function sendMessage(stompClient, activeRoomId, content) {
  stompClient.publish({
    destination: "/app/chat",
    body: JSON.stringify({
      content,
      roomId: activeRoomId,
    }),
  });
}

export function subscribeRoom(stompClient, roomId, onMessage) {
  const subscription = stompClient.subscribe(
    "/topic/chat/" + roomId,
    (message) => {
      const jsonMessage = JSON.parse(message.body);
      console.log("서버에서 받은 메시지:", jsonMessage);

      onMessage(jsonMessage);
    },
  );
  console.log("구독 완료:", subscription);

  return subscription;
}

export async function getChatMessages(roomId) {
  const response = await apiRequest(`/chat-rooms/${roomId}/messages`, {
    auth: true,
  });

  if (response.message !== "chat_list_success") {
    throw new Error("채팅 목록을 불러오지 못했습니다.");
  }

  return response.data;
}

export async function getChatRooms() {
  const response = await apiRequest(`/chat-rooms`, {
    auth: true,
  });
  if (response.message !== "chat_room_list_success") {
    throw new Error("채팅방 목록을 불러오지 못했습니다.");
  }
  return response.data;
}
