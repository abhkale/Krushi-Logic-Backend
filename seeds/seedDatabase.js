'use strict';

const bcrypt = require('bcryptjs');

// ─── Models ──────────────────────────────────────────────────────────────────
const User = require('../models/User');
const UserAuth = require('../models/UserAuth');
const UserLocation = require('../models/UserLocation');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const RolePermission = require('../models/RolePermission');
const UserRoles = require('../models/UserRoles');
const UserPermissions = require('../models/UserPermissions');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const ProductMaster = require('../models/ProductMaster');
const ProductListing = require('../models/product');
const ProductImages = require('../models/ProductImages');
const Leads = require('../models/Leads');
const LeadInteractions = require('../models/LeadInteractions');
const SubscriptionPlans = require('../models/SubscriptionPlans');
const UserSubscriptions = require('../models/UserSubscriptions');
const Payments = require('../models/Payments');
const Notifications = require('../models/Notifications');
const Reviews = require('../models/Reviews');
const TransportRequests = require('../models/TransportRequests');
const SupplierProfiles = require('../models/SupplierProfiles');
const BuyerProfiles = require('../models/BuyerProfiles');
const FarmerProfiles = require('../models/FarmerProfiles');
const TransporterProfiles = require('../models/TransporterProfiles');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const log = (msg) => console.log(`[SEED] ${msg}`);

async function clearDatabase() {
    log('Clearing existing data…');
    const models = [
        TransportRequests, Reviews, Notifications, Payments,
        UserSubscriptions, SubscriptionPlans, LeadInteractions, Leads,
        ProductImages, ProductListing, ProductMaster, SubCategory, Category,
        UserPermissions, UserRoles, RolePermission, Permission, Role,
        SupplierProfiles, BuyerProfiles, FarmerProfiles, TransporterProfiles,
        UserLocation, UserAuth, User,
    ];
    for (const model of models) {
        await model.deleteMany({});
    }
    log('Database cleared.');
}

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seedDatabase() {
    await clearDatabase();

    // ── 1. Roles ──────────────────────────────────────────────────────────────
    log('Seeding roles…');
    const roleData = [
        { name: 'SUPPLIER', description: 'Can list and sell agricultural products' },
        { name: 'BUYER', description: 'Can browse and purchase products' },
        { name: 'FARMER', description: 'Producer/farmer who sells crops directly' },
        { name: 'TRANSPORTER', description: 'Provides logistics and transport services' },
        { name: 'ADMIN', description: 'Platform administrator with full access' },
    ];
    const roles = await Role.insertMany(roleData);
    const roleMap = Object.fromEntries(roles.map((r) => [r.name, r]));
    log(`Created ${roles.length} roles.`);

    // ── 2. Permissions ────────────────────────────────────────────────────────
    log('Seeding permissions…');
    const permissionData = [
        { name: 'VIEW_PRODUCTS', description: 'View all product listings' },
        { name: 'CREATE_PRODUCTS', description: 'Create new product listings' },
        { name: 'EDIT_PRODUCTS', description: 'Edit own product listings' },
        { name: 'DELETE_PRODUCTS', description: 'Delete own product listings' },
        { name: 'MANAGE_USERS', description: 'View and manage platform users' },
        { name: 'MANAGE_ROLES', description: 'Create and assign roles' },
        { name: 'VIEW_LEADS', description: 'View trade leads' },
        { name: 'CREATE_LEADS', description: 'Create new trade leads' },
        { name: 'VIEW_PAYMENTS', description: 'View payment records' },
        { name: 'MANAGE_PAYMENTS', description: 'Manage and verify payments' },
        { name: 'VIEW_TRANSPORT', description: 'View transport requests' },
        { name: 'CREATE_TRANSPORT', description: 'Create transport requests' },
    ];
    const permissions = await Permission.insertMany(permissionData);
    const permMap = Object.fromEntries(permissions.map((p) => [p.name, p]));
    log(`Created ${permissions.length} permissions.`);

    // ── 3. Role-Permission Mappings ───────────────────────────────────────────
    log('Seeding role-permission mappings…');
    const rolePermMappings = [
        // SUPPLIER
        { roleId: roleMap.SUPPLIER._id, permissionId: permMap.VIEW_PRODUCTS._id },
        { roleId: roleMap.SUPPLIER._id, permissionId: permMap.CREATE_PRODUCTS._id },
        { roleId: roleMap.SUPPLIER._id, permissionId: permMap.EDIT_PRODUCTS._id },
        { roleId: roleMap.SUPPLIER._id, permissionId: permMap.DELETE_PRODUCTS._id },
        { roleId: roleMap.SUPPLIER._id, permissionId: permMap.VIEW_LEADS._id },
        // BUYER
        { roleId: roleMap.BUYER._id, permissionId: permMap.VIEW_PRODUCTS._id },
        { roleId: roleMap.BUYER._id, permissionId: permMap.CREATE_LEADS._id },
        { roleId: roleMap.BUYER._id, permissionId: permMap.VIEW_LEADS._id },
        { roleId: roleMap.BUYER._id, permissionId: permMap.VIEW_PAYMENTS._id },
        // FARMER
        { roleId: roleMap.FARMER._id, permissionId: permMap.VIEW_PRODUCTS._id },
        { roleId: roleMap.FARMER._id, permissionId: permMap.CREATE_PRODUCTS._id },
        { roleId: roleMap.FARMER._id, permissionId: permMap.EDIT_PRODUCTS._id },
        { roleId: roleMap.FARMER._id, permissionId: permMap.VIEW_LEADS._id },
        // TRANSPORTER
        { roleId: roleMap.TRANSPORTER._id, permissionId: permMap.VIEW_TRANSPORT._id },
        { roleId: roleMap.TRANSPORTER._id, permissionId: permMap.CREATE_TRANSPORT._id },
        // ADMIN – gets everything
        ...permissions.map((p) => ({ roleId: roleMap.ADMIN._id, permissionId: p._id })),
    ];
    await RolePermission.insertMany(rolePermMappings);
    log(`Created ${rolePermMappings.length} role-permission mappings.`);

    // ── 4. Users ──────────────────────────────────────────────────────────────
    log('Seeding users…');
    const passwordHash = await bcrypt.hash('Password@123', 10);

    const usersData = [
        { username: 'rajesh_supplier', email: 'rajesh@example.com', phone: '9876543210', role: 'SUPPLIER', status: 'ACTIVE' },
        { username: 'priya_buyer', email: 'priya@example.com', phone: '9876543211', role: 'BUYER', status: 'ACTIVE' },
        { username: 'suresh_farmer', email: 'suresh@example.com', phone: '9876543212', role: 'FARMER', status: 'ACTIVE' },
        { username: 'arvind_transport', email: 'arvind@example.com', phone: '9876543213', role: 'TRANSPORTER', status: 'ACTIVE' },
        { username: 'admin_krushi', email: 'admin@krushi.com', phone: '9876543214', role: 'ADMIN', status: 'ACTIVE' },
    ];
    const users = await User.insertMany(usersData);
    const [supplier, buyer, farmer, transporter, admin] = users;
    log(`Created ${users.length} users.`);

    // UserAuth records
    const authRecords = users.map((u) => ({
        userId: u._id,
        passwordHash,
        isEmailVerified: true,
        isPhoneVerified: true,
        lastLoginAt: new Date(),
    }));
    await UserAuth.insertMany(authRecords);
    log('Created UserAuth records.');

    // ── 5. Locations ──────────────────────────────────────────────────────────
    log('Seeding locations…');
    const locationsData = [
        { userId: supplier._id, country: 'India', state: 'Maharashtra', district: 'Pune', city: 'Pune', pincode: '411001', latitude: 18.5204, longitude: 73.8567, type: 'BUSINESS' },
        { userId: buyer._id, country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', pincode: '560001', latitude: 12.9716, longitude: 77.5946, type: 'HOME' },
        { userId: farmer._id, country: 'India', state: 'Punjab', district: 'Ludhiana', city: 'Ludhiana', pincode: '141001', latitude: 30.9010, longitude: 75.8573, type: 'HOME' },
        { userId: transporter._id, country: 'India', state: 'Gujarat', district: 'Ahmedabad', city: 'Ahmedabad', pincode: '380001', latitude: 23.0225, longitude: 72.5714, type: 'BUSINESS' },
        { userId: admin._id, country: 'India', state: 'Delhi', district: 'New Delhi', city: 'New Delhi', pincode: '110001', latitude: 28.6139, longitude: 77.2090, type: 'HOME' },
    ];
    const locations = await UserLocation.insertMany(locationsData);
    const locMap = Object.fromEntries(locations.map((l) => [String(l.userId), l]));
    log(`Created ${locations.length} locations.`);

    // ── 6. User Roles ─────────────────────────────────────────────────────────
    log('Seeding user-role mappings…');
    const userRoleMappings = users.map((u) => ({
        userId: u._id,
        roleId: roleMap[u.role]._id,
    }));
    await UserRoles.insertMany(userRoleMappings);
    log('Created user-role mappings.');

    // ── 7. User Permissions (sample GRANT) ────────────────────────────────────
    log('Seeding user-permission overrides…');
    await UserPermissions.insertMany([
        { userId: supplier._id, permissionId: permMap.CREATE_PRODUCTS._id, type: 'GRANT' },
        { userId: buyer._id, permissionId: permMap.VIEW_PRODUCTS._id, type: 'GRANT' },
        { userId: farmer._id, permissionId: permMap.CREATE_PRODUCTS._id, type: 'GRANT' },
    ]);
    log('Created user-permission overrides.');

    // ── 8. Profiles ───────────────────────────────────────────────────────────
    log('Seeding profiles…');
    await SupplierProfiles.create({
        userId: supplier._id,
        businessName: 'Rajesh Agri Exports',
        estNumber: 'EST-2018-001',
        licenseNumber: 'LIC-AGR-2018',
        verificationStatus: 'VERIFIED',
        rating: 4.5,
    });
    await BuyerProfiles.create({
        userId: buyer._id,
        companyName: 'Fresh Farms Pvt Ltd',
        businessType: 'Wholesaler',
    });
    await FarmerProfiles.create({
        userId: farmer._id,
        farmSize: 12.5,
        cropTypes: ['Wheat', 'Rice', 'Maize'],
        organicCertified: true,
    });
    await TransporterProfiles.create({
        userId: transporter._id,
        companyName: 'Arvind Logistics',
        vehicleTypes: ['Truck', 'Mini-Truck'],
        capacity: 10000,
        ratePerKm: 25,
        availabilityStatus: true,
    });
    log('Created profiles.');

    // ── 9. Categories & SubCategories ─────────────────────────────────────────
    log('Seeding categories…');
    const categoriesData = [
        { name: 'Grains & Cereals', description: 'Wheat, rice, maize, millets and other grains' },
        { name: 'Fruits & Vegetables', description: 'Fresh produce including all fruits and vegetables' },
        { name: 'Spices & Condiments', description: 'All types of spices, herbs and condiments' },
        { name: 'Pulses & Legumes', description: 'Lentils, chickpeas, beans and other legumes' },
        { name: 'Dairy & Poultry', description: 'Milk products, eggs and poultry items' },
    ];
    const categories = await Category.insertMany(categoriesData);
    const [catGrains, catFruits, catSpices, catPulses, catDairy] = categories;
    log(`Created ${categories.length} categories.`);

    const subCategoriesData = [
        // Grains
        { categoryId: catGrains._id, name: 'Wheat', description: 'All wheat varieties' },
        { categoryId: catGrains._id, name: 'Rice', description: 'Basmati, Sona Masoori, etc.' },
        { categoryId: catGrains._id, name: 'Maize / Corn', description: 'Yellow and white maize' },
        // Fruits & Vegetables
        { categoryId: catFruits._id, name: 'Tomatoes', description: 'Fresh tomatoes' },
        { categoryId: catFruits._id, name: 'Onions', description: 'Red and white onions' },
        { categoryId: catFruits._id, name: 'Mangoes', description: 'Alphonso, Kesar and other mango varieties' },
        // Spices
        { categoryId: catSpices._id, name: 'Turmeric', description: 'Finger and bulb turmeric' },
        { categoryId: catSpices._id, name: 'Chillies', description: 'Dried red chillies' },
        { categoryId: catSpices._id, name: 'Cumin', description: 'Whole and powder cumin' },
        // Pulses
        { categoryId: catPulses._id, name: 'Chickpeas', description: 'Kabuli and desi chickpeas' },
        { categoryId: catPulses._id, name: 'Lentils', description: 'Red, green and black lentils' },
        { categoryId: catPulses._id, name: 'Moong Dal', description: 'Split green gram' },
        // Dairy
        { categoryId: catDairy._id, name: 'Milk', description: 'Fresh and processed milk' },
        { categoryId: catDairy._id, name: 'Ghee', description: 'Pure cow ghee' },
        { categoryId: catDairy._id, name: 'Paneer', description: 'Cottage cheese' },
    ];
    const subCategories = await SubCategory.insertMany(subCategoriesData);
    log(`Created ${subCategories.length} sub-categories.`);

    // ── 10. Product Masters ───────────────────────────────────────────────────
    log('Seeding product master records…');
    const subMap = Object.fromEntries(subCategories.map((s) => [s.name, s]));
    const productMasterData = [
        { name: 'Wheat (Sharbati)', categoryId: catGrains._id, subCategoryId: subMap['Wheat']._id, hsCode: '1001.99', description: 'Premium Sharbati wheat from MP' },
        { name: 'Basmati Rice (1121)', categoryId: catGrains._id, subCategoryId: subMap['Rice']._id, hsCode: '1006.30', description: 'Long grain 1121 basmati rice' },
        { name: 'Yellow Maize', categoryId: catGrains._id, subCategoryId: subMap['Maize / Corn']._id, hsCode: '1005.90', description: 'Feed-grade yellow maize' },
        { name: 'Tomatoes (Hybrid)', categoryId: catFruits._id, subCategoryId: subMap['Tomatoes']._id, hsCode: '0702.00', description: 'Hybrid tomato variety' },
        { name: 'Red Onion', categoryId: catFruits._id, subCategoryId: subMap['Onions']._id, hsCode: '0703.10', description: 'Medium-sized red onion' },
        { name: 'Alphonso Mango', categoryId: catFruits._id, subCategoryId: subMap['Mangoes']._id, hsCode: '0804.50', description: 'GI-tagged Alphonso mango' },
        { name: 'Turmeric Finger', categoryId: catSpices._id, subCategoryId: subMap['Turmeric']._id, hsCode: '0910.30', description: 'Polished turmeric fingers' },
        { name: 'Kabuli Chana', categoryId: catPulses._id, subCategoryId: subMap['Chickpeas']._id, hsCode: '0713.20', description: 'Large kabuli chickpeas' },
        { name: 'Masoor Dal', categoryId: catPulses._id, subCategoryId: subMap['Lentils']._id, hsCode: '0713.40', description: 'Split red lentils' },
        { name: 'Pure Cow Ghee', categoryId: catDairy._id, subCategoryId: subMap['Ghee']._id, hsCode: '0405.10', description: 'Traditional bilona method ghee' },
    ];
    const productMasters = await ProductMaster.insertMany(productMasterData);
    log(`Created ${productMasters.length} product master records.`);

    // ── 11. Product Listings ──────────────────────────────────────────────────
    log('Seeding product listings…');
    const supplierLoc = locMap[String(supplier._id)];
    const farmerLoc = locMap[String(farmer._id)];

    const listingExpiresAt = new Date();
    listingExpiresAt.setDate(listingExpiresAt.getDate() + 30);

    const listingsData = [
        { title: 'Fresh Sharbati Wheat – 100 MT', productMasterId: productMasters[0]._id, sellerId: supplier._id, categoryId: catGrains._id, subCategoryId: subMap['Wheat']._id, price: 2200, quantity: 100000, unit: 'kg', locationId: supplierLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Basmati Rice 1121 – 50 MT', productMasterId: productMasters[1]._id, sellerId: supplier._id, categoryId: catGrains._id, subCategoryId: subMap['Rice']._id, price: 7500, quantity: 50000, unit: 'kg', locationId: supplierLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Yellow Maize – 200 MT', productMasterId: productMasters[2]._id, sellerId: farmer._id, categoryId: catGrains._id, subCategoryId: subMap['Maize / Corn']._id, price: 1800, quantity: 200000, unit: 'kg', locationId: farmerLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Hybrid Tomato – 5 MT', productMasterId: productMasters[3]._id, sellerId: farmer._id, categoryId: catFruits._id, subCategoryId: subMap['Tomatoes']._id, price: 1500, quantity: 5000, unit: 'kg', locationId: farmerLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Red Onion – 20 MT', productMasterId: productMasters[4]._id, sellerId: supplier._id, categoryId: catFruits._id, subCategoryId: subMap['Onions']._id, price: 1200, quantity: 20000, unit: 'kg', locationId: supplierLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Alphonso Mango Box (12 pcs)', productMasterId: productMasters[5]._id, sellerId: farmer._id, categoryId: catFruits._id, subCategoryId: subMap['Mangoes']._id, price: 650, quantity: 2000, unit: 'box', locationId: farmerLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Turmeric Finger – 10 MT', productMasterId: productMasters[6]._id, sellerId: supplier._id, categoryId: catSpices._id, subCategoryId: subMap['Turmeric']._id, price: 9500, quantity: 10000, unit: 'kg', locationId: supplierLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Kabuli Chana – 25 MT', productMasterId: productMasters[7]._id, sellerId: supplier._id, categoryId: catPulses._id, subCategoryId: subMap['Chickpeas']._id, price: 6800, quantity: 25000, unit: 'kg', locationId: supplierLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Masoor Dal – 15 MT', productMasterId: productMasters[8]._id, sellerId: farmer._id, categoryId: catPulses._id, subCategoryId: subMap['Lentils']._id, price: 5500, quantity: 15000, unit: 'kg', locationId: farmerLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Pure Cow Ghee – 500 kg', productMasterId: productMasters[9]._id, sellerId: supplier._id, categoryId: catDairy._id, subCategoryId: subMap['Ghee']._id, price: 850, quantity: 500, unit: 'kg', locationId: supplierLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Organic Wheat Flour – 5 MT', productMasterId: productMasters[0]._id, sellerId: farmer._id, categoryId: catGrains._id, subCategoryId: subMap['Wheat']._id, price: 3200, quantity: 5000, unit: 'kg', locationId: farmerLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Sona Masoori Rice – 30 MT', productMasterId: productMasters[1]._id, sellerId: supplier._id, categoryId: catGrains._id, subCategoryId: subMap['Rice']._id, price: 5200, quantity: 30000, unit: 'kg', locationId: supplierLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Green Chillies – 2 MT', productMasterId: productMasters[6]._id, sellerId: farmer._id, categoryId: catSpices._id, subCategoryId: subMap['Chillies']._id, price: 4500, quantity: 2000, unit: 'kg', locationId: farmerLoc._id, status: 'INACTIVE', expiresAt: listingExpiresAt },
        { title: 'Paneer – 200 kg', sellerId: supplier._id, categoryId: catDairy._id, subCategoryId: subMap['Paneer']._id, price: 320, quantity: 200, unit: 'kg', locationId: supplierLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
        { title: 'Moong Dal – 8 MT', sellerId: farmer._id, categoryId: catPulses._id, subCategoryId: subMap['Moong Dal']._id, price: 7200, quantity: 8000, unit: 'kg', locationId: farmerLoc._id, status: 'ACTIVE', expiresAt: listingExpiresAt },
    ];
    const listings = await ProductListing.insertMany(listingsData);
    log(`Created ${listings.length} product listings.`);

    // ── 12. Product Images ────────────────────────────────────────────────────
    log('Seeding product images…');
    const imageData = listings.slice(0, 5).flatMap((l, i) => [
        { productListingId: l._id, imageUrl: `https://cdn.krushi.io/products/${l._id}/image-1.jpg`, isPrimary: true },
        { productListingId: l._id, imageUrl: `https://cdn.krushi.io/products/${l._id}/image-2.jpg`, isPrimary: false },
    ]);
    await ProductImages.insertMany(imageData);
    log(`Created ${imageData.length} product images.`);

    // ── 13. Leads & Interactions ──────────────────────────────────────────────
    log('Seeding leads…');
    const leadsData = [
        { buyerId: buyer._id, sellerId: supplier._id, productId: listings[0]._id, isContactViewed: true, contactSharedAt: new Date() },
        { buyerId: buyer._id, sellerId: farmer._id, productId: listings[2]._id, isContactViewed: false },
        { buyerId: buyer._id, sellerId: supplier._id, productId: listings[4]._id, isContactViewed: false },
    ];
    const leads = await Leads.insertMany(leadsData);
    log(`Created ${leads.length} leads.`);

    const interactionsData = [
        { leadId: leads[0]._id, type: 'VIEW' },
        { leadId: leads[0]._id, type: 'CALL' },
        { leadId: leads[0]._id, type: 'WHATSAPP' },
        { leadId: leads[1]._id, type: 'VIEW' },
        { leadId: leads[2]._id, type: 'VIEW' },
    ];
    await LeadInteractions.insertMany(interactionsData);
    log(`Created ${interactionsData.length} lead interactions.`);

    // ── 14. Subscription Plans ────────────────────────────────────────────────
    log('Seeding subscription plans…');
    const plansData = [
        { name: 'Basic', price: 499, durationDays: 30, leadLimit: 20, features: ['20 lead contacts/month', 'Basic search', 'Email support'], status: 'ACTIVE' },
        { name: 'Pro', price: 1499, durationDays: 30, leadLimit: 100, features: ['100 lead contacts/month', 'Priority listing', 'Phone & email support', 'Analytics dashboard'], status: 'ACTIVE' },
        { name: 'Enterprise', price: 4999, durationDays: 90, leadLimit: 500, features: ['500 lead contacts/quarter', 'Featured listing', 'Dedicated account manager', 'Advanced analytics', 'API access'], status: 'ACTIVE' },
    ];
    const plans = await SubscriptionPlans.insertMany(plansData);
    const [basicPlan, proPlan] = plans;
    log(`Created ${plans.length} subscription plans.`);

    // ── 15. User Subscriptions ────────────────────────────────────────────────
    log('Seeding user subscriptions…');
    const now = new Date();
    const subEnd = new Date(now);
    subEnd.setDate(subEnd.getDate() + 30);

    const subscriptionsData = [
        { userId: supplier._id, planId: proPlan._id, startDate: now, endDate: subEnd, status: 'ACTIVE', leadsUsed: 5 },
        { userId: buyer._id, planId: basicPlan._id, startDate: now, endDate: subEnd, status: 'ACTIVE', leadsUsed: 2 },
        { userId: farmer._id, planId: basicPlan._id, startDate: now, endDate: subEnd, status: 'ACTIVE', leadsUsed: 0 },
    ];
    const subscriptions = await UserSubscriptions.insertMany(subscriptionsData);
    log(`Created ${subscriptions.length} user subscriptions.`);

    // ── 16. Payments ──────────────────────────────────────────────────────────
    log('Seeding payments…');
    const paymentsData = [
        { userId: supplier._id, planId: proPlan._id, amount: 1499, paymentMode: 'UPI', paymentStatus: 'SUCCESS', transactionId: 'TXN20240101001' },
        { userId: buyer._id, planId: basicPlan._id, amount: 499, paymentMode: 'NET_BANKING', paymentStatus: 'SUCCESS', transactionId: 'TXN20240101002' },
        { userId: farmer._id, planId: basicPlan._id, amount: 499, paymentMode: 'CARD', paymentStatus: 'SUCCESS', transactionId: 'TXN20240101003' },
        { userId: buyer._id, planId: proPlan._id, amount: 1499, paymentMode: 'UPI', paymentStatus: 'PENDING', transactionId: 'TXN20240101004' },
    ];
    await Payments.insertMany(paymentsData);
    log(`Created ${paymentsData.length} payments.`);

    // ── 17. Notifications ─────────────────────────────────────────────────────
    log('Seeding notifications…');
    const notifData = [
        { userId: supplier._id, title: 'New Lead Received', message: 'A buyer is interested in your Wheat listing.', type: 'LEAD_SYSTEM', isRead: false },
        { userId: buyer._id, title: 'Subscription Activated', message: 'Your Basic Plan has been activated successfully.', type: 'PAYMENT', isRead: true },
        { userId: farmer._id, title: 'Listing Expiring Soon', message: 'Your "Yellow Maize" listing expires in 5 days.', type: 'PRODUCT_ALERT', isRead: false },
        { userId: transporter._id, title: 'New Transport Request', message: 'A new transport request has been raised for Pune → Bengaluru.', type: 'GENERAL', isRead: false },
        { userId: supplier._id, title: 'Payment Successful', message: 'Your Pro Plan payment of ₹1,499 was successful.', type: 'PAYMENT', isRead: true },
    ];
    await Notifications.insertMany(notifData);
    log(`Created ${notifData.length} notifications.`);

    // ── 18. Reviews ───────────────────────────────────────────────────────────
    log('Seeding reviews…');
    const reviewsData = [
        { reviewerId: buyer._id, reviewedUserId: supplier._id, productId: listings[0]._id, rating: 5, comment: 'Excellent quality wheat, delivered on time. Highly recommended!' },
        { reviewerId: buyer._id, reviewedUserId: farmer._id, productId: listings[2]._id, rating: 4, comment: 'Good quality maize, slight delay in delivery but overall satisfied.' },
        { reviewerId: supplier._id, reviewedUserId: buyer._id, rating: 5, comment: 'Smooth transaction, payment received quickly. Great buyer!' },
    ];
    await Reviews.insertMany(reviewsData);
    log(`Created ${reviewsData.length} reviews.`);

    // ── 19. Transport Requests ────────────────────────────────────────────────
    log('Seeding transport requests…');
    const buyerLoc = locMap[String(buyer._id)];
    const transportData = [
        { buyerId: buyer._id, sellerId: supplier._id, productId: listings[0]._id, transporterId: transporter._id, sourceLocationId: supplierLoc._id, destinationLocationId: buyerLoc._id, expectedPrice: 15000, status: 'ACCEPTED' },
        { buyerId: buyer._id, sellerId: farmer._id, productId: listings[2]._id, sourceLocationId: farmerLoc._id, destinationLocationId: buyerLoc._id, expectedPrice: 22000, status: 'PENDING' },
    ];
    await TransportRequests.insertMany(transportData);
    log(`Created ${transportData.length} transport requests.`);

    // ── Done ──────────────────────────────────────────────────────────────────
    log('');
    log('✅  Database seeded successfully!');
    log('');
    log('Summary:');
    log(`  Users              : ${users.length}`);
    log(`  Roles              : ${roles.length}`);
    log(`  Permissions        : ${permissions.length}`);
    log(`  Categories         : ${categories.length}`);
    log(`  Sub-categories     : ${subCategories.length}`);
    log(`  Product Masters    : ${productMasters.length}`);
    log(`  Product Listings   : ${listings.length}`);
    log(`  Leads              : ${leads.length}`);
    log(`  Subscription Plans : ${plans.length}`);
    log(`  Subscriptions      : ${subscriptions.length}`);
    log(`  Payments           : ${paymentsData.length}`);
    log(`  Notifications      : ${notifData.length}`);
    log(`  Reviews            : ${reviewsData.length}`);
    log(`  Transport Requests : ${transportData.length}`);
}

module.exports = seedDatabase;
