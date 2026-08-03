import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { clearAccessToken } from "../features/auth/tokenStorage";
import ProfileEditForm from "../features/profile/ProfileEditForm";
import { deleteProfile, updateProfile } from "../features/profile/profileApi";
import { profileQueries } from "../features/profile/profileQueries";
import ConfirmDialog from "../shared/components/ConfirmDialog";
import Toast from "../shared/components/Toast";

export default function ProfileEditPage() {
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const profileQuery = useQuery(profileQueries.me());
  const updateMutation = useMutation({ mutationFn: updateProfile });
  const deleteMutation = useMutation({ mutationFn: deleteProfile });

  const handleToastComplete = useCallback(() => {
    if (toast?.moveToPosts) {
      navigate("/posts");
    }

    setToast(null);
  }, [navigate, toast]);

  async function handleUpdate(profile) {
    const response = await updateMutation.mutateAsync(profile);

    if (response.message === "user_update_success") {
      queryClient.setQueryData(["me"], response.data);
      setToast({ message: "수정완료", moveToPosts: true });
      return;
    }

    setToast({ message: "수정 실패", moveToPosts: false });
  }

  async function handleWithdraw() {
    const response = await deleteMutation.mutateAsync();

    if (response.message === "user_delete_success") {
      setIsWithdrawDialogOpen(false);
      clearAccessToken();
      queryClient.clear();
      navigate("/login");
    }
  }

  if (!profileQuery.data) {
    return <main className="main profile-edit-page"></main>;
  }

  return (
    <main className="main profile-edit-page">
      <section className="profile-edit-section">
        <h2 className="page-title">회원정보수정</h2>
        <ProfileEditForm
          profile={profileQuery.data}
          onSubmit={handleUpdate}
          onWithdraw={() => setIsWithdrawDialogOpen(true)}
        />
      </section>

      {isWithdrawDialogOpen && (
        <ConfirmDialog
          title="회원탈퇴 하시겠습니까?"
          description="작성된 게시글과 댓글은 삭제됩니다."
          onCancel={() => setIsWithdrawDialogOpen(false)}
          onConfirm={handleWithdraw}
        />
      )}

      {toast && <Toast message={toast.message} onComplete={handleToastComplete} />}
    </main>
  );
}
