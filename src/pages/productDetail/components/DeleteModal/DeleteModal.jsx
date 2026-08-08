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
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-msg"
    >
      <div className={styles["sheet-handle-row"]} aria-hidden="true">
        <div className={styles["sheet-handle"]}></div>
      </div>
      <div className={styles["modal-inner"]}>
        <div className={styles["modal-icon-wrap"]} aria-hidden="true">
          <IconTrash stroke={2} className={styles["modal-delete-icon"]} />
        </div>
        <h3 id="delete-modal-title" className={styles["modal-title"]}>
          Delete product?
        </h3>
        <p id="delete-modal-msg" className={styles["modal-msg"]}>
          <strong>{productName}</strong> will be permanently deleted. This
          cannot be undone.
        </p>
      </div>
      {deleteError && (
        <div className={styles["error"]} role="alert">
          <IconAlertCircle
            stroke={2}
            className={styles["error-icon"]}
            aria-hidden="true"
          />
          <p className={styles["error-text"]}>
            Failed to delete. Please try again.
          </p>
        </div>
      )}
      <div className={styles["modal-footer"]}>
        <button
          className={styles["modal-btn-cancel"]}
          onClick={handleCancelBtnClick}
        >
          Cancel
        </button>
        <button className={styles["modal-btn-delete"]} onClick={onDelete}>
          {deleteError ? (
            <>
              <IconRefresh
                stroke={2}
                className={styles["retry-icon"]}
                aria-hidden="true"
              />{" "}
              Try again
            </>
          ) : (
            <>
              <IconTrash
                stroke={2}
                className={styles["modal-btn-delete-icon"]}
                aria-hidden="true"
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
