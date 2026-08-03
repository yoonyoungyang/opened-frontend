import { Outlet, useMatches } from "react-router-dom";

import Header from "./Header";

const DEFAULT_HEADER = {
  showBackButton: false,
  backLabel: "이전 페이지로 돌아가기",
  profile: "none",
};

export default function AppLayout() {
  const matches = useMatches();
  const currentMatch = [...matches]
    .reverse()
    .find((match) => match.handle?.header);
  const header = {
    ...DEFAULT_HEADER,
    ...currentMatch?.handle.header,
  };

  return (
    <>
      <Header {...header} />
      <Outlet />
    </>
  );
}
