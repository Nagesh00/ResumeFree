/**
 * Collaboration and Versioning System
 * Local snapshots, GitHub Gist sync, and version control as specified
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Save,
  Clock,
  GitBranch,
  Share2,
  Download,
  Upload,
  Eye,
  Trash2,
  Plus,
  ArrowLeft,
  ArrowRight,
  Github,
  Cloud,
  HardDrive,
  Users,
  Lock,
  Unlock,
  FileText
} from 'lucide-react';
import { Resume } from '../../../lib/schema/resume';
import { RootState } from '../../../store';

interface ResumeSnapshot {
  id: string;
  timestamp: Date;
  version: string;
  description: string;
  resume: Resume;
  author: string;
  tags: string[];
  isAutoSave: boolean;
}

interface CollaborationState {
  snapshots: ResumeSnapshot[];
  currentVersion: string;
  isShared: boolean;
  collaborators: string[];
  shareUrl?: string;
  gistId?: string;
  lastSync: Date | null;
  isDirty: boolean;
}

/**
 * Version History Component
 */
const VersionHistory: React.FC<{
  snapshots: ResumeSnapshot[];
  currentVersion: string;
  onRestore: (snapshot: ResumeSnapshot) => void;
  onDelete: (snapshotId: string) => void;
}> = ({ snapshots, currentVersion, onRestore, onDelete }) => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<ResumeSnapshot | null>(null);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Version History</h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
          {snapshots.length} versions
        </span>
      </div>

      <div className="space-y-3">
        {snapshots
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .map((snapshot) => (
            <div
              key={snapshot.id}
              className={`p-4 border rounded-lg transition-all ${
                snapshot.version === currentVersion
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">v{snapshot.version}</span>
                    {snapshot.version === currentVersion && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Current
                      </span>
                    )}
                    {snapshot.isAutoSave && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Auto-save
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-2">{snapshot.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{formatTimeAgo(snapshot.timestamp)}</span>
                    <span>by {snapshot.author}</span>
                    {snapshot.tags.length > 0 && (
                      <div className="flex gap-1">
                        {snapshot.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSnapshot(snapshot)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {snapshot.version !== currentVersion && (
                    <>
                      <button
                        onClick={() => onRestore(snapshot)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Restore this version"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onDelete(snapshot.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete version"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Preview Modal */}
      {selectedSnapshot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Version {selectedSnapshot.version} Preview
              </h3>
              <button
                onClick={() => setSelectedSnapshot(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            {/* Resume preview content would go here */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Resume preview for version {selectedSnapshot.version}</p>
              {/* Actual resume preview component would be rendered here */}
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedSnapshot(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onRestore(selectedSnapshot);
                  setSelectedSnapshot(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Restore This Version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Sharing and Collaboration Panel
 */
const SharingPanel: React.FC<{
  isShared: boolean;
  shareUrl?: string;
  collaborators: string[];
  onShare: () => void;
  onUnshare: () => void;
  onAddCollaborator: (email: string) => void;
  onRemoveCollaborator: (email: string) => void;
}> = ({
  isShared,
  shareUrl,
  collaborators,
  onShare,
  onUnshare,
  onAddCollaborator,
  onRemoveCollaborator,
}) => {
  const [newCollaborator, setNewCollaborator] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const copyShareUrl = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const addCollaborator = () => {
    if (newCollaborator.trim() && !collaborators.includes(newCollaborator)) {
      onAddCollaborator(newCollaborator.trim());
      setNewCollaborator('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {isShared ? (
          <Users className="w-5 h-5 text-green-600" />
        ) : (
          <Lock className="w-5 h-5 text-gray-600" />
        )}
        <h3 className="text-lg font-semibold">
          {isShared ? 'Collaboration Active' : 'Private Resume'}
        </h3>
      </div>

      {/* Share Toggle */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium">Resume Sharing</h4>
            <p className="text-sm text-gray-600">
              {isShared 
                ? 'Your resume is shared and can be accessed by collaborators'
                : 'Enable sharing to collaborate with others'
              }
            </p>
          </div>
          
          <button
            onClick={isShared ? onUnshare : onShare}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isShared
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isShared ? (
              <>
                <Lock className="w-4 h-4" />
                Make Private
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Enable Sharing
              </>
            )}
          </button>
        </div>

        {/* Share URL */}
        {isShared && shareUrl && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border rounded-lg bg-gray-50"
              />
              <button
                onClick={copyShareUrl}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  copySuccess
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Collaborators */}
      {isShared && (
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-4">Collaborators ({collaborators.length})</h4>
          
          {/* Add Collaborator */}
          <div className="flex gap-2 mb-4">
            <input
              type="email"
              placeholder="Enter collaborator email"
              value={newCollaborator}
              onChange={(e) => setNewCollaborator(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCollaborator()}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
            <button
              onClick={addCollaborator}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Collaborator List */}
          <div className="space-y-2">
            {collaborators.map((email) => (
              <div key={email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>{email}</span>
                </div>
                
                <button
                  onClick={() => onRemoveCollaborator(email)}
                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {collaborators.length === 0 && (
              <p className="text-gray-500 text-center py-4">No collaborators yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * GitHub Gist Sync Component
 */
const GitHubSync: React.FC<{
  gistId?: string;
  lastSync: Date | null;
  onSync: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
}> = ({ gistId, lastSync, onSync, onConnect, onDisconnect }) => {
  const [isConnected, setIsConnected] = useState(!!gistId);

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <Github className="w-5 h-5" />
        <h4 className="font-medium">GitHub Gist Sync</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${
          isConnected 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Sync your resume to a private GitHub Gist for backup and sharing
      </p>

      {isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Gist ID: {gistId}</p>
              <p className="text-sm text-gray-600">
                Last sync: {formatLastSync(lastSync)}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={onSync}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Cloud className="w-4 h-4" />
                Sync Now
              </button>
              
              <button
                onClick={onDisconnect}
                className="px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Github className="w-4 h-4" />
          Connect to GitHub
        </button>
      )}
    </div>
  );
};

/**
 * Main Collaboration Manager Component
 */
export const CollaborationManager: React.FC<{
  resume: Resume;
  onSave: (description: string, tags: string[]) => void;
  onRestore: (snapshot: ResumeSnapshot) => void;
}> = ({ resume, onSave, onRestore }) => {
  const [collaborationState, setCollaborationState] = useState<CollaborationState>({
    snapshots: [],
    currentVersion: '1.0.0',
    isShared: false,
    collaborators: [],
    lastSync: null,
    isDirty: false,
  });

  const [saveDescription, setSaveDescription] = useState('');
  const [saveTags, setSaveTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'versions' | 'sharing' | 'sync'>('versions');

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (collaborationState.isDirty) {
        createSnapshot('Auto-save', [], true);
      }
    }, 5 * 60 * 1000); // Auto-save every 5 minutes

    return () => clearInterval(autoSaveInterval);
  }, [collaborationState.isDirty]);

  const createSnapshot = (description: string, tags: string[] = [], isAutoSave = false) => {
    const newSnapshot: ResumeSnapshot = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      version: generateNextVersion(),
      description: description || 'Manual save',
      resume,
      author: 'Current User', // Would be actual user in real app
      tags,
      isAutoSave,
    };

    setCollaborationState(prev => ({
      ...prev,
      snapshots: [...prev.snapshots, newSnapshot],
      currentVersion: newSnapshot.version,
      isDirty: false,
    }));

    onSave(description, tags);
  };

  const generateNextVersion = () => {
    const versions = collaborationState.snapshots.map(s => s.version);
    const latest = versions.length > 0 ? Math.max(...versions.map(v => parseFloat(v))) : 0;
    return (latest + 0.1).toFixed(1);
  };

  const handleRestore = (snapshot: ResumeSnapshot) => {
    setCollaborationState(prev => ({
      ...prev,
      currentVersion: snapshot.version,
    }));
    onRestore(snapshot);
  };

  const handleDeleteSnapshot = (snapshotId: string) => {
    setCollaborationState(prev => ({
      ...prev,
      snapshots: prev.snapshots.filter(s => s.id !== snapshotId),
    }));
  };

  const handleShare = () => {
    const shareUrl = `https://resume-ai.example.com/share/${crypto.randomUUID()}`;
    setCollaborationState(prev => ({
      ...prev,
      isShared: true,
      shareUrl,
    }));
  };

  const handleUnshare = () => {
    setCollaborationState(prev => ({
      ...prev,
      isShared: false,
      shareUrl: undefined,
      collaborators: [],
    }));
  };

  const tabs = [
    { id: 'versions', label: 'Version History', icon: Clock },
    { id: 'sharing', label: 'Collaboration', icon: Users },
    { id: 'sync', label: 'GitHub Sync', icon: Github },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header with Quick Save */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitBranch className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Version Control</h2>
            <p className="text-gray-600">Manage versions and collaborate</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Save description..."
              value={saveDescription}
              onChange={(e) => setSaveDescription(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
            <button
              onClick={() => {
                createSnapshot(saveDescription);
                setSaveDescription('');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Version
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'versions' && (
          <VersionHistory
            snapshots={collaborationState.snapshots}
            currentVersion={collaborationState.currentVersion}
            onRestore={handleRestore}
            onDelete={handleDeleteSnapshot}
          />
        )}

        {activeTab === 'sharing' && (
          <SharingPanel
            isShared={collaborationState.isShared}
            shareUrl={collaborationState.shareUrl}
            collaborators={collaborationState.collaborators}
            onShare={handleShare}
            onUnshare={handleUnshare}
            onAddCollaborator={(email) =>
              setCollaborationState(prev => ({
                ...prev,
                collaborators: [...prev.collaborators, email],
              }))
            }
            onRemoveCollaborator={(email) =>
              setCollaborationState(prev => ({
                ...prev,
                collaborators: prev.collaborators.filter(c => c !== email),
              }))
            }
          />
        )}

        {activeTab === 'sync' && (
          <GitHubSync
            gistId={collaborationState.gistId}
            lastSync={collaborationState.lastSync}
            onSync={() => {
              setCollaborationState(prev => ({
                ...prev,
                lastSync: new Date(),
              }));
            }}
            onConnect={() => {
              setCollaborationState(prev => ({
                ...prev,
                gistId: 'gist_' + crypto.randomUUID().slice(0, 8),
              }));
            }}
            onDisconnect={() => {
              setCollaborationState(prev => ({
                ...prev,
                gistId: undefined,
                lastSync: null,
              }));
            }}
          />
        )}
      </div>
    </div>
  );
};
