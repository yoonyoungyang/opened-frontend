import { useEffect, useState } from "react";

export default function Toast({ message, onComplete }) {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setIsShown(true));
    const hideTimer = setTimeout(() => setIsShown(false), 2000);
    const completeTimer = setTimeout(onComplete, 2300);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(hideTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`toast-message${isShown ? " show" : ""}`}>{message}</div>
  );
}
