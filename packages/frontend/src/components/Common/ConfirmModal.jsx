import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./ConfirmModal.css";

export default function ConfirmModal({
  open,
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  confirmText = "Excluir",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
  danger = true,
}) {
  // Fecha no ESC e bloqueia scroll de fundo
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="ev-modal-overlay" onMouseDown={onClose}>
      <div
        className="ev-modal-card"
        onMouseDown={(e) => e.stopPropagation()} // não fechar ao clicar dentro
        role="dialog"
        aria-modal="true"
        aria-labelledby="ev-modal-title"
      >
        <div className="ev-modal-header">
          <h3 id="ev-modal-title">{title}</h3>
        </div>

        <div className="ev-modal-body">
          <p>{message}</p>
        </div>

        <div className="ev-modal-actions">
          <button
            type="button"
            className="ev-btn ev-btn-ghost"
            onClick={onClose}
            autoFocus
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`ev-btn ${danger ? "ev-btn-danger" : "ev-btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
