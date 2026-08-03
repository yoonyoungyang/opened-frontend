import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import PasswordEditForm from "../features/profile/PasswordEditForm";
import { updatePassword } from "../features/profile/profileApi";
import Toast from "../shared/components/Toast";

export default function PasswordEditPage() {
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const updateMutation = useMutation({ mutationFn: updatePassword });

  const handleToastComplete = useCallback(() => {
    if (toast?.moveToPosts) {
      navigate("/posts");
    }

    setToast(null);
  }, [navigate, toast]);

  async function handleUpdate(passwords) {
    const response = await updateMutation.mutateAsync(passwords);

    if (response.message === "password_update_success") {
      setToast({ message: "수정 완료", moveToPosts: true });
      return;
    }

    setToast({ message: "수정 실패", moveToPosts: false });
  }

  return (
    <main className="main password-edit-page">
      <section className="password-edit-section">
        <h2 className="page-title">비밀번호 수정</h2>
        <PasswordEditForm onSubmit={handleUpdate} />
      </section>

      {toast && <Toast message={toast.message} onComplete={handleToastComplete} />}
    </main>
  );
}
