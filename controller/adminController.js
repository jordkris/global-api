module.exports = {
    index: (req, res) => {
        res.render("admin/index.ejs");
    },
    login: (req, res) => {
        res.render("admin/login.ejs", { errorMessage: req.flash('message')[0] });
    }
}