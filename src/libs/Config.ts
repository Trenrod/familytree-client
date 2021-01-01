
const SERVER_API_URL = process.env.REACT_APP_SERVER_API_URL;

export default {
    SERVER_API_URL: SERVER_API_URL,
    USE_QUERY_INIT: {
        endpoint: SERVER_API_URL, fetchParams: {
            headers: {
                "content-type": "application/json"
            }
        }
    }
}
