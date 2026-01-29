const axios=require("axios");
const FormData=require("form-data");

// get cookie
let getInstagramCookie=async () => {
    let data=await axios.get("https://www.instagram.com/");
    let responseHeaders=data.headers;
    return responseHeaders['set-cookie'][0].split(';')[0].split('=')[1];
}

module.exports={
    getAllPossibleAlpha: (req, res) => {
        try {
            let { minLetters, maxLetters }=req.body;

            if (minLetters<1||maxLetters<minLetters) {
                throw new Error('Invalid minLetters / maxLetters');
            }

            const possibleLetter='._0123456789abcdefghijklmnopqrstuvwxyz';
            const base=possibleLetter.length;
            const result=[];

            for (let length=minLetters; length<=maxLetters; length++) {
                const max=Math.pow(base, length);

                for (let i=0; i<max; i++) {
                    let n=i;
                    let str='';

                    while (n>0) {
                        str=possibleLetter[n%base]+str;
                        n=Math.floor(n/base);
                    }

                    // pad with first character to ensure fixed length
                    str=str.padStart(length, possibleLetter[0]);
                    result.push(str);
                }
            }
            res.json({
                success: true,
                data: result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.response?.data||err.message,
            });
        }
    },
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
                    success: false,
                    message: response.data.errors.username[0].message,
                });
            } else {
                res.json({
                    success: true,
                    message: 'This username is available'
                });
            }


        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.response?.data||err.message,
            });
        }
    }
}