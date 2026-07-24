import { useEffect } from "react";
import { IconAlertCircle, IconRefresh, IconTrash } from "@tabler/icons-react";
import PropTypes from "prop-types";
import styles from "./DeleteModal.module.css";
import useIsWide from "../../../../hooks/useIsWide";
import {
  closeModalWithAnimation,
  closeSheetWithAnimation,
} from "../../../../utils/utils";

function DeleteModal({
  deleteModalRef,
  productName,
  deleteError,
  setDeleteError,
  onDelete,
}) {
  const isWide = useIsWide(540);

  useEffect(() => {
    const modal = deleteModalRef.current;

    const handleCancel = (e) => {
      e.preventDefault();
      isWide ? closeModalWithAnimation(modal) : closeSheetWithAnimation(modal);
      setDeleteError(null);
    };

    const handleBackdropClick = (e) => {
      if (e.target === modal) {
        isWide
          ? closeModalWithAnimation(modal)
          : closeSheetWithAnimation(modal);
        setDeleteError(null);
      }
    };

    modal.addEventListener("cancel", handleCancel);
    modal.addEventListener("click", handleBackdropClick);

    return () => {
      modal.removeEventListener("cancel", handleCancel);
      modal.removeEventListener("click", handleBackdropClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteModalRef]);

  const handleCancelBtnClick = () => {
    isWide
      ? closeModalWithAnimation(deleteModalRef.current)
      : closeSheetWithAnimation(deleteModalRef.current);
    setDeleteError(null);
  };

  return (
    <dialog
      className={styles["delete-modal"]}
      ref={deleteModalRef}
      closedby="any"
    >
      <div className={styles["sheet-handle-row"]}>
        <div className={styles["sheet-handle"]}></div>
      </div>
      <div className={styles["modal-inner"]}>
        <div className={styles["modal-icon-wrap"]}>
          <IconTrash stroke={2} className={styles["modal-delete-icon"]} />
        </div>
        <div className={styles["modal-title"]}>Delete product?</div>
        <div className={styles["modal-msg"]}>
          <strong>{productName}</strong> will be permanently deleted. This
          cannot be undone.
        </div>
      </div>
      {deleteError && (
        <div className={styles["error"]}>
          <IconAlertCircle stroke={2} className={styles["error-icon"]} />
          <div className={styles["error-text"]}>
            Failed to delete. Please try again.
          </div>
        </div>
      )}
      <div className={styles["modal-footer"]}>
        <button
          className={styles["modal-btn-cancel"]}
          onClick={handleCancelBtnClick}
        >
          Cancel
        </button>
        <button
          className={styles["modal-btn-delete"]}
          disabled={deleteError}
          onClick={onDelete}
        >
          {deleteError ? (
            <>
              <IconRefresh stroke={2} className={styles["retry-icon"]} /> Try
              again
            </>
          ) : (
            <>
              <IconTrash
                stroke={2}
                className={styles["modal-btn-delete-icon"]}
              />
              Delete
            </>
          )}
        </button>
      </div>
    </dialog>
  );
}

DeleteModal.propTypes = {
  deleteModalRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  productName: PropTypes.string.isRequired,
  deleteError: PropTypes.bool.isRequired,
  setDeleteError: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteModal;
