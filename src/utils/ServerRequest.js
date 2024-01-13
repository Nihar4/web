import axios from "axios";

const ServerRequest = async ({
    method = "get",
    URL,
    data,
    headers = {}
}) => {
    const base_url = process.env.REACT_APP_REQUEST_BASE_URL;
    let url = base_url + URL
    console.log(url)
    try {
        const result = await axios({
            method,
            url,
            data,
            headers
        });
        return result.data;
    } catch (error) {
        return {
            server_error: true,
            message: error.response.data.message || error.message
        };
    }
};

export default ServerRequest;
