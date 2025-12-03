# Simplified Product Upload Flow - Complete in One Request!

## 🎯 New Endpoint: POST /products/upload

**Everything in ONE request:**
1. Upload image file
2. Store in Supabase Storage
3. Create database record with short code
4. Generate QR code
5. Get product URL: `loretana.com/product/{CODE}`

---

## 📤 Request Example

```bash
curl -X POST http://localhost:3000/products/upload \
  -F "file=@image.png" \
  -F "productId=gid://shopify/Product/123456" \
  -F "productName=Custom T-Shirt" \
  -F "sessionId=sess_user123" \
  -F "metadata={\"zoom\": 1.2, \"shape\": \"circle\", \"x\": 50, \"y\": 50}"
```

### Body (Form Data):
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `file` | File | ✅ YES | image.png |
| `productId` | Text | ❌ No | gid://shopify/Product/123456 |
| `productName` | Text | ❌ No | Custom T-Shirt |
| `sessionId` | Text | ❌ No | sess_user123 |
| `metadata` | JSON | ❌ No | {"zoom": 1.2, "shape": "circle"} |

---

## 📥 Response Example

```json
{
  "success": true,
  "message": "Product image uploaded and processed successfully",
  "code": "ABC123XY",
  "imageUrl": "https://yoursupabase.supabase.co/storage/v1/object/public/customizer-uploads/products/ABC123XY/ABC123XY.png",
  "productUrl": "loretana.com/product/ABC123XY",
  "qrUrl": "https://yoursupabase.supabase.co/storage/v1/object/public/customizer-uploads/products/ABC123XY/qr_code.png",
  "qrFileId": "products/ABC123XY/qr_code.png",
  "uploadId": "uuid-here",
  "fileSize": 245678,
  "uploadedAt": "2025-12-03T10:57:30.000Z"
}
```

### What You Get:
- **`code`** - Short code (8 chars) for URL
- **`imageUrl`** - Direct link to uploaded image
- **`productUrl`** - `loretana.com/product/ABC123XY` - Use this in QR or links
- **`qrUrl`** - Direct link to QR code image
- **`uploadId`** - Database record ID

---

## 🚀 Complete Workflow

### Step 1: User Uploads Image
```
POST /products/upload
↓
Returns: code=ABC123XY, imageUrl, productUrl, qrUrl
```

### Step 2: Display QR Code to Customer
```
Show image: qrUrl
Print on product packaging
```

### Step 3: Customer Scans QR
```
QR redirects to: loretana.com/product/ABC123XY
```

### Step 4: Get Product Image
```
GET /products/ABC123XY
↓
{
  "imageUrl": "https://...",
  "productName": "Custom T-Shirt",
  "createdAt": "..."
}
```

### Step 5: Display in UI
```
Show imageUrl in popup/modal
Customer sees their custom design!
```

---

## 📋 Endpoints Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/products/upload` | POST | **NEW** - Upload image file, get code & QR |
| `/products/:code` | GET | Retrieve product image by code |
| `/products/:code` | DELETE | Delete product & files |

---

## 🗂️ Storage Structure

```
Supabase Storage: customizer-uploads bucket
└── products/
    └── ABC123XY/
        ├── ABC123XY.png        (Product image)
        └── qr_code.png         (QR code image)
```

---

## 📊 Database Structure

```
uploads table
├── code: "ABC123XY"
├── image_url: "https://..../ABC123XY.png"
├── product_id: "gid://shopify/Product/123456"
├── product_name: "Custom T-Shirt"
├── metadata: {"zoom": 1.2, "shape": "circle"}
└── created_at: "2025-12-03..."
```

---

## 🎯 Use Cases

### Case 1: T-Shirt Printing
```
1. User uploads custom design image
2. POST /products/upload
3. Get QR code + product URL
4. Print QR on packaging
5. Customer scans → sees their design
```

### Case 2: Show Preview
```
1. Upload image
2. Get: imageUrl + productUrl
3. Display preview in UI
4. Customer approves before purchasing
5. Generate QR for final product
```

### Case 3: Social Media
```
1. Upload product image
2. Get productUrl: "loretana.com/product/ABC123XY"
3. Share link on social media
4. Generate QR code for story/post
5. Followers scan → see product
```

---

## ✅ Features

✅ **One-Request Solution** - Everything happens in one POST  
✅ **Automatic File Storage** - Image stored in Supabase  
✅ **Auto Short Code** - 8-char unique code generated  
✅ **Auto QR Generation** - QR code created automatically  
✅ **Product URL** - `loretana.com/product/{code}`  
✅ **Metadata Support** - Store custom data  
✅ **File Validation** - Only PNG/JPG allowed  
✅ **Error Handling** - Clear error messages  

---

## 🔗 URL Format

All product URLs follow this pattern:
```
loretana.com/product/{code}
```

Examples:
```
loretana.com/product/ABC123XY
loretana.com/product/PROD001X
loretana.com/product/TSH42KLM
```

---

## 🔒 File Size Limits

- Max file size: Browser dependent (typically 100MB)
- Recommended: Keep under 10MB for fast processing
- Format: PNG or JPG only

---

## 📝 Postman Collection

Import `postman_customizer_collection.json` and test:
- **Upload Product Image (Complete Flow)** - Try this first!
- **Get Product by Code**
- **Delete Product**

---

## 🎨 Shopify Integration Example

```liquid
<!-- Product page -->
<div class="custom-product">
  <img src="{{ product.custom_image_url }}" alt="Custom Design" />
  <img src="{{ qr_code_url }}" alt="Scan for Design" class="qr-code" />
  <a href="loretana.com/product/{{ product_code }}" target="_blank">
    View Design Online
  </a>
</div>

<script>
  // When customer visits loretana.com/product/ABC123XY
  const code = getCodeFromURL();
  fetch(`/api/products/${code}`)
    .then(r => r.json())
    .then(data => {
      showPopup(data.imageUrl);
    });
</script>
```

---

## 🚨 Error Handling

| Status | Error | Solution |
|--------|-------|----------|
| 400 | File is required | Add file to multipart form |
| 400 | Only PNG and JPG files allowed | Convert to PNG or JPG |
| 404 | Product not found | Code doesn't exist |
| 500 | Supabase error | Check database table exists |

---

## 📊 Response Status Codes

- **200** - Success
- **400** - Bad request (missing file, wrong format)
- **404** - Product not found
- **500** - Server error

---

## ✨ Summary

**Old way:** Upload file → Store → Create record → Generate QR (4 requests)

**New way:** Upload file (1 request) ✅

Everything happens automatically in one endpoint!

---

**Ready to use!** Check Postman collection with the 3 new product endpoints.
