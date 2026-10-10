import { getCachedAccessToken } from './googleAuth';

export interface DriveBackupFile {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  size?: string;
  description?: string;
}

const DRIVE_FILE_NAME = 'frontier_solar_crm_database_backup.json';
const DRIVE_FOLDER_NAME = 'SolarFlow CRM Backups';

/**
 * Helper to ensure a specific folder exists or find it
 */
async function getOrCreateBackupFolder(accessToken: string): Promise<string> {
  const query = encodeURIComponent(
    `name = '${DRIVE_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&spaces=drive`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!searchRes.ok) {
    throw new Error(`Failed to query Google Drive folders: ${searchRes.statusText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder
  const folderMetadata = {
    name: DRIVE_FOLDER_NAME,
    mimeType: 'application/vnd.google-apps.folder',
    description: 'Automated database backups from SolarFlow CRM App',
  };

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(folderMetadata),
  });

  if (!createRes.ok) {
    throw new Error(`Failed to create Google Drive folder: ${createRes.statusText}`);
  }

  const folder = await createRes.json();
  return folder.id;
}

/**
 * Save complete application database to Google Drive
 */
export async function saveDatabaseToGoogleDrive(databaseData: any): Promise<{
  success: boolean;
  fileId: string;
  timestamp: string;
  name: string;
}> {
  const accessToken = getCachedAccessToken();
  if (!accessToken) {
    throw new Error('You must be signed in with your Google ID to back up to Google Drive.');
  }

  const folderId = await getOrCreateBackupFolder(accessToken);
  const timestamp = new Date().toISOString();
  const readableDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const fileName = `Frontier_Solar_CRM_DB_${readableDate.replace(/[: ]/g, '_')}.json`;
  const fileContent = JSON.stringify(
    {
      _app: 'SolarFlow CRM - Frontier Complete Solar Solutions',
      _exportedAt: timestamp,
      _version: '2.1.0',
      data: databaseData,
    },
    null,
    2
  );

  // Check if primary auto-backup file exists to update, or create a timestamped backup
  const metadata = {
    name: fileName,
    description: `Full SolarFlow CRM Database Backup created on ${readableDate}`,
    parents: [folderId],
    mimeType: 'application/json',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Google Drive upload failed: ${errorText || uploadRes.statusText}`);
  }

  const uploadedFile = await uploadRes.json();
  return {
    success: true,
    fileId: uploadedFile.id,
    timestamp,
    name: fileName,
  };
}

/**
 * List all backup files in Google Drive
 */
export async function listDatabaseBackupsFromGoogleDrive(): Promise<DriveBackupFile[]> {
  const accessToken = getCachedAccessToken();
  if (!accessToken) {
    throw new Error('Please sign in with Google to view backups in Google Drive.');
  }

  const query = encodeURIComponent("name contains 'Frontier_Solar_CRM_DB_' and trashed = false");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,createdTime,modifiedTime,size,description)&orderBy=createdTime desc&pageSize=20`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to list backups from Google Drive: ${res.statusText}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Restore complete database from a specific Google Drive backup file
 */
export async function restoreDatabaseFromGoogleDrive(fileId: string): Promise<any> {
  const accessToken = getCachedAccessToken();
  if (!accessToken) {
    throw new Error('Please sign in with Google to restore from Google Drive.');
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to download backup file from Google Drive: ${res.statusText}`);
  }

  const backupJson = await res.json();
  // Extract database data: support both wrapped and raw format
  if (backupJson.data && backupJson._app) {
    return backupJson.data;
  }
  return backupJson;
}

/**
 * Delete a backup file from Google Drive with explicit confirmation required
 */
export async function deleteBackupFileFromGoogleDrive(fileId: string): Promise<boolean> {
  const accessToken = getCachedAccessToken();
  if (!accessToken) {
    throw new Error('Please sign in with Google to manage Google Drive files.');
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete backup from Google Drive: ${res.statusText}`);
  }

  return true;
}
