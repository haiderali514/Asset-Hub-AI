
import React from 'react';
import { Icon } from './Icon';

interface LoginModalProps {
    onClose: () => void;
    onLogin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold">Sign In</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 text-center">
                    <p className="mb-6 text-gray-600 dark:text-gray-400">This is a demo application. Click the button below to sign in with a mock user account.</p>
                    <button 
                        onClick={onLogin}
                        className="w-full px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Sign In as Demo User
                    </button>
                </div>
            </div>
        </div>
    );
};
