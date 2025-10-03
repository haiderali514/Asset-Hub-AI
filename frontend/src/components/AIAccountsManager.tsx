
import React, { useState } from 'react';
import type { AIProviderAccount } from '../types';
import { Icon } from './Icon';
import { addAiProvider, removeAiProvider } from '../services/aiService';


interface AIAccountsManagerProps {
    accounts: AIProviderAccount[];
    onClose: () => void;
    onAccountsChange: () => void;
}

export const AIAccountsManager: React.FC<AIAccountsManagerProps> = ({ accounts, onClose, onAccountsChange }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountKey, setNewAccountKey] = useState('');
    const [newAccountDesc, setNewAccountDesc] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRemove = async (id: string) => {
        if(window.confirm('Are you sure you want to remove this account?')) {
            try {
                await removeAiProvider(id);
                onAccountsChange();
            } catch (err) {
                console.error(err);
                alert('Failed to remove account.');
            }
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAccountName.trim()) {
            setError("Provider name cannot be empty.");
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            await addAiProvider({ 
                name: newAccountName, 
                apiKey: newAccountKey, 
                description: newAccountDesc 
            });
            onAccountsChange();
            // Reset form
            setIsAdding(false);
            setNewAccountName('');
            setNewAccountKey('');
            setNewAccountDesc('');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add account.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold">Manage AI Accounts</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4">
                    {accounts.map(acc => (
                        <div key={acc.id} className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">{acc.name} {acc.isDefault && <span className="text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 px-2 py-0.5 rounded-full ml-2">Default</span>}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{acc.description || 'No description provided.'}</p>
                            </div>
                            {!acc.isDefault && (
                                <button onClick={() => handleRemove(acc.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Remove</button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t dark:border-gray-700">
                    {isAdding ? (
                        <form onSubmit={handleAdd} className="space-y-4">
                            <h3 className="font-semibold text-lg">Add New Provider</h3>
                             {error && <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/20 p-2 rounded">{error}</p>}
                            <div>
                                <label className="block text-sm font-medium">Provider Name</label>
                                <input type="text" value={newAccountName} onChange={e => setNewAccountName(e.target.value)} placeholder="e.g., Leonardo AI" className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Description</label>
                                <input type="text" value={newAccountDesc} onChange={e => setNewAccountDesc(e.target.value)} placeholder="A short description" className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">API Key / Token (optional)</label>
                                <input type="password" value={newAccountKey} onChange={e => setNewAccountKey(e.target.value)} placeholder="Paste your API key here" className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500" />
                                <p className="text-xs text-gray-500 mt-1">This will be stored on the server. Leave blank for mock providers.</p>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsAdding(false)} className="w-full py-2 px-4 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">Cancel</button>
                                <button type="submit" disabled={isLoading} className="w-full py-2 px-4 rounded-md bg-primary-500 hover:bg-primary-600 text-white font-semibold disabled:bg-primary-300">
                                    {isLoading ? 'Adding...' : 'Add Account'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={() => setIsAdding(true)} className="w-full py-2 px-4 rounded-md bg-primary-500 hover:bg-primary-600 text-white font-semibold">
                            Add New AI Provider
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
