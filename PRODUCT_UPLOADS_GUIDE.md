# Product Uploads - Short Code QR System

## Overview

This system generates unique short codes for customized product images that can be embedded in QR codes. When customers scan the QR code, they can see the customized photo on your Shopify store.

**Flow:**
1. User uploads customized image
2. System stores image in Supabase  
3. System generates unique short code (e.g., `ABC123XY`)
4. QR code created: `loretana.com/view/ABC123XY`
5. Customer scans QR → Sees popup with photo

## Database Setup

Before using this feature, you need to create the `uploads` table in Supabase:

### Step 1: Access Supabase Console
1. Go to: https://app.supabase.com
2. Select your project: `ruuezvgeduepdgxoqmhb`
3. Go to **SQL Editor**

### Step 2: Run the Migration
Copy and paste the contents of `SUPABASE_UPLOADS_TABLE_MIGRATION.sql` into the SQL editor and execute it.

This creates:
- `uploads` table with columns for code, images, product info, and metadata
- Indexes for fast lookups
- Row-level security policies
- Auto-update timestamp trigger

### Table Schema
```sql
uploads (
  id UUID PRIMARY KEY,
  code VARCHAR(10) UNIQUE,          -- Short code like ABC123XY
  session_id VARCHAR(255),           -- Original session ID
  image_url TEXT,                    -- Main customized image
  original_image_url TEXT,           -- Original before customization
  shaped_image_url TEXT,             -- Shaped/masked version
  product_id VARCHAR(255),           -- Shopify product ID
  product_name VARCHAR(255),         -- Product name
  product_image_url TEXT,            -- Product image
  metadata JSONB,                    -- Custom data (zoom, x, y, shape, etc.)
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  expires_at TIMESTAMP
)
```

## API Endpoints

### 1. Create Upload Record (POST)
**Endpoint:** `POST /uploads`

**Purpose:** Create an upload record and get a short code

**Body:**
```json
{
  "imageUrl": "https://..../customizer/sess_123/circle.png",
  "sessionId": "sess_user123",
  "productId": "gid://shopify/Product/123456",
  "productName": "T-Shirt Custom Print",
  "metadata": {
    "zoom": 1.2,
    "x": 50,
    "y": 50,
    "shape": "circle"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Upload record created successfully",
  "code": "ABC123XY",
  "uploadId": "uuid-here",
  "qrUrl": "loretana.com/view/ABC123XY",
  "shortUrl": "loretana.com/view/ABC123XY"
}
```

### 2. Get Upload by Code (GET)
**Endpoint:** `GET /uploads/:code`

**Example:** `GET /uploads/ABC123XY`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "code": "ABC123XY",
    "sessionId": "sess_user123",
    "imageUrl": "https://..../customizer/sess_123/circle.png",
    "productId": "gid://shopify/Product/123456",
    "productName": "T-Shirt Custom Print",
    "metadata": {
      "zoom": 1.2,
      "x": 50,
      "y": 50,
      "shape": "circle"
    },
    "createdAt": "2025-12-03T10:47:00.000Z"
  }
}
```

### 3. Get All Uploads for Session (GET)
**Endpoint:** `GET /uploads/session/:sessionId`

**Example:** `GET /uploads/session/sess_user123`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    { /* upload record 1 */ },
    { /* upload record 2 */ },
    { /* upload record 3 */ }
  ]
}
```

### 4. Update Upload Images (POST)
**Endpoint:** `POST /uploads/:code/images`

**Purpose:** Add original and shaped image URLs to existing record

**Body:**
```json
{
  "originalImageUrl": "https://..../customizer/sess_123/original.png",
  "shapedImageUrl": "https://..../customizer/sess_123/circle.png"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Upload record images updated successfully",
  "code": "ABC123XY"
}
```

### 5. Delete Upload (DELETE)
**Endpoint:** `DELETE /uploads/:code`

**Example:** `DELETE /uploads/ABC123XY`

**Response:**
```json
{
  "success": true,
  "message": "Upload record deleted successfully",
  "code": "ABC123XY"
}
```

## Integration Example

### Step 1: User Uploads Customized Image
```bash
POST /customizer/upload
Body:
  file: image.png
  session: sess_user123
  shape: circle
  zoom: 1.2
  x: 50
  y: 50
```

Response includes `originalUrl` and `shapedUrl`

### Step 2: Create Upload Record with Short Code
```bash
POST /uploads
Body:
{
  "imageUrl": "https://..../customizer/sess_user123/circle.png",
  "sessionId": "sess_user123",
  "productId": "gid://shopify/Product/123456",
  "productName": "Custom T-Shirt",
  "metadata": {
    "zoom": 1.2,
    "x": 50,
    "y": 50,
    "shape": "circle"
  }
}
```

Response:
```json
{
  "code": "ABC123XY",
  "qrUrl": "loretana.com/view/ABC123XY"
}
```

### Step 3: Generate QR Code
```bash
POST /qr/save
Body:
{
  "url": "loretana.com/view/ABC123XY",
  "sessionId": "sess_user123",
  "width": 400,
  "errorCorrection": "H"
}
```

### Step 4: Customer Scans QR on Shopify
- QR links to: `loretana.com/view/ABC123XY`
- Your Shopify store fetches the upload record via `/uploads/ABC123XY`
- Display customized image in popup/modal
- Customer can see what their custom product looks like

## Features

✅ **Unique Short Codes** - Auto-generated 8-character codes (e.g., `ABC123XY`)  
✅ **QR Code Integration** - Direct integration with `/qr/save` endpoint  
✅ **Session Tracking** - Link uploads to original customization sessions  
✅ **Shopify Integration** - Store product IDs and metadata  
✅ **Metadata Support** - Store customization parameters (zoom, x, y, shape)  
✅ **Automatic Timestamps** - Track when uploads were created/modified  
✅ **Expiration Support** - Optional expiration dates for temporary links  
✅ **Row-Level Security** - Public read access for QR scanning  

## Usage in Shopify

### Frontend (Liquid Template)
```liquid
<!-- Display QR code on product page -->
<img src="/qr?url=loretana.com/view/{{ code }}&width=300" alt="View Custom Design" />

<!-- Show popup when QR is scanned -->
<script>
  const code = new URLSearchParams(window.location.search).get('code');
  if (code) {
    fetch(`https://yourapi.com/uploads/${code}`)
      .then(r => r.json())
      .then(data => {
        // Display image in popup
        showPopup(data.data.imageUrl);
      });
  }
</script>
```

## Error Handling

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Image URL is required | Provide imageUrl in body |
| 400 | Session ID is required | Provide sessionId in body |
| 404 | Upload record not found | Check code is correct |
| 500 | Database error | Ensure table was created via migration |

## Testing with Postman

Updated endpoints added to `postman_customizer_collection.json`:
- **Create Upload Record** - POST /uploads
- **Get Upload by Code** - GET /uploads/:code
- **Get Session Uploads** - GET /uploads/session/:sessionId
- **Update Upload Images** - POST /uploads/:code/images
- **Delete Upload** - DELETE /uploads/:code

## Architecture

```
User Upload Image
       ↓
Customizer Service
(stores in Supabase Storage)
       ↓
ProductUploads Service
(generates short code + DB record)
       ↓
QR Service
(creates QR code with short URL)
       ↓
Supabase Table: uploads
(stores code, image URLs, metadata)
       ↓
Customer scans QR
       ↓
loretana.com/view/{code}
       ↓
Frontend fetches /uploads/{code}
       ↓
Display in popup
```

## Next Steps

1. ✅ Run the SQL migration in Supabase
2. ✅ Test endpoints with Postman
3. Integrate into your Shopify theme
4. Add popup/modal to display images
5. Track analytics (code scans, conversions)
