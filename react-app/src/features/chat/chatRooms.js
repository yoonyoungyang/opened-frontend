export const CHAT_ROOMS = [
  {
    id: "yongsan-imax",
    shortName: "용산 IMAX",
    name: "용산 아이파크몰 IMAX",
    accent: "blue",
    members: 128,
  },
  {
    id: "wangsimni-imax",
    shortName: "왕십리 IMAX",
    name: "왕십리 IMAX",
    accent: "purple",
    members: 76,
  },
  {
    id: "yeouido-4dx",
    shortName: "여의도 4DX",
    name: "여의도 4DX",
    accent: "green",
    members: 54,
  },
  {
    id: "coex-dolby",
    shortName: "코엑스 Dolby",
    name: "코엑스 Dolby Cinema",
    accent: "pink",
    members: 91,
  },
];

export const INITIAL_MESSAGES = {
  "yongsan-imax": [
    { id: 1, author: "오픈알리미", text: "상영관별 채팅방입니다. 예매 관련 정보를 자유롭게 나눠보세요!", time: "오후 2:10", notice: true },
    { id: 2, author: "팝콘좋아", text: "오늘 저녁 회차 취소표 기다리는 분 계신가요?", time: "오후 2:18" },
    { id: 3, author: "영화산책", text: "저도 보고 있어요. 열리면 바로 알려드릴게요!", time: "오후 2:19" },
  ],
  "wangsimni-imax": [
    { id: 1, author: "오픈알리미", text: "왕십리 IMAX 정보를 나누는 채팅방입니다.", time: "오후 1:40", notice: true },
    { id: 2, author: "중앙좌석", text: "주말 조조 회차가 방금 추가됐어요.", time: "오후 2:02" },
  ],
  "yeouido-4dx": [
    { id: 1, author: "오픈알리미", text: "여의도 4DX 정보를 나누는 채팅방입니다.", time: "오후 12:30", notice: true },
    { id: 2, author: "모션체어", text: "D열과 E열 중 어디가 더 좋을까요?", time: "오후 1:45" },
  ],
  "coex-dolby": [
    { id: 1, author: "오픈알리미", text: "코엑스 Dolby Cinema 정보를 나누는 채팅방입니다.", time: "오전 11:20", notice: true },
    { id: 2, author: "돌비팬", text: "심야 회차 좌석 여유 있습니다!", time: "오후 1:32" },
  ],
};
