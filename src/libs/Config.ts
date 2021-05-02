
const SERVER_API_URL = process.env.REACT_APP_SERVER_API_URL;
const SERVER_FILEUPLOAD_API_URL = process.env.REACT_APP_SERVER_FILEUPLOAD_API_URL;

export default {
    SERVER_API_URL: SERVER_API_URL,
    SERVER_IMAGE_AVATAR: process.env.REACT_APP_SERVER_IMAGE_AVATAR,
    SERVER_FILEUPLOAD_API_URL: SERVER_FILEUPLOAD_API_URL,
    USE_QUERY_INIT: {
        endpoint: SERVER_API_URL, fetchParams: {
            headers: {
                "content-type": "application/json"
            }
        }
    }
}
