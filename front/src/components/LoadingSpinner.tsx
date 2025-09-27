import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    message = 'Carregando', 
    size = 'medium' 
}) => {
    return (
        <div className="loading-container">
            <div className={`loading-spinner loading-spinner--${size}`}></div>
            <div className="loading-text">
                {message}
                <span className="loading-dots"></span>
            </div>
        </div>
    );
};

export default LoadingSpinner;