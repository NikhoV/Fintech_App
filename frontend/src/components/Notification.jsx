import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);
    // Timer per la chiusura automatica
    useEffect(() => {
        // 1. Timer per avviare l'animazione di uscita (dopo 3 secondi)
        const exitAnimationTimer = setTimeout(() => {
            setIsExiting(true);
        }, 3000);

        // 2. Timer per rimuovere il componente dal DOM (dopo 3.5 secondi)
        // Deve durare un po' più del primo per dare il tempo al CSS di finire
        const removeComponentTimer = setTimeout(() => {
            onClose();
        }, 3500);

        return () => {
        clearTimeout(exitAnimationTimer);
        clearTimeout(removeComponentTimer);
        };
    }, [onClose]);

    return (
        <div className={`notification-container ${type} ${isExiting ? 'slide-out' : 'slide-in'}`}>
        <div className="notification-content">
            {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{message}</span>
        </div>
        <button onClick={() => setIsExiting(true)} className="close-btn">
            <X size={18} />
        </button>
        </div>
    );
    };

export default Notification;