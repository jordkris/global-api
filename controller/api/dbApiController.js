const dbModel = require("../../model/dbModel");
module.exports = {
    get: (req, res) => {
        res.header('Content-Type', 'application/json');
        dbModel.get(req.con, res, {
            table: req.body.table,
            select: req.body.select,
            whereColumn: req.body.whereColumn,
            whereValue: req.body.whereValue,
            server: true
        }, (results) => {
            console.log(`Success get data from table ${req.body.table}`);
            res.status(200).json(results);
        });
    },
    update: (req, res) => {
        res.header('Content-Type', 'application/json');
        dbModel.update(req.con, res, {
            table: req.body.table,
            column: req.body.column,
            value: req.body.value,
            id: req.body.id,
            server: true
        });
    }
}