import axios from "axios";

const API_BASE = "http://localhost:5000/api/floors";

export async function saveFloorPlan(data) {
  try {
    const res = await axios.post(`${API_BASE}/save`, data);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("saveFloorPlan error:", err);
    return { success: false, message: err.response?.data?.message || err.message };
  }
}

export async function getFloorPlans() {
  try {
    const res = await axios.get(API_BASE);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("getFloorPlans error:", err);
    return { success: false, message: err.response?.data?.message || err.message };
  }
}

export async function getFloorPlanById(id) {
  try {
    const res = await axios.get(`${API_BASE}/${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("getFloorPlanById error:", err);
    return { success: false, message: err.response?.data?.message || err.message };
  }
}
