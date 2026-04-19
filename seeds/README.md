# Krushi Logic – Database Seeding Guide

This directory contains the database seeding script for the Krushi Logic Agro Marketplace backend.

---

## What Gets Seeded

| Collection           | Records | Description                                      |
|----------------------|---------|--------------------------------------------------|
| Users                | 5       | Supplier, Buyer, Farmer, Transporter, Admin      |
| UserAuth             | 5       | Auth records (password: `Password@123`)          |
| UserLocation         | 5       | One location per user                            |
| Roles                | 5       | SUPPLIER, BUYER, FARMER, TRANSPORTER, ADMIN      |
| Permissions          | 12      | Granular RBAC permissions                        |
| RolePermission       | ~20     | Role → permission mappings                       |
| UserRoles            | 5       | User → role assignments                          |
| UserPermissions      | 3       | User-level permission overrides (GRANT)          |
| SupplierProfiles     | 1       | Rajesh Agri Exports                              |
| BuyerProfiles        | 1       | Fresh Farms Pvt Ltd                              |
| FarmerProfiles       | 1       | 12.5-acre organic farm                           |
| TransporterProfiles  | 1       | Arvind Logistics                                 |
| Categories           | 5       | Grains, Fruits & Veg, Spices, Pulses, Dairy      |
| SubCategories        | 15      | 3 per category                                   |
| ProductMaster        | 10      | Standard commodity records with HS codes         |
| ProductListing       | 15      | Active/inactive listings with price & quantity   |
| ProductImages        | 10      | 2 images for the first 5 listings                |
| Leads                | 3       | Buyer-Seller leads                               |
| LeadInteractions     | 5       | VIEW, CALL, WHATSAPP interactions                |
| SubscriptionPlans    | 3       | Basic (₹499), Pro (₹1499), Enterprise (₹4999)   |
| UserSubscriptions    | 3       | Active subscriptions                             |
| Payments             | 4       | Mix of SUCCESS and PENDING                       |
| Notifications        | 5       | Alerts for all user types                        |
| Reviews              | 3       | Buyer→Supplier, Buyer→Farmer, Supplier→Buyer     |
| TransportRequests    | 2       | Accepted and pending transport jobs              |

---

## How to Run Seeding

### Prerequisites

- Node.js ≥ 16
- MongoDB running locally **or** a connection URI in `.env.seed`
- Dependencies installed: `npm install`

### Steps

```bash
# 1. Copy and adjust the seed environment file
cp .env.seed .env.seed.local
# Edit MONGODB_URI if needed – it defaults to krushi_logic_seed (separate from production)

# 2. Run the seeding script
npm run seed

# Or target a custom env file:
node scripts/run-seed.js /path/to/custom.env
```

The script will:
1. Connect to MongoDB
2. Drop all existing data in the target database
3. Insert all seed records in the correct dependency order
4. Print a summary of records created
5. Disconnect from MongoDB

> **⚠️ Warning:** The seeding script calls `deleteMany({})` on every collection before inserting new data. Always point `MONGODB_URI` at a **development or test** database, never production.

---

## Default Seed Credentials

All seeded users share the same password:

| Username          | Email                  | Role        |
|-------------------|------------------------|-------------|
| rajesh_supplier   | rajesh@example.com     | SUPPLIER    |
| priya_buyer       | priya@example.com      | BUYER       |
| suresh_farmer     | suresh@example.com     | FARMER      |
| arvind_transport  | arvind@example.com     | TRANSPORTER |
| admin_krushi      | admin@krushi.com       | ADMIN       |

**Password for all accounts:** `Password@123`

---

## Using the Postman Collection

The `postman-collection.json` file in the project root can be imported directly into Postman.

### Import Steps

1. Open **Postman**
2. Click **Import** → **Upload Files**
3. Select `postman-collection.json`
4. Click **Import**

### Environment Setup

After importing, create a Postman **Environment** (or use the embedded variables) with:

| Variable    | Initial Value             |
|-------------|---------------------------|
| `baseUrl`   | `http://localhost:3000`   |
| `authToken` | *(auto-set after login)*  |

### Sample Workflow

#### 1. Register / Login

```
POST {{baseUrl}}/api/auth/login
Body: { "email": "rajesh@example.com", "password": "Password@123" }
```

The collection's pre-request scripts automatically store the returned JWT in `authToken`.

#### 2. List Products

```
GET {{baseUrl}}/api/products
```

#### 3. Create a Lead

```
POST {{baseUrl}}/api/leads
Headers: Authorization: Bearer {{authToken}}
Body: {
  "sellerId": "<supplier_user_id>",
  "productId": "<listing_id>"
}
```

#### 4. Check Subscription Plans

```
GET {{baseUrl}}/api/subscriptions/plans
```

#### 5. Purchase a Subscription

```
POST {{baseUrl}}/api/subscriptions/purchase
Headers: Authorization: Bearer {{authToken}}
Body: {
  "planId": "<plan_id>",
  "paymentMode": "UPI"
}
```

---

## Folder Structure

```
seeds/
  seedDatabase.js   ← Core seeding logic (all models)
  README.md         ← This file

scripts/
  run-seed.js       ← CLI runner (loads env, connects, seeds, disconnects)

postman-collection.json   ← Importable Postman collection
.env.seed                 ← Seed-specific environment template
```
