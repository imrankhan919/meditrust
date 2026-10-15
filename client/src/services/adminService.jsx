import axios from "axios";

const authHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

/**
 * Admin API client.
 * All endpoints below are enforced server-side by protect.forAdmin.
 * NOTE (known backend limitation): there is no PUT/DELETE /api/admin/users/:id
 * endpoint, so role changes and deletes are intentionally NOT implemented here.
 * Doctor/pathologist verification endpoints promote userType server-side.
 */

const fetchUsers = async (token) => {
    const response = await axios.get("/api/admin/users", authHeaders(token));
    return response.data;
};

const fetchProducts = async (token) => {
    const response = await axios.get("/api/admin/products", authHeaders(token));
    return response.data;
};

const fetchDoctors = async (token) => {
    const response = await axios.get("/api/admin/doctors", authHeaders(token));
    return response.data;
};

const fetchPathologists = async (token) => {
    const response = await axios.get("/api/admin/pathologists", authHeaders(token));
    return response.data;
};

const fetchOrders = async (token) => {
    const response = await axios.get("/api/admin/orders", authHeaders(token));
    return response.data;
};

const fetchAllAdminData = async (token) => {
    const [users, products, doctors, pathologists, orders] = await Promise.all([
        fetchUsers(token),
        fetchProducts(token),
        fetchDoctors(token),
        fetchPathologists(token),
        fetchOrders(token),
    ]);

    return { users, products, doctors, pathologists, orders };
};

const createProduct = async (productData, token) => {
    const response = await axios.post("/api/admin/product", productData, authHeaders(token));
    return response.data;
};

const updateDoctorVerification = async ({ id, isVerified }, token) => {
    const response = await axios.put(
        `/api/admin/doctor/${id}`,
        { isVerified },
        authHeaders(token)
    );
    return response.data;
};

const updatePathologistVerification = async ({ id, isVerified }, token) => {
    const response = await axios.put(
        `/api/admin/pathologists/${id}`,
        { isVerified },
        authHeaders(token)
    );
    return response.data;
};

const updateProduct = async ({ id, payload }, token) => {
    const response = await axios.put(`/api/admin/product/${id}`, payload, authHeaders(token));
    return response.data;
};

const adminService = {
    fetchUsers,
    fetchProducts,
    fetchDoctors,
    fetchPathologists,
    fetchOrders,
    fetchAllAdminData,
    createProduct,
    updateProduct,
    updateDoctorVerification,
    updatePathologistVerification,
};

export default adminService;
