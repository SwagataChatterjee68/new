"use client";
import "./permission-box.css";

export default function PermissionBox({ isOpen, onConfirm, onCancel, action = "action" }) {
  if (!isOpen) return null;

  // Choose message based on action
  let message = "";
  switch (action) {
    case "create":
      message = "Are you sure you want to create this blog?";
      break;
    case "update":
      message = "Are you sure you want to update this blog?";
      break;
    case "delete":
      message = "Are you sure you want to delete this blog?";
      break;
    default:
      message = "Are you sure you want to proceed?";
  }

  // Choose button text
  const buttonText = action.charAt(0).toUpperCase() + action.slice(1);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">{message}</h2>
        <div className="flex justify-center space-x-4">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="btn-primary">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
