const axios=require("axios");
const FormData=require("form-data");

// get cookie
let getInstagramCookie=async () => {
    let data=await axios.get("https://www.instagram.com/");
    let responseHeaders=data.headers;
    return responseHeaders['set-cookie'][0].split(';')[0].split('=')[1];
}

module.exports={
    instagram: async (req, res) => {
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

            if (response.data.errors.username) {

                res.json({
                    status: 200,
                    success: false,
                    username: username,
                    message: response.data.errors.username[0].message,
                });
            } else {
                res.json({
                    status: 200,
                    success: true,
                    username: username,
                    message: 'This username is available'
                });
            }


        } catch (err) {
            res.json({
                status: 500,
                success: false,
                username: username,
                error: err.response?.data||err.message,
            });
        }
    }
}