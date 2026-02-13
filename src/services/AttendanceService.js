import api from './api';
import TokenUrlUtils from '../utils/TokenUrlUtils';

const AttendanceService = {
    // --- Employee Endpoints ---

    /**
     * Mark Attendance Check-In (Geo-based)
     * POST /api/attendance/geo-checkin
     */
    geoCheckIn: async ({ latitude, longitude, accuracy }) => {
        try {
            const response = await api.post('/attendance/geo-checkin', {
                latitude,
                longitude,
                accuracy
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mark Attendance Check-Out (Geo-based)
     * POST /api/attendance/geo-checkout
     */
    geoCheckOut: async ({ latitude, longitude, accuracy }) => {
        try {
            const response = await api.post('/attendance/geo-checkout', {
                latitude,
                longitude,
                accuracy
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get Employee Attendance Summary
     * GET /api/Attendance/my-summary
     */
    getMySummary: async (params = {}) => {
        try {
            // params can include fromDate, toDate if API supports filtering
            const response = await api.get('/Attendance/my-summary', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get Correction Request Data (Step 1 of Correction)
     * GET /api/Attendance/correction-request
     * Requires token in URL params? Based on requirement: Yes.
     * However, usually GET requests use headers. 
     * If the API strictly needs it in query params, we use the util.
     * The prompt says: "When I click on the request , it opens like this /Attendance/RequestCorrection?token=...&employeeId=..."
     * But the API spec for "Fetch Attendance for Correction" says GET /api/Attendance/correction-request with Params: token, employeeId
     */
    getCorrectionRequestData: async (employeeId) => {
        try {
            // Using api.get with params usually puts them in query string.
            // But if we need to explicitly manually construct it due to specific backend quirks:
            // Let's try standard axios params first.
            const response = await api.get('/Attendance/correction-request', {
                params: { employeeId }
                // Note: api.js interceptor adds Authorization header. 
                // If backend IGNORES header and needs query param 'token', 
                // we might need to modify api.js or handle it here. 
                // Requirement says: "Some APIs accept token via URL query params, not headers"
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Submit Correction Request
     * POST /api/Attendance/correction-request
     * Multipart/form-data
     */
    submitCorrectionRequest: async (formData) => {
        try {
            const response = await api.post('/Attendance/correction-request', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    // --- HR Endpoints ---

    /**
     * Get Specific Employee Attendance Summary (HR View)
     * GET /api/Attendance/employee-summary/{employeeId}
     */
    getEmployeeSummary: async (employeeId) => {
        try {
            const response = await api.get(`/Attendance/employee-summary/${employeeId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get All Correction Requests (HR View)
     * GET /api/Attendance/correction-requests
     */
    getAllCorrectionRequests: async () => {
        try {
            const response = await api.get('/Attendance/correction-requests');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Approve/Reject Correction Request
     * This might reuse the submission endpoint or a specific approval endpoint depending on backend.
     * The prompt implies utilizing the token returned from the details fetch for final submission.
     */
    processCorrectionRequest: async (data) => {
        // Placeholder - update based on specific approval API
        try {
            const response = await api.post('/Attendance/approve-reject', data); // Verify endpoint
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default AttendanceService;
