# Setting Up Google Drive for Customizer Module

## Easy Solution: Share a Folder with Service Account

Instead of creating a Shared Drive, you can simply share a regular folder from your personal Google Drive with the service account:

### Step 1: Create a Folder in Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Right-click in an empty area → **"New folder"**
3. Name it: `Loretana Customizer`
4. Open the folder

### Step 2: Share with Service Account

1. Click **"Share"** button (top right)
2. Enter this email:
   ```
   loretana@loretana-project.iam.gserviceaccount.com
   ```
3. Give **Editor** access
4. Click **"Share"**

### Step 3: Get Folder ID (Optional)

If you want to restrict uploads to only this folder:

1. Right-click the folder → **"Get link"**
2. Copy the URL from your browser:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```
3. Extract the `FOLDER_ID_HERE` part
4. Set in `.env`:
   ```
   GOOGLE_DRIVE_SHARED_DRIVE_ID=FOLDER_ID_HERE
   ```

**Without setting the folder ID**, files will be uploaded to the service account's root Drive (which works fine for testing).

## That's it!

Your API will now work. The service account has been granted access to upload files to your Google Drive.

## Testing

```bash
npm run build
npm start
```

Then test in Postman as usual.
