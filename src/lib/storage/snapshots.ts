import { Resume } from '../schema/resume';
import { compress, decompress } from 'lz-string';

export interface ResumeSnapshot {
  id: string;
  resume: Resume;
  label: string;
  timestamp: string;
  version: string;
  checksum: string;
  metadata: {
    size: number;
    compressedSize: number;
    changes?: string[];
    parentSnapshot?: string;
  };
}

export interface SnapshotDiff {
  added: Array<{ path: string; value: any }>;
  removed: Array<{ path: string; value: any }>;
  modified: Array<{ path: string; oldValue: any; newValue: any }>;
  summary: string;
}

const STORAGE_KEY = 'resume-snapshots';
const MAX_SNAPSHOTS = 50; // Keep only the last 50 snapshots

// Create a new snapshot
export function createSnapshot(
  resume: Resume,
  label?: string,
  parentSnapshotId?: string
): ResumeSnapshot {
  const timestamp = new Date().toISOString();
  const id = generateSnapshotId(resume, timestamp);
  const serialized = JSON.stringify(resume);
  const compressed = compress(serialized);
  const checksum = generateChecksum(serialized);
  
  const snapshot: ResumeSnapshot = {
    id,
    resume: { ...resume },
    label: label || generateAutoLabel(resume),
    timestamp,
    version: resume.metadata.version,
    checksum,
    metadata: {
      size: serialized.length,
      compressedSize: compressed.length,
      parentSnapshot: parentSnapshotId,
    },
  };
  
  // Calculate changes if we have a parent
  if (parentSnapshotId) {
    const parentSnapshot = getSnapshot(parentSnapshotId);
    if (parentSnapshot) {
      const diff = diffResumes(parentSnapshot.resume, resume);
      snapshot.metadata.changes = summarizeChanges(diff);
    }
  }
  
  return snapshot;
}

// Save snapshot to storage
export function saveSnapshot(snapshot: ResumeSnapshot): void {
  const snapshots = getAllSnapshots();
  
  // Remove snapshot with same ID if exists
  const filtered = snapshots.filter(s => s.id !== snapshot.id);
  
  // Add new snapshot
  filtered.push(snapshot);
  
  // Sort by timestamp (newest first)
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Keep only the most recent snapshots
  const limited = filtered.slice(0, MAX_SNAPSHOTS);
  
  // Save to localStorage with compression
  try {
    const compressed = compress(JSON.stringify(limited));
    localStorage.setItem(STORAGE_KEY, compressed);
  } catch (error) {
    console.error('Failed to save snapshot:', error);
    // Try to clean up old snapshots and retry
    const emergency = limited.slice(0, 20);
    try {
      const emergencyCompressed = compress(JSON.stringify(emergency));
      localStorage.setItem(STORAGE_KEY, emergencyCompressed);
    } catch (retryError) {
      console.error('Emergency snapshot save failed:', retryError);
    }
  }
}

// Get all snapshots
export function getAllSnapshots(): ResumeSnapshot[] {
  try {
    const compressed = localStorage.getItem(STORAGE_KEY);
    if (!compressed) return [];
    
    const decompressed = decompress(compressed);
    if (!decompressed) return [];
    
    return JSON.parse(decompressed);
  } catch (error) {
    console.error('Failed to load snapshots:', error);
    return [];
  }
}

// Get specific snapshot
export function getSnapshot(id: string): ResumeSnapshot | undefined {
  const snapshots = getAllSnapshots();
  return snapshots.find(s => s.id === id);
}

// Delete snapshot
export function deleteSnapshot(id: string): boolean {
  const snapshots = getAllSnapshots();
  const filtered = snapshots.filter(s => s.id !== id);
  
  if (filtered.length === snapshots.length) {
    return false; // Snapshot not found
  }
  
  try {
    const compressed = compress(JSON.stringify(filtered));
    localStorage.setItem(STORAGE_KEY, compressed);
    return true;
  } catch (error) {
    console.error('Failed to delete snapshot:', error);
    return false;
  }
}

// Auto-save functionality
export function autoSave(resume: Resume, parentSnapshotId?: string): string {
  const label = `Auto-save ${new Date().toLocaleString()}`;
  const snapshot = createSnapshot(resume, label, parentSnapshotId);
  saveSnapshot(snapshot);
  return snapshot.id;
}

// Create manual save with custom label
export function manualSave(
  resume: Resume,
  label: string,
  parentSnapshotId?: string
): string {
  const snapshot = createSnapshot(resume, label, parentSnapshotId);
  saveSnapshot(snapshot);
  return snapshot.id;
}

// Restore resume from snapshot
export function restoreFromSnapshot(id: string): Resume | null {
  const snapshot = getSnapshot(id);
  if (!snapshot) return null;
  
  // Return a deep copy to avoid mutations
  return JSON.parse(JSON.stringify(snapshot.resume));
}

// Compare two resumes and generate diff
export function diffResumes(oldResume: Resume, newResume: Resume): SnapshotDiff {
  const diff: SnapshotDiff = {
    added: [],
    removed: [],
    modified: [],
    summary: '',
  };
  
  // Compare basic fields
  const basicFields = ['name', 'title', 'summary'];
  basicFields.forEach(field => {
    const oldVal = (oldResume as any)[field];
    const newVal = (newResume as any)[field];
    
    if (oldVal !== newVal) {
      if (!oldVal && newVal) {
        diff.added.push({ path: field, value: newVal });
      } else if (oldVal && !newVal) {
        diff.removed.push({ path: field, value: oldVal });
      } else {
        diff.modified.push({ path: field, oldValue: oldVal, newValue: newVal });
      }
    }
  });
  
  // Compare contact info
  Object.keys(newResume.contact).forEach(key => {
    const oldVal = (oldResume.contact as any)[key];
    const newVal = (newResume.contact as any)[key];
    
    if (oldVal !== newVal) {
      const path = `contact.${key}`;
      if (!oldVal && newVal) {
        diff.added.push({ path, value: newVal });
      } else if (oldVal && !newVal) {
        diff.removed.push({ path, value: oldVal });
      } else {
        diff.modified.push({ path, oldValue: oldVal, newValue: newVal });
      }
    }
  });
  
  // Compare arrays (experiences, education, etc.)
  const arrayFields = ['experiences', 'education', 'projects', 'skills', 'certifications', 'achievements'];
  arrayFields.forEach(field => {
    const oldArray = (oldResume as any)[field] || [];
    const newArray = (newResume as any)[field] || [];
    
    // Simple comparison by length and content
    if (oldArray.length !== newArray.length) {
      diff.modified.push({
        path: field,
        oldValue: `${oldArray.length} items`,
        newValue: `${newArray.length} items`,
      });
    }
  });
  
  // Generate summary
  diff.summary = generateDiffSummary(diff);
  
  return diff;
}

// Generate diff summary
function generateDiffSummary(diff: SnapshotDiff): string {
  const changes: string[] = [];
  
  if (diff.added.length > 0) {
    changes.push(`${diff.added.length} addition${diff.added.length === 1 ? '' : 's'}`);
  }
  
  if (diff.removed.length > 0) {
    changes.push(`${diff.removed.length} removal${diff.removed.length === 1 ? '' : 's'}`);
  }
  
  if (diff.modified.length > 0) {
    changes.push(`${diff.modified.length} modification${diff.modified.length === 1 ? '' : 's'}`);
  }
  
  if (changes.length === 0) {
    return 'No changes';
  }
  
  return changes.join(', ');
}

// Summarize changes for metadata
function summarizeChanges(diff: SnapshotDiff): string[] {
  const changes: string[] = [];
  
  diff.added.forEach(change => {
    changes.push(`Added ${change.path}`);
  });
  
  diff.removed.forEach(change => {
    changes.push(`Removed ${change.path}`);
  });
  
  diff.modified.forEach(change => {
    changes.push(`Modified ${change.path}`);
  });
  
  return changes;
}

// Generate auto-label based on resume content
function generateAutoLabel(resume: Resume): string {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Try to identify what was likely changed
  if (resume.experiences.length > 0) {
    const latestExp = resume.experiences[0];
    if (latestExp.company) {
      return `Updated ${latestExp.company} experience - ${timeStr}`;
    }
  }
  
  if (resume.projects.length > 0) {
    return `Updated projects - ${timeStr}`;
  }
  
  return `Resume update - ${timeStr}`;
}

// Generate snapshot ID
function generateSnapshotId(resume: Resume, timestamp: string): string {
  const content = `${resume.name}-${timestamp}`;
  return btoa(content).replace(/[/+=]/g, '').substring(0, 12);
}

// Generate checksum for integrity
function generateChecksum(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

// Get storage statistics
export function getStorageStats(): {
  snapshotCount: number;
  totalSize: number;
  compressedSize: number;
  compressionRatio: number;
  oldestSnapshot?: string;
  newestSnapshot?: string;
} {
  const snapshots = getAllSnapshots();
  
  if (snapshots.length === 0) {
    return {
      snapshotCount: 0,
      totalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
    };
  }
  
  const totalSize = snapshots.reduce((sum, s) => sum + s.metadata.size, 0);
  const compressedSize = snapshots.reduce((sum, s) => sum + s.metadata.compressedSize, 0);
  
  const sortedByTime = [...snapshots].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  return {
    snapshotCount: snapshots.length,
    totalSize,
    compressedSize,
    compressionRatio: totalSize > 0 ? compressedSize / totalSize : 0,
    oldestSnapshot: sortedByTime[0]?.timestamp,
    newestSnapshot: sortedByTime[sortedByTime.length - 1]?.timestamp,
  };
}

// Clean up old snapshots
export function cleanupOldSnapshots(keepCount: number = 20): number {
  const snapshots = getAllSnapshots();
  
  if (snapshots.length <= keepCount) {
    return 0;
  }
  
  const sorted = snapshots.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const toKeep = sorted.slice(0, keepCount);
  const removed = snapshots.length - toKeep.length;
  
  try {
    const compressed = compress(JSON.stringify(toKeep));
    localStorage.setItem(STORAGE_KEY, compressed);
    return removed;
  } catch (error) {
    console.error('Failed to cleanup snapshots:', error);
    return 0;
  }
}

// Export snapshots for backup
export function exportSnapshots(): Blob {
  const snapshots = getAllSnapshots();
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    snapshots,
  };
  
  return new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
}

// Import snapshots from backup
export function importSnapshots(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!data.snapshots || !Array.isArray(data.snapshots)) {
          throw new Error('Invalid backup file format');
        }
        
        const existingSnapshots = getAllSnapshots();
        const importedSnapshots = data.snapshots as ResumeSnapshot[];
        
        // Merge with existing, avoiding duplicates
        const merged = [...existingSnapshots];
        let imported = 0;
        
        importedSnapshots.forEach(snapshot => {
          if (!merged.find(s => s.id === snapshot.id)) {
            merged.push(snapshot);
            imported++;
          }
        });
        
        // Sort and limit
        merged.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        const limited = merged.slice(0, MAX_SNAPSHOTS);
        
        // Save
        const compressed = compress(JSON.stringify(limited));
        localStorage.setItem(STORAGE_KEY, compressed);
        
        resolve(imported);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
