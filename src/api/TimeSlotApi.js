// src/api/TimeSlotApi.js
const API_BASE_URL = 'https://localhost:7243'; // Adjust to your actual base URL

/**
 * Fetches all time slots and maps them to an ID-to-Time lookup object.
 * Assumes the TimeSlot endpoint returns objects with 'id' and 'startTime'.
 */
export const fetchAllTimeSlots = () => {
    // IMPORTANT: Assuming a TimeSlot endpoint exists
    const ENDPOINT = '/api/TimeSlot'; 
    
    return fetch(`${API_BASE_URL}${ENDPOINT}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API Error ${response.status}: Failed to fetch time slots.`);
        }
        return response.json();
    })
    .then(data => {
        // Map the list into a lookup object for quick access: { time_Slot_Id: "time string" }
        return data.reduce((map, slot) => {
            // Assuming TimeSlot object has 'Time_Slot_Id' (from your DTO/model) and 'Start_Time'
            const timeId = slot.time_Slot_Id || slot.id; // Use either the DTO name or model name
            const timeString = slot.start_Time || slot.startTime || 'Time Not Specified'; 
            map[timeId] = timeString; 
            return map;
        }, {});
    })
    .catch(error => {
        console.error('Error fetching all time slots:', error);
        throw error;
    });
};