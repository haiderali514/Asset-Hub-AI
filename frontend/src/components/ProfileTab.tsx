
import React, { useState } from 'react';
import type { User } from '../types';

interface ProfileTabProps {
    user: User;
    onUpdateUser: (updatedUser: Partial<User>) => void;
    collectionsTab: React.ReactNode;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user, onUpdateUser, collectionsTab }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);

    const handleSave = () => {
        if (name.trim()) {
            onUpdateUser({ name: name.trim() });
            setIsEditing(false);
        }
    };

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your account details and collections here.</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold mb-4">Account Details</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        {isEditing ? (
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full mt-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        ) : (
                            <p className="font-semibold">{user.name}</p>
                        )}
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="font-semibold text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <div>
                        {isEditing ? (
                            <div className="flex gap-2 mt-2">
                                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-primary-500 text-white rounded-lg hover:bg-primary-600">Save</button>
                                <button onClick={() => { setIsEditing(false); setName(user.name); }} className="px-4 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Edit Profile</button>
                        )}
                    </div>
                </div>
            </div>

            <div>
                {collectionsTab}
            </div>
        </div>
    );
};
