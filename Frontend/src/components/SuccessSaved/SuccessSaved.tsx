import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import './SuccessSaved.css'

interface SuccessSavedProps {
    onClose?: () => void;
    autoClose?: boolean;
}

const SuccessSaved = ({ onClose, autoClose = true }: SuccessSavedProps) => {

    useEffect(() => {
        if (!autoClose) return;

        const timer = setTimeout(() => {
            onClose?.();
        }, 2500);

        return () => clearTimeout(timer);
    }, [autoClose, onClose]);

    return createPortal(
        <div className="success-saved-overlay">
            <div className="success-saved">
                <img 
                    src="/src/assets/icons/iconsuccess.svg" 
                    className="success-saved-img" 
                    width={20} 
                    height={20} 
                    alt="success"
                />
                <p>Изменения сохранены</p>
            </div>
        </div>,
        document.body
    );
}

export default SuccessSaved