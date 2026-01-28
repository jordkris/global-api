const axios=require("axios");
const FormData=require("form-data");

// get cookie
let getInstagramCookie=async () => {
    let data=await axios.get("https://www.instagram.com/");
    let responseHeaders=data.headers;
    return responseHeaders['set-cookie'][0].split(';')[0].split('=')[1];
}

module.exports={
    check: async (req, res) => {
        let { username }=req.body;
        try {
            let csrfToken=getInstagramCookie();
            const form=new FormData();
            form.append("username", username);
            const response=await axios.post(
                "https://www.instagram.com/api/v1/web/accounts/web_create_ajax/attempt/",
                form,
                {
                    headers: {
                        ...form.getHeaders(),
                        'X-CSRFToken': csrfToken
                    },
                    timeout: 8000,
                }
            );

            res.json({
                success: true,
                data: response.data,
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.response?.data||err.message,
            });
        }
    }
}