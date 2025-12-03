# How to Get Shopify Store Domain and Access Token

## 1. Get Your Shopify Store Domain

Your Shopify store domain is straightforward - it's the URL you use to access your Shopify admin panel.

### Steps:
1. Go to your Shopify Admin: `https://admin.shopify.com`
2. Sign in with your Shopify credentials
3. Your store domain will be in the format: `yourstore.myshopify.com`
   - Replace `yourstore` with your actual store name
   - Example: `loretana.myshopify.com`

You can also find it by looking at your browser URL when you're in the admin - it will be something like:
`https://admin.shopify.com/admin/store_name`

The store domain for our API would be: `store_name.myshopify.com`

---

## 2. Get Your Shopify Access Token

Access tokens are used to authenticate API requests. You need to create a custom app to generate an access token.

### Steps to Create a Custom App:

#### 2.1 Access the App Settings
1. Log in to your Shopify Admin: `https://admin.shopify.com`
2. From the admin sidebar, go to **Settings** (bottom left)
3. Click on **Apps and integrations**
4. Click on **Develop apps** (or **Apps** if it's your first time)

#### 2.2 Create a New App
1. Click the **Create an app** button
2. Enter an app name (e.g., "Loretana Backend API")
3. Click **Create app**

#### 2.3 Configure App Scopes
1. After creating the app, go to the **Configuration** tab
2. Under **Admin API access scopes**, find and enable the following scopes:
   - `read_orders` - To fetch order data
   - `read_customers` - To access customer information (if needed)
   - `read_products` - To access product data (if needed)
   - `write_orders` - If you want to update orders

3. Click **Save** after selecting the scopes

#### 2.4 Install the App
1. Click the **Install app** button
2. A popup will appear asking for confirmation - click **Install**

#### 2.5 Get Your Access Token
1. After installation, click on the **API credentials** tab
2. Under **Admin API access token**, you'll see:
   - A token that starts with `shpat_`
   - Click **Reveal token** to display the full token
3. Copy this token - this is your `accessToken`

⚠️ **Important**: Keep this token secure! Don't commit it to version control or expose it publicly.

---

## 3. Example API Usage

Once you have both values, you can use them with the Loretana Backend API:

### Get All Orders
```bash
curl "http://localhost:3000/shopify/orders?shopDomain=loretana.myshopify.com&accessToken=shpat_xxxxxxxxxxxxxxxxxxxxxxxx&limit=50&status=any"
```

### Get Order Count
```bash
curl "http://localhost:3000/shopify/count?shopDomain=loretana.myshopify.com&accessToken=shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
```

### Using in JavaScript/Frontend
```javascript
const shopDomain = 'loretana.myshopify.com';
const accessToken = 'shpat_xxxxxxxxxxxxxxxxxxxxxxxx';

// Get orders
const response = await fetch(
  `http://localhost:3000/shopify/orders?shopDomain=${shopDomain}&accessToken=${accessToken}&limit=50&status=paid`
);
const data = await response.json();
console.log(data);
```

---

## 4. Available Order Statuses

When filtering orders, you can use these status values:

| Status | Description |
|--------|-------------|
| `any` | All orders (default) |
| `authorized` | Payment authorized but not captured |
| `pending` | Order pending (incomplete payment) |
| `paid` | Order fully paid |
| `refunded` | Order refunded |
| `voided` | Payment voided |
| `partially_refunded` | Partially refunded orders |
| `partially_paid` | Partially paid orders |
| `unpaid` | Unpaid orders |

---

## 5. Response Format

### Sample Orders Response
```json
{
  "statusCode": 200,
  "success": true,
  "orders": [
    {
      "id": "gid://shopify/Order/1234567890",
      "order_number": 1001,
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:35:00Z",
      "customer": {
        "id": "gid://shopify/Customer/1234567890",
        "email": "customer@example.com",
        "first_name": "John",
        "last_name": "Doe"
      },
      "line_items": [
        {
          "id": "gid://shopify/LineItem/1234567890",
          "title": "Product Name",
          "quantity": 2,
          "price": "29.99"
        }
      ],
      "total_price": "59.98",
      "currency": "USD",
      "financial_status": "paid",
      "fulfillment_status": "fulfilled"
    }
  ],
  "total": 1,
  "message": "Successfully fetched 1 orders"
}
```

---

## 6. Troubleshooting

### Invalid Access Token
- Make sure you copied the entire token (starts with `shpat_`)
- Verify the token hasn't expired in Shopify Admin
- Recreate the token if necessary

### Store Not Found / 404 Error
- Double-check your store domain format: `storename.myshopify.com`
- Make sure you're using the correct store's credentials

### No Orders Returned
- Check the `status` filter - try with `status=any`
- Verify your store actually has orders in that status
- Check the `limit` parameter

### Permission Denied
- Ensure your custom app has the required scopes enabled
- Re-install the app after adding scopes

---

## 7. Security Best Practices

1. **Never hardcode tokens** - Store them in environment variables
2. **Use .env files** - Keep credentials in `.env` (never commit this file)
3. **Rotate tokens** - Periodically regenerate access tokens
4. **Limit scopes** - Only enable the minimum required scopes
5. **Use API rate limits** - Shopify allows 2 requests/second

### Example .env Setup
```
SHOPIFY_STORE_DOMAIN=loretana.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxx
```

Then use in your code:
```typescript
const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
```

---

## 8. Additional Resources

- [Shopify Admin API Documentation](https://shopify.dev/api/admin-rest)
- [Shopify App Development](https://shopify.dev/docs/apps/getting-started)
- [Shopify API Scopes](https://shopify.dev/api/admin-rest/2024-01#section-api-scopes)
