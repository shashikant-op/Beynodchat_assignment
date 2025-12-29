const axios = require("axios");

async function update(id, aiContentBlocks, referenceUrl) {
    try {
        const response = await axios.put(`${process.env.API_BASE_URL}/${id}`, {
            aiContentBlocks,
            referenceUrl,
            isUpdated: true
        });
        console.log(response.data, "Article updated");
        return response.data;
    } catch (error) {
        console.error("Error updating article:", error);
        throw error;
    }
    
}
module.exports = update;