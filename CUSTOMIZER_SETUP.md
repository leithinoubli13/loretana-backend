# Customizer Module - Google Drive Integration Setup Guide

This guide explains how to set up the customizer module with Google Drive integration for image uploads.

## Features

- Upload images to Google Drive (organized by session)
- Automatic folder management (`/sessions/<sessionId>/`)
- File overwriting (replaces `final.png` if exists)
- Shareable public URLs for uploaded images
- Session cleanup function to delete all files
- Complete Google Drive API integration with service accounts

## Step 1: Create a Google Cloud Project and Service Account

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter a project name (e.g., "Loretana Customizer")
5. Click "CREATE"
6. Wait for the project to be created and select it

### 1.2 Enable Google Drive API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click on it and press **ENABLE**

### 1.3 Create a Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **CREATE CREDENTIALS** → **Service Account**
3. Fill in the details:
   - **Service account name**: `loretana-customizer`
   - **Service account ID**: (auto-filled)
   - **Description**: `Service account for Loretana image uploads to Google Drive`
4. Click **CREATE AND CONTINUE**
5. Grant roles (optional but recommended):
   - Click **SELECT A ROLE**
   - Search for "Editor" and select it
   - Click **CONTINUE**
6. Click **DONE**

### 1.4 Create a Service Account Key

1. In the **Credentials** page, find the service account you just created
2. Click on the service account email to open its details
3. Go to the **KEYS** tab
4. Click **ADD KEY** → **Create new key**
5. Select **JSON** as the key type
6. Click **CREATE**
7. A JSON file will be downloaded automatically
8. **Important**: Save this file securely (you'll use it in Step 2)

## Step 2: Configure Environment Variables

You have two options to provide Google Drive credentials:

### Option A: Using Environment Variable (Recommended for Production/Vercel)

1. Copy the contents of the downloaded JSON key file
2. Minify it (remove all newlines): Use an online JSON minifier or:
   ```bash
   cat your-key-file.json | jq -c . | xclip -selection clipboard
   ```
3. In your environment (Vercel Dashboard / `.env.local`):
   ```
   GOOGLE_DRIVE_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key":"..."}
   ```

### Option B: Using File Path (Recommended for Local Development)

1. Place the JSON key file in your project (e.g., `./google-drive-credentials.json`)
2. In your `.env.local`:
   ```
   GOOGLE_DRIVE_CREDENTIALS_PATH=./google-drive-credentials.json
   ```
3. Add to `.gitignore` to prevent accidental commits:
   ```
   google-drive-credentials.json
   ```

## Step 3: Create a Shared Google Drive Folder (Optional but Recommended)

To make file management easier, create a parent folder in Google Drive:

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder called `loretana-sessions`
3. Right-click → **Share**
4. Share with the service account email (found in your credentials JSON under `client_email`)
5. Grant "Editor" permissions

The module will automatically create `/sessions/<sessionId>/` subfolders as needed.

## Step 4: Install Dependencies

```bash
npm install googleapis
npm install
npm run build
```

## Step 5: Update Vercel Environment Variables

If deploying to Vercel:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add:
   ```
   GOOGLE_DRIVE_CREDENTIALS_JSON = (paste your minified JSON credentials)
   ```
3. Select **Production**, **Preview**, and **Development** environments
4. Click **Save**
5. Redeploy:
   ```bash
   npm run build
   npx vercel deploy --prod
   ```

## API Endpoints

### 1. Upload Image

**POST** `/customizer/upload`

**Form Data:**
```
- file: PNG or JPG image file (required, max 10MB)
- session: unique session ID, e.g., "sess_abcd123" (required)
- shop: shop domain for Shopify integration (optional)
- accessToken: Shopify access token (optional)
```

**Example using curl:**
```bash
curl -X POST \
  -F "file=@image.png" \
  -F "session=sess_user123" \
  -F "shop=myshop.myshopify.com" \
  https://loretana-backend.vercel.app/customizer/upload
```

**Example using JavaScript/Fetch:**
```javascript
const formData = new FormData();
formData.append('file', imageFile); // HTML file input
formData.append('session', 'sess_user123');
formData.append('shop', 'myshop.myshopify.com');

const response = await fetch(
  'https://loretana-backend.vercel.app/customizer/upload',
  {
    method: 'POST',
    body: formData,
  }
);

const data = await response.json();
console.log('Shareable URL:', data.data.shareableUrl);
```

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "data": {
    "success": true,
    "fileId": "1abc2def3ghi4jkl5mno6pqr7stu8vwx",
    "fileName": "final.png",
    "shareableUrl": "https://drive.google.com/uc?id=1abc2def3ghi4jkl5mno6pqr7stu8vwx",
    "message": "Image uploaded successfully"
  },
  "message": "Image uploaded successfully"
}
```

### 2. Cleanup Session Files

**DELETE** `/customizer/cleanup/:sessionId`

Deletes all files in the session folder and the folder itself.

**Example:**
```bash
curl -X DELETE \
  https://loretana-backend.vercel.app/customizer/cleanup/sess_user123
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "success": true,
    "message": "Session cleanup completed. 2 files deleted.",
    "filesDeleted": 2
  },
  "message": "Session files deleted successfully"
}
```

### 3. Get Session Folder URL

**POST** `/customizer/session/:sessionId`

Returns the Google Drive folder URL for the session (useful for debugging).

**Example:**
```bash
curl -X POST \
  https://loretana-backend.vercel.app/customizer/session/sess_user123
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "sessionId": "sess_user123",
    "folderUrl": "https://drive.google.com/drive/folders/1abc2def3ghi4jkl5mno6pqr7stu8vwx"
  },
  "message": "Session information retrieved"
}
```

## Usage Example: Frontend Integration

```javascript
// Example: Upload image from Shopify customizer
async function uploadCustomizationImage(imageBlob, sessionId) {
  const formData = new FormData();
  formData.append('file', imageBlob, 'final.png');
  formData.append('session', sessionId);
  formData.append('shop', Shopify.shop);
  formData.append('accessToken', window.accessToken); // if available

  try {
    const response = await fetch(
      'https://loretana-backend.vercel.app/customizer/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();
    if (result.success) {
      console.log('Image uploaded:', result.data.shareableUrl);
      // Use the shareable URL in your app
      return result.data.shareableUrl;
    } else {
      console.error('Upload failed:', result);
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
}

// Cleanup session when done
async function cleanupSession(sessionId) {
  try {
    const response = await fetch(
      `https://loretana-backend.vercel.app/customizer/cleanup/${sessionId}`,
      { method: 'DELETE' }
    );

    const result = await response.json();
    console.log('Cleanup result:', result);
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}
```

## Google Drive Folder Structure

After using the module, your Google Drive will have this structure:

```
Google Drive Root
└── sessions/
    ├── sess_user123/
    │   └── final.png
    ├── sess_user456/
    │   └── final.png
    └── sess_user789/
        └── final.png
```

## Troubleshooting

### Issue: "Google Drive credentials not configured"

**Solution**: Ensure one of these is set:
- `GOOGLE_DRIVE_CREDENTIALS_JSON` environment variable
- `GOOGLE_DRIVE_CREDENTIALS_PATH` pointing to a valid JSON file

### Issue: "Permission denied" errors

**Solution**:
1. Check that the service account email (from JSON `client_email`) has access to Google Drive
2. If you created a parent `loretana-sessions` folder, ensure it's shared with the service account email
3. Verify the service account has "Editor" role permissions

### Issue: File not publicly accessible

**Solution**: The module automatically makes files public. If you want additional control:
1. Manually set sharing permissions in Google Drive
2. Or modify the `makeFilePublic()` method in `customizer.service.ts`

### Issue: Rate limiting / Too many requests

**Solution**:
1. Add exponential backoff retries in the service
2. Batch operations when possible
3. Cache folder IDs (already done in `sessionFolderCache`)

## Security Notes

1. **Keep credentials secure**: Never commit `google-drive-credentials.json` to version control
2. **Use environment variables**: Store credentials as environment variables in production
3. **Limit service account permissions**: Consider using a custom IAM role instead of "Editor"
4. **Monitor access**: Regularly check Google Cloud audit logs for suspicious activity
5. **Rotate keys**: Periodically create new service account keys and rotate old ones

## Next Steps

1. Test locally: `npm run build && npm run start:dev`
2. Test the endpoints with curl or Postman
3. Deploy to Vercel
4. Integrate with your Shopify frontend

For more information, see:
- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [Google Auth Library for Node.js](https://github.com/googleapis/google-auth-library-nodejs)
