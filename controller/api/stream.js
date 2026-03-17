const axios=require("axios");

module.exports={
    get: async (req, res) => {
        try {
            const src=req.query.src;
            if (!src) {
                return res.status(400).send("Missing src parameter");
            }
            const parsedUrl=new URL(src);
            const basePath=parsedUrl.origin+parsedUrl.pathname.replace(/[^/]+$/, "");
            if (src.endsWith(".m3u8")) {
                const response=await axios.get(src);
                let playlist=response.data;
                const lines=playlist.split("\n");
                const processed=lines.map(line => {
                    if (
                        line.trim()===""||
                        line.startsWith("#")
                    ) return line;
                    const absolute=new URL(line, basePath).href;
                    return absolute;
                });

                res.setHeader(
                    "Content-Type",
                    "application/vnd.apple.mpegurl"
                );
                return res.send(processed.join("\n"));
            }
            const stream=await axios.get(src, {
                responseType: "stream"
            });

            res.setHeader(
                "Content-Type",
                stream.headers["content-type"]||"application/octet-stream"
            );
            stream.data.pipe(res);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Stream error : "+err.message);
        }
    }
}