import React from 'react';
import type { ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    onApply?: () => void;
    applyText?: string;
    closeText?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    onApply,
    applyText = "Применить",
    closeText = "Закрыть"
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className="modal-content"
                onClick={e => e.stopPropagation()} // чтобы не закрывалось при клике внутри
            >
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>

                <div className="modal-body">
                    {children}
                </div>

                <div className="modal-footer">
                    <button 
                        className="modal-btn modal-btn-secondary"
                        onClick={onClose}
                    >
                        {closeText}
                    </button>
                    
                    {onApply && (
                        <button 
                            className="modal-btn modal-btn-primary"
                            onClick={onApply}
                        >
                            {applyText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;