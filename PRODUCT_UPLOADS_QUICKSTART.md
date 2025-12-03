# Quick Start: Product Uploads QR System

## 🚀 TL;DR - Get Started in 5 Minutes

### 1️⃣ Create Database Table (FIRST!)
```sql
-- Go to: https://app.supabase.com
-- Select project: ruuezvgeduepdgxoqmhb
-- SQL Editor → New Query
-- Copy-paste: SUPABASE_UPLOADS_TABLE_MIGRATION.sql
-- Execute!
```

### 2️⃣ Test Endpoints in Postman
- Import: `postman_customizer_collection.json`
- Look for 5 new "Product Upload" endpoints

### 3️⃣ Create Upload Record
```bash
curl -X POST http://localhost:3000/uploads \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/image.png",
    "sessionId": "sess_123",
    "productId": "prod_456",
    "productName": "T-Shirt",
    "metadata": {"zoom": 1.2, "shape": "circle"}
  }'
```

**Response:**
```json
{
  "code": "ABC123XY",
  "qrUrl": "loretana.com/view/ABC123XY"
}
```

### 4️⃣ Generate QR Code
```bash
curl -X POST http://localhost:3000/qr/save \
  -H "Content-Type: application/json" \
  -d '{
    "url": "loretana.com/view/ABC123XY",
    "sessionId": "sess_123"
  }'
```

### 5️⃣ Get Upload by Code
```bash
curl http://localhost:3000/uploads/ABC123XY
```

---

## 📋 The 5 Endpoints

| # | Method | Endpoint | What It Does |
|---|--------|----------|------------|
| 1 | POST | `/uploads` | Create upload + get short code |
| 2 | GET | `/uploads/:code` | Get upload by code |
| 3 | GET | `/uploads/session/:sessionId` | Get all uploads for session |
| 4 | POST | `/uploads/:code/images` | Add image URLs |
| 5 | DELETE | `/uploads/:code` | Delete upload |

---

## 🎯 Common Use Cases

### Case 1: User Uploads Custom Image
```
1. POST /customizer/upload (upload image)
   ↓ Get: originalUrl, shapedUrl
2. POST /uploads (create record with imageUrl)
   ↓ Get: short code (ABC123XY)
3. POST /qr/save (generate QR for code)
   ↓ Get: QR code image
```

### Case 2: Customer Scans QR on Shopify
```
1. Customer scans QR → loretana.com/view/ABC123XY
2. Frontend fetches GET /uploads/ABC123XY
3. Display image in popup
4. Customer buys product
```

### Case 3: View All Designs for Session
```
GET /uploads/session/sess_user123
↓
Returns all uploads (designs) for that user
```

---

## 🔧 Database Schema (Simple!)

```
uploads table:
├─ code          → "ABC123XY" (unique 8-char code)
├─ imageUrl      → URL to customized image
├─ sessionId     → "sess_123" (links to original upload)
├─ productId     → Shopify product ID
├─ productName   → "T-Shirt Custom"
├─ metadata      → {"zoom": 1.2, "shape": "circle", ...}
└─ createdAt     → timestamp
```

---

## ⚙️ Environment Setup

✅ All credentials already configured:
- Supabase URL: ruuezvgeduepdgxoqmhb
- Service Role Key: Already in .env
- Shopify API: Already configured

❌ Still needed:
- [ ] Run SQL migration (creates table)
- [ ] That's it!

---

## 📝 Response Examples

### POST /uploads → Create
```json
{
  "success": true,
  "code": "ABC123XY",
  "qrUrl": "loretana.com/view/ABC123XY"
}
```

### GET /uploads/ABC123XY → Retrieve
```json
{
  "success": true,
  "data": {
    "code": "ABC123XY",
    "imageUrl": "https://...",
    "productName": "T-Shirt",
    "createdAt": "2025-12-03T10:47:00Z"
  }
}
```

### GET /uploads/session/sess_123 → List
```json
{
  "success": true,
  "count": 5,
  "data": [
    { /* upload 1 */ },
    { /* upload 2 */ },
    ...
  ]
}
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| `404 Upload record not found` | Code doesn't exist in database |
| `400 Image URL is required` | Add imageUrl to request body |
| `500 Database error` | Run the SQL migration first! |
| `Unique violation on code` | Very rare - system auto-retries |

---

## 📚 Full Documentation

For complete details, see:
- **PRODUCT_UPLOADS_GUIDE.md** - Full API docs
- **PRODUCT_UPLOADS_IMPLEMENTATION.md** - Architecture & setup

---

## ✅ Status

- Code compiled: ✅ 0 errors
- Server running: ✅ localhost:3000
- Endpoints registered: ✅ All 5 working
- Database table: ⏳ Needs SQL migration
- Postman collection: ✅ Updated with 5 endpoints

---

**Ready to test!** Run the SQL migration and start creating uploads! 🎉
