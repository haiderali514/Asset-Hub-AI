
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import type { User } from '../types';

interface ProfileDropdownProps {
    user: User;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    onLogout: () => void;
    onProfileClick: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, theme, toggleTheme, onLogout, onProfileClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfileClick = () => {
        onProfileClick();
        setIsOpen(false);
    }
    
    const handleLogoutClick = () => {
        onLogout();
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900">
                <div className="w-9 h-9 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    {getInitials(user.name)}
                </div>
                <span className="hidden sm:inline font-semibold text-sm">{user.name}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-20">
                    <div className="p-2">
                        <div className="px-3 py-2">
                            <p className="font-bold truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                        <hr className="border-gray-200 dark:border-gray-700 my-1"/>
                        <button onClick={handleProfileClick} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                            <Icon name="user" className="w-5 h-5" />
                            My Profile
                        </button>
                         <button onClick={toggleTheme} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                            <Icon name={theme === 'light' ? 'moon' : 'sun'} className="w-5 h-5" />
                            Toggle Theme
                        </button>
                        <hr className="border-gray-200 dark:border-gray-700 my-1"/>
                        <button onClick={handleLogoutClick} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                            <Icon name="logout" className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
