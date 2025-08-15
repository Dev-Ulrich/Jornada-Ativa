import React from "react";
import styles from "./Modal.module.css";


const Modal = ({isOpen, onClose, onConfirm}) => {

    if(!isOpen) return null;

    return(
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation}>
                <p className={styles.modelHeader}>
                    Tem certeza que deseja excluir este item?
                </p>
                <div className={styles.modelHeader}>
                    <button
                        className={`${styles.button} ${styles.cancel}`}
                        onClick={onClose}
                    >
                        cancelar
                    </button>
                    <button
                        className={`${styles.button} ${styles.confirm}`}
                        onClick={onConfirm}
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal;