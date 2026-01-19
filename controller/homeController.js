module.exports = {
    index: (req, res) => {
        res.render("home/index.ejs");
    },
    page: (req, res) => {
        res.render('home/page.ejs', { title: req.params.title });
    }
}