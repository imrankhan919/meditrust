import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./server/models/userModel.js";
import Pathologist from "./server/models/pathologistModel.js";
import Product from "./server/models/productModel.js";



dotenv.config();


// =====================================================
// USERS
// =====================================================

const users = [
    // =========================
    // PATIENTS / USERS
    // =========================

    {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "9876543210",
        password: "Password@123",
        age: 24,
        gender: "male",
        address: "Vijay Nagar, Indore",
        userType: "USER",
        isActive: true
    },

    {
        name: "Priya Verma",
        email: "priya@example.com",
        phone: "9876543211",
        password: "Password@123",
        age: 27,
        gender: "female",
        address: "Palasia, Indore",
        userType: "USER",
        isActive: true
    },

    {
        name: "Aman Jain",
        email: "aman@example.com",
        phone: "9876543212",
        password: "Password@123",
        age: 31,
        gender: "male",
        address: "Bhawarkua, Indore",
        userType: "USER",
        isActive: true
    },

    {
        name: "Sneha Patel",
        email: "sneha@example.com",
        phone: "9876543213",
        password: "Password@123",
        age: 22,
        gender: "female",
        address: "Rau, Indore",
        userType: "USER",
        isActive: true
    },


    // =========================
    // DOCTORS
    // =========================

    {
        name: "Dr. Amit Verma",
        email: "amit.doctor@example.com",
        phone: "9876543220",
        password: "Doctor@123",
        age: 42,
        gender: "male",
        address: "Vijay Nagar, Indore",
        userType: "DOCTOR",
        isActive: true
    },

    {
        name: "Dr. Neha Sharma",
        email: "neha.doctor@example.com",
        phone: "9876543221",
        password: "Doctor@123",
        age: 38,
        gender: "female",
        address: "Scheme No. 54, Indore",
        userType: "DOCTOR",
        isActive: true
    },


    // =========================
    // PATHOLOGISTS
    // =========================

    {
        name: "Dr. Anjali Mehta",
        email: "anjali.path@example.com",
        phone: "9876543230",
        password: "Path@123",
        age: 36,
        gender: "female",
        address: "MG Road, Indore",
        userType: "PATHOLOGIST",
        isActive: true
    },

    {
        name: "Dr. Vikram Singh",
        email: "vikram.path@example.com",
        phone: "9876543231",
        password: "Path@123",
        age: 44,
        gender: "male",
        address: "Rau, Indore",
        userType: "PATHOLOGIST",
        isActive: true
    },


    // =========================
    // ADMIN
    // =========================

    {
        name: "Super Admin",
        email: "admin@example.com",
        phone: "9876543240",
        password: "Admin@123",
        age: 35,
        gender: "male",
        address: "Indore, Madhya Pradesh",
        userType: "ADMIN",
        isActive: true
    }
];


// =====================================================
// PATHOLOGIST PROFILES
// =====================================================

const pathologistProfiles = [
    {
        email: "anjali.path@example.com",

        laboratoryName: "HealthCare Diagnostics",

        laboratoryAddress: "MG Road, Indore",

        qualification: "MD Pathology",

        registrationNumber: "MP-PATH-10234",

        experience: 8,

        specialization: [
            "Clinical Pathology",
            "Hematology",
            "Biochemistry"
        ],

        consultationFee: 500,

        workingHours: {
            start: "09:00",
            end: "18:00"
        },

        availableDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],

        isVerified: true,

        isActive: true
    },

    {
        email: "vikram.path@example.com",

        laboratoryName: "Apollo Diagnostic Center",

        laboratoryAddress: "Rau, Indore",

        qualification: "MD Pathology",

        registrationNumber: "MP-PATH-10235",

        experience: 12,

        specialization: [
            "Histopathology",
            "Cytology",
            "Clinical Pathology"
        ],

        consultationFee: 700,

        workingHours: {
            start: "10:00",
            end: "19:00"
        },

        availableDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
        ],

        isVerified: true,

        isActive: true
    }
];


// =====================================================
// PRODUCTS
// =====================================================

const products = [

    {
        name: "Paracetamol 500mg",

        description:
            "Used for temporary relief from fever and mild to moderate pain.",

        price: 25,

        stock: 150,

        expiresOn: "2027-12-31",

        image:
            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",

        isActive: true
    },

    {
        name: "Vitamin C Tablets",

        description:
            "Vitamin C supplement supporting normal immune system function.",

        price: 180,

        stock: 80,

        expiresOn: "2028-06-30",

        image:
            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108",

        isActive: true
    },

    {
        name: "Digital Thermometer",

        description:
            "Fast and accurate digital thermometer for measuring body temperature.",

        price: 299,

        stock: 45,

        expiresOn: "2030-01-01",

        image:
            "https://images.unsplash.com/photo-1584634731339-252c581abfc5",

        isActive: true
    },

    {
        name: "Hand Sanitizer",

        description:
            "Alcohol-based hand sanitizer for everyday hand hygiene.",

        price: 120,

        stock: 200,

        expiresOn: "2027-08-15",

        image:
            "https://images.unsplash.com/photo-1584483766114-2cea6facdf57",

        isActive: true
    },

    {
        name: "First Aid Kit",

        description:
            "Compact first aid kit containing essential medical supplies.",

        price: 599,

        stock: 30,

        expiresOn: "2029-03-20",

        image:
            "https://images.unsplash.com/photo-1603398938378-e54eab446dde",

        isActive: true
    },

    {
        name: "Face Masks",

        description:
            "Disposable protective face masks suitable for everyday use.",

        price: 150,

        stock: 500,

        expiresOn: "2029-10-10",

        image:
            "https://images.unsplash.com/photo-1584634731339-252c581abfc5",

        isActive: true
    },

    {
        name: "Antiseptic Liquid",

        description:
            "Antiseptic solution for cleaning minor cuts and wounds.",

        price: 95,

        stock: 120,

        expiresOn: "2028-11-25",

        image:
            "https://images.unsplash.com/photo-1603398938378-e54eab446dde",

        isActive: true
    },

    {
        name: "ORS Electrolyte Powder",

        description:
            "Electrolyte powder used to help replenish fluids and salts.",

        price: 20,

        stock: 300,

        expiresOn: "2027-09-30",

        image:
            "https://images.unsplash.com/photo-1550572017-edd951b55104",

        isActive: true
    },

    {
        name: "Pain Relief Balm",

        description:
            "Topical balm for temporary relief of minor muscle and joint discomfort.",

        price: 75,

        stock: 90,

        expiresOn: "2028-04-18",

        image:
            "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8",

        isActive: true
    },

    {
        name: "Blood Pressure Monitor",

        description:
            "Digital blood pressure monitor designed for convenient home monitoring.",

        price: 1499,

        stock: 25,

        expiresOn: "2030-12-31",

        image:
            "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",

        isActive: true
    }
];


// =====================================================
// SEED DATABASE
// =====================================================

const seedDatabase = async () => {

    try {

        // -----------------------------------------------
        // CONNECT
        // -----------------------------------------------

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");


        // -----------------------------------------------
        // CLEAR DATABASE
        // -----------------------------------------------

        await User.deleteMany({});
        await Product.deleteMany({});
        await Pathologist.deleteMany({});

        console.log("🗑️ Existing data cleared");


        // -----------------------------------------------
        // HASH PASSWORDS
        // -----------------------------------------------

        const hashedUsers = await Promise.all(

            users.map(async (user) => {

                const hashedPassword =
                    await bcrypt.hash(user.password, 10);

                return {
                    ...user,
                    password: hashedPassword
                };

            })

        );


        // -----------------------------------------------
        // CREATE USERS
        // -----------------------------------------------

        const createdUsers =
            await User.insertMany(hashedUsers);

        console.log(
            `👤 ${createdUsers.length} users created`
        );


        // -----------------------------------------------
        // CREATE PATHOLOGIST PROFILES
        // -----------------------------------------------

        const pathologists = pathologistProfiles.map(
            (profile) => {

                const user = createdUsers.find(
                    (user) =>
                        user.email === profile.email
                );

                if (!user) {
                    throw new Error(
                        `User not found for ${profile.email}`
                    );
                }

                const {
                    email,
                    ...pathologistData
                } = profile;

                return {
                    ...pathologistData,
                    user: user._id
                };

            }
        );


        const createdPathologists =
            await Pathologist.insertMany(pathologists);

        console.log(
            `🔬 ${createdPathologists.length} pathologists created`
        );


        // -----------------------------------------------
        // CREATE PRODUCTS
        // -----------------------------------------------

        const createdProducts =
            await Product.insertMany(products);

        console.log(
            `💊 ${createdProducts.length} products created`
        );


        // -----------------------------------------------
        // SUMMARY
        // -----------------------------------------------

        console.log("\n================================");
        console.log("       SEEDING COMPLETED 🚀");
        console.log("================================");

        console.log(
            `👤 Users        : ${createdUsers.length}`
        );

        console.log(
            `🔬 Pathologists : ${createdPathologists.length}`
        );

        console.log(
            `💊 Products     : ${createdProducts.length}`
        );


        // -----------------------------------------------
        // LOGIN DETAILS
        // -----------------------------------------------

        console.log("\n🔐 LOGIN CREDENTIALS");

        console.log("\nAdmin:");
        console.log("Email    : admin@example.com");
        console.log("Password : Admin@123");

        console.log("\nDoctor:");
        console.log("Email    : amit.doctor@example.com");
        console.log("Password : Doctor@123");

        console.log("\nPatient:");
        console.log("Email    : rahul@example.com");
        console.log("Password : Password@123");

        console.log("\nPathologist:");
        console.log("Email    : anjali.path@example.com");
        console.log("Password : Path@123");


        // -----------------------------------------------
        // CLOSE CONNECTION
        // -----------------------------------------------

        await mongoose.connection.close();

        console.log("\n✅ Database connection closed");

        process.exit(0);

    } catch (error) {

        console.error("\n❌ SEEDING FAILED");
        console.error(error);

        await mongoose.connection.close();

        process.exit(1);
    }
};


// =====================================================
// RUN
// =====================================================

seedDatabase();