import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteModal from "./DeleteModal";
import {
  closeModalWithAnimation,
  closeSheetWithAnimation,
} from "../../../../utils/utils";
import useIsWide from "../../../../hooks/useIsWide";

vi.mock("../../../../hooks/useIsWide", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../../../../utils/utils", () => ({
  closeModalWithAnimation: vi.fn(),
  closeSheetWithAnimation: vi.fn(),
}));

describe("DeleteModal", () => {
  let mockRef;
  let setDeleteError;
  let onDelete;
  let user;
  let reRender;

  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.animate = vi.fn(() => ({
      finished: Promise.resolve(),
      cancel: vi.fn(),
    }));

    mockRef = {
      current: null,
    };

    setDeleteError = vi.fn();
    onDelete = vi.fn();

    user = userEvent.setup();

    const { rerender } = render(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError={null}
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    reRender = rerender;

    mockRef.current.setAttribute("open", "");
  });

  it("renders the product name in the paragraph", () => {
    expect(screen.getByText(/americano/i)).toBeInTheDocument();
  });

  it("calls onDelete with the entered password when the key Enter is pressed in the password input field", async () => {
    const passwordField = screen.getByLabelText(/admin password/i);
    await user.type(passwordField, "brew");
    await user.keyboard("{Enter}");

    expect(onDelete).toHaveBeenCalledWith("brew");
  });

  it("calls onDelete with the entered password when the delete button is clicked", async () => {
    const passwordField = screen.getByLabelText(/admin password/i);
    await user.type(passwordField, "brew");

    const deleteBtn = screen.getByRole("button", {
      name: /delete/i,
    });
    await user.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith("brew");
  });

  it("renders 'Incorrect password. Please try again.' when deleteError is 'Incorrect password'", () => {
    render(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError="Incorrect password"
        setDeleteError={vi.fn()}
        onDelete={onDelete}
      />
    );

    expect(
      screen.getByText(/incorrect password. please try again./i)
    ).toBeInTheDocument();
  });

  it("renders 'Password is required' when deleteError is 'Password is required'", () => {
    render(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError="Password is required"
        setDeleteError={vi.fn()}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("renders 'Failed to delete. Please try again.' when deleteError is neither 'Incorrect password' nor 'Password is required'", () => {
    render(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError="Error message"
        setDeleteError={vi.fn()}
        onDelete={onDelete}
      />
    );

    expect(
      screen.getByText(/failed to delete. please try again./i)
    ).toBeInTheDocument();
  });

  it("does not render an error message when there is no error", () => {
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("clears deleteError when the cancel button is clicked", async () => {
    reRender(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError="Error message"
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    const cancelBtn = screen.getByRole("button", {
      name: /cancel/i,
    });
    await user.click(cancelBtn);

    expect(setDeleteError).toHaveBeenCalledWith(null);
  });

  it("clears deleteError when the backdrop is clicked", async () => {
    reRender(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError="Error message"
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    const backdrop = screen.getByRole("dialog");
    await user.click(backdrop);

    expect(setDeleteError).toHaveBeenCalledWith(null);
  });

  it("clears deleteError when the escape key is pressed", async () => {
    reRender(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError="Error message"
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    const dialog = screen.getByRole("dialog");
    dialog.dispatchEvent(new Event("cancel", { cancelable: true }));

    expect(setDeleteError).toHaveBeenCalledWith(null);
  });

  it("renders the password input as empty when the modal is first opened", () => {
    const passwordField = screen.getByLabelText(/admin password/i);
    expect(passwordField).toHaveValue("");
  });

  it("does not clear the password field when an error occurs", async () => {
    const passwordField = screen.getByLabelText(/admin password/i);
    await user.type(passwordField, "wrongpw");

    expect(passwordField).toHaveValue("wrongpw");

    reRender(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError="Incorrect password"
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    expect(screen.getByLabelText(/admin password/i)).toHaveValue("wrongpw");
  });

  it("renders the modal as a dialog with the correct aria-labelledby and aria-describedby", () => {
    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveAttribute("aria-labelledby", "delete-modal-title");
    expect(dialog).toHaveAttribute("aria-describedby", "delete-modal-msg");

    expect(screen.getByText("Delete product?")).toHaveAttribute(
      "id",
      "delete-modal-title"
    );
    expect(screen.getByText(/will be permanently deleted/i)).toHaveAttribute(
      "id",
      "delete-modal-msg"
    );
  });

  it("calls closeModalWithAnimation when the cancel button is clicked on desktop screens", async () => {
    useIsWide.mockReturnValue(true);
    reRender(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError=""
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);
    const dialog = screen.getByRole("dialog");
    expect(closeModalWithAnimation).toHaveBeenCalledWith(dialog);
  });

  it("calls closeModalWithAnimation when the backdrop is clicked on desktop screens", async () => {
    useIsWide.mockReturnValue(true);
    reRender(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError=""
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    const dialog = screen.getByRole("dialog");
    await user.click(dialog);
    expect(closeModalWithAnimation).toHaveBeenCalledWith(dialog);
  });

  it("calls closeModalWithAnimation when the escape key is pressed on desktop screens", async () => {
    useIsWide.mockReturnValue(true);
    reRender(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError=""
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    const dialog = screen.getByRole("dialog");
    dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
    expect(closeModalWithAnimation).toHaveBeenCalledWith(dialog);
  });

  it("calls closeSheetWithAnimation when the cancel button is clicked on mobile screens", async () => {
    useIsWide.mockReturnValue(false);
    reRender(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError=""
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);
    const dialog = screen.getByRole("dialog");
    expect(closeSheetWithAnimation).toHaveBeenCalledWith(dialog);
  });

  it("calls closeSheetWithAnimation when the backdrop is clicked on mobile screens", async () => {
    useIsWide.mockReturnValue(false);
    reRender(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError=""
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    const dialog = screen.getByRole("dialog");
    await user.click(dialog);
    expect(closeSheetWithAnimation).toHaveBeenCalledWith(dialog);
  });

  it("calls closeSheetWithAnimation when the escape key is pressed on mobile screens", () => {
    useIsWide.mockReturnValue(false);
    reRender(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError=""
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    const dialog = screen.getByRole("dialog");
    dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
    expect(closeSheetWithAnimation).toHaveBeenCalledWith(dialog);
  });

  it("renders 'Try again' as the delete button text when there is an error", () => {
    reRender(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError="Error message"
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    expect(
      screen.getByRole("button", { name: "Try again" })
    ).toBeInTheDocument();
  });

  it("renders 'Delete' as the delete button text when there is no error", () => {
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("does not render 'Try again' when there is no error", () => {
    expect(
      screen.queryByRole("button", { name: "Try again" })
    ).not.toBeInTheDocument();
  });

  it("does not render 'Delete' when there is an error", () => {
    reRender(
      <DeleteModal
        deleteModalRef={mockRef}
        productName="Americano"
        deleteError="Error message"
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Delete" })
    ).not.toBeInTheDocument();
  });
});
