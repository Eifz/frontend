// ═══════════════════════════════════════════════════════════════
// services/api.ts
// ไฟล์กำหนดค่า Axios HTTP Client สำหรับเชื่อมต่อกับ Backend API
// ═══════════════════════════════════════════════════════════════

import axios from 'axios'

// สร้าง axios instance พร้อม config ตั้งต้น
// ทุกการเรียก api.get / api.post จะใช้ baseURL นี้โดยอัตโนมัติ
// ทำให้ไม่ต้องพิมพ์ http://localhost:5000/api ซ้ำทุกครั้ง
const getBaseURL = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        return `http://${hostname}:8080/api/diy`;
    }
    return 'http://localhost:8080/api/diy';
};

const api = axios.create({
    baseURL: getBaseURL(),
})

export const loginApi = async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
};

export const registerApi = async (data: any) => {
    const response = await api.post('/register', data);
    return response.data;
};

export const getMaterialTypes = async () => {
    const response = await api.get('/material/types');
    return response.data;
};

export const getMaterialsList = async (memberId: number) => {
    const response = await api.get(`/material/list?memberId=${memberId}`);
    return response.data;
};

export const addMaterial = async (formData: FormData) => {
    const response = await api.post('/material/add', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const editMaterial = async (formData: FormData) => {
    const response = await api.post('/material/edit', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const deleteMaterial = async (materialId: number) => {
    const response = await api.post(`/material/delete?materialId=${materialId}`);
    return response.data;
};

export default api
