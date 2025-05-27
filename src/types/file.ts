
export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  content?: string;
  pages?: number;
  lastModified: number;
  uploadProgress: number;
  error?: string;
}

export interface FileProcessingStatus {
  isProcessing: boolean;
  progress: number;
  error?: string;
}

export interface SecurityEvent {
  type: string;
  timestamp: number;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
