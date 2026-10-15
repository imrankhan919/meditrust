import axios from "axios";

const readToken = () => {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw)?.token : null;
    } catch {
        return null;
    }
};

const authHeaders = (isMultipart = false) => {
    const token = readToken();
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (!isMultipart) headers["Content-Type"] = "application/json";
    return { headers };
};

export const PRESCRIPTION_LIMIT_BYTES = 5 * 1024 * 1024;
export const PRESCRIPTION_ACCEPT = ["image/jpeg", "image/png", "image/webp"];

const uploadScan = async (file, onProgress) => {
    const formData = new FormData();
    formData.append("prescription", file);
    const token = readToken();
    const response = await axios.post("/api/prescriptions/upload-scan", formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        onUploadProgress: (event) => {
            if (onProgress && event.total) {
                onProgress(Math.round((event.loaded * 100) / event.total));
            }
        },
    });
    return response.data;
};

const listPrescriptions = async () => {
    const response = await axios.get("/api/prescriptions", authHeaders());
    return response.data;
};

const getScanStatus = async () => {
    const response = await axios.get("/api/prescriptions/scan-status", authHeaders());
    return response.data;
};

const getPrescription = async (id) => {
    const response = await axios.get(`/api/prescriptions/${id}`, authHeaders());
    return response.data;
};

const updatePrescription = async (id, payload) => {
    const response = await axios.patch(`/api/prescriptions/${id}`, payload, authHeaders());
    return response.data;
};

const confirmPrescription = async (id, payload = {}) => {
    const response = await axios.patch(
        `/api/prescriptions/${id}`,
        { ...payload, confirm: true },
        authHeaders()
    );
    return response.data;
};

const deletePrescription = async (id) => {
    const response = await axios.delete(`/api/prescriptions/${id}`, authHeaders());
    return response.data;
};

const getPrescriptionImage = async (id) => {
    const response = await axios.get(`/api/prescriptions/${id}/image`, authHeaders());
    return response.data;
};

const getPrescriptionMatches = async (id) => {
    const response = await axios.get(`/api/prescriptions/${id}/matches`, authHeaders());
    return response.data;
};

const prescriptionService = {
    uploadScan,
    listPrescriptions,
    getScanStatus,
    getPrescription,
    updatePrescription,
    confirmPrescription,
    deletePrescription,
    getPrescriptionImage,
    getPrescriptionMatches,
};

export default prescriptionService;
