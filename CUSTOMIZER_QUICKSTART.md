# Customizer Module - Quick Start Guide

Complete backend integration for image uploads to Google Drive with NestJS.

## What You Get

✅ **Full-featured customizer module** with:
- Image upload to Google Drive
- Automatic session folder management
- File overwriting (final.png)
- Shareable public URLs
- Session cleanup function
- Complete error handling
- Production-ready code

## Files Created

```
src/customizer/
├── customizer.module.ts      (Module definition)
├── customizer.controller.ts  (API endpoints)
└── customizer.service.ts     (Google Drive logic)
```

## API Endpoints (Live)

```
POST   /customizer/upload              - Upload image
DELETE /customizer/cleanup/:sessionId  - Delete session files
POST   /customizer/session/:sessionId  - Get session folder URL
```

## Quick Setup (5 minutes)

### 1. Get Google Drive Credentials

Follow **Step 1** in `CUSTOMIZER_SETUP.md`:
- Create Google Cloud Project
- Enable Google Drive API
- Create Service Account
- Download JSON key file

### 2. Configure Environment

**For Local Development:**
```bash
# Copy your JSON key file
cp /path/to/your-key.json ./google-drive-credentials.json

# Or set in .env.local
echo 'GOOGLE_DRIVE_CREDENTIALS_PATH=./google-drive-credentials.json' >> .env.local
```

**For Vercel Production:**
```
GOOGLE_DRIVE_CREDENTIALS_JSON={"type":"service_account",...}
```

See `CUSTOMIZER_SETUP.md` Step 2 for full instructions.

### 3. Install & Build

```bash
npm install
npm run build
```

### 4. Test Locally

```bash
npm run start:dev
```

Then test the upload endpoint:
```bash
curl -X POST \
  -F "file=@image.png" \
  -F "session=test_sess_123" \
  http://localhost:3000/customizer/upload
```

### 5. Deploy to Vercel

```bash
npm run build
npx vercel deploy --prod
```

**Add environment variable in Vercel Dashboard:**
- Settings → Environment Variables
- Add: `GOOGLE_DRIVE_CREDENTIALS_JSON`
- Redeploy

## Example Frontend Integration

```javascript
// Upload image
async function uploadImage(imageBlob, sessionId) {
  const formData = new FormData();
  formData.append('file', imageBlob);
  formData.append('session', sessionId);

  const response = await fetch(
    'https://your-backend.vercel.app/customizer/upload',
    { method: 'POST', body: formData }
  );

  const result = await response.json();
  console.log('Shareable URL:', result.data.shareableUrl);
}

// Cleanup
async function cleanup(sessionId) {
  await fetch(
    `https://your-backend.vercel.app/customizer/cleanup/${sessionId}`,
    { method: 'DELETE' }
  );
}
```

## Response Format

**Success (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "data": {
    "fileId": "1abc2def3ghi4jkl...",
    "fileName": "final.png",
    "shareableUrl": "https://drive.google.com/uc?id=1abc2def..."
  }
}
```

**Error (400/500):**
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Error description"
}
```

## Key Features

### Session Management
- Each session gets own Google Drive folder: `/sessions/<sessionId>/`
- Automatic folder creation
- Caching for performance

### File Handling
- Accepts PNG and JPG only
- Max 10MB per file
- Overwrites `final.png` if exists
- Auto-generates shareable URLs

### Cleanup
- Delete all files in session folder
- Delete the session folder itself
- Remove from cache

## Configuration Files

| File | Purpose |
|------|---------|
| `src/customizer/customizer.service.ts` | Google Drive API logic |
| `src/customizer/customizer.controller.ts` | REST endpoints |
| `src/customizer/customizer.module.ts` | NestJS module |
| `CUSTOMIZER_SETUP.md` | Complete setup guide |
| `.env.example` | Environment variables reference |

## Environment Variables

```env
# Required (choose one)
GOOGLE_DRIVE_CREDENTIALS_PATH=./google-drive-credentials.json
# OR
GOOGLE_DRIVE_CREDENTIALS_JSON={"type":"service_account",...}

# Optional
NODE_ENV=development
PORT=3000
```

## Troubleshooting

### "Credentials not configured"
- Set `GOOGLE_DRIVE_CREDENTIALS_PATH` or `GOOGLE_DRIVE_CREDENTIALS_JSON`
- Restart the server

### "Permission denied"
- Verify service account email from JSON file
- Share target Google Drive folder with that email

### "File not public"
- Module auto-makes files public
- Check Google Drive sharing settings manually if needed

## Testing

### Via cURL
```bash
# Upload
curl -X POST \
  -F "file=@image.png" \
  -F "session=sess_123" \
  http://localhost:3000/customizer/upload

# Cleanup
curl -X DELETE \
  http://localhost:3000/customizer/cleanup/sess_123
```

### Via Postman
1. Create POST request to `/customizer/upload`
2. Body → form-data
3. Add fields: `file` (file), `session` (text)
4. Send

### Via JavaScript (Browser)
```javascript
const input = document.querySelector('input[type="file"]');
const formData = new FormData();
formData.append('file', input.files[0]);
formData.append('session', 'sess_user_123');

fetch('/customizer/upload', { method: 'POST', body: formData })
  .then(r => r.json())
  .then(data => console.log(data.data.shareableUrl));
```

## Production Checklist

- [ ] Create Google Cloud Project
- [ ] Create Service Account
- [ ] Download credentials JSON
- [ ] Minify credentials JSON
- [ ] Add to Vercel environment variables
- [ ] Deploy to Vercel
- [ ] Test upload endpoint
- [ ] Integrate with frontend
- [ ] Set up cleanup job (optional)

## Advanced Usage

### Shopify Integration (Coming Soon)

The controller accepts optional `shop` and `accessToken` fields for future Shopify API integration:

```javascript
formData.append('shop', 'myshop.myshopify.com');
formData.append('accessToken', shopify_token);
```

See `customizer.controller.ts` line ~40 for implementation.

### Custom Folder Structure

To change folder structure, modify `getOrCreateSessionFolder()` in `customizer.service.ts`.

### Cache Management

Folder IDs are cached in memory. To clear:
```typescript
// In service
private sessionFolderCache: Map<string, string> = new Map();
sessionFolderCache.clear(); // Clear all
sessionFolderCache.delete(sessionId); // Clear specific session
```

## Support

For detailed setup instructions, see `CUSTOMIZER_SETUP.md`.

For Google Drive API docs, visit:
- [Google Drive API](https://developers.google.com/drive/api/v3)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)

---

**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Dependencies:** `googleapis`, `@nestjs/platform-express`
