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
            } else if (src.endsWith(".mpd")) {
                const response=await axios.get(src);
                let mpd=response.data;
                mpd=mpd.replace(
                    /(initialization|media)="([^"]+)"/g,
                    (match, attr, value) => {
                        if (value.startsWith("http")) return match;

                        const absolute=new URL(value, basePath).href;
                        return `${attr}="${absolute}"`;
                    }
                );

                res.setHeader(
                    "Content-Type",
                    "application/dash+xml"
                );

                return res.send(mpd);
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