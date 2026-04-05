import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import './UnSuccessSaved.css';

interface UnSuccessSavedProps {
    onClose?: () => void;
    autoClose?: boolean;
}

const UnSuccessSaved = ({ onClose, autoClose = true }: UnSuccessSavedProps) => {

    useEffect(() => {
        if (!autoClose) return;

        const timer = setTimeout(() => {
            onClose?.();
        }, 3500);

        return () => clearTimeout(timer);
    }, [autoClose, onClose]);

    return createPortal(
        <div className='unsuccess-saved'>
            <div className='unsuccess-saved-header'>
                <img src="/src/assets/icons/iconunsuccess.svg" 
                className='unsuccess-saved-img' 
                width={28} height={28} 
                alt="error"/>
                <p> Ошибка сохранения </p>
            </div>
            <div className='unsuccess-saved-text'>
                <p> При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже. </p>
            </div>
        </div>,
        document.body
    )
}

export default UnSuccessSaved