const dbModel = require("../../model/dbModel");
const jsonFile = require('jsonfile');
const summernote = require('summernote-nodejs');
const multer = require('multer');
const fs = require('fs');
const he = require('he');
const { parse } = require("path");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'assets/data/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage }).single('pageContents');

module.exports = {
    updatePageContent: async(req, res) => {
        upload(req, res, (e) => {
            // console.error(e);
        });
        jsonFile.readFile('assets/data/pageContents.json', async(err, data) => {
            if (err) throw err;
            let summernoteContents = await summernote(data[`page-content-${req.params.id}`], 'assets/data');
            // console.log(summernoteContents);
            dbModel.update(req.con, res, {
                table: 'pages',
                column: 'contents',
                value: he.encode(await summernoteContents.replace(/\s\s+/g, ' ').replace('./', '/')),
                id: req.params.id
            });
        });
    }
}