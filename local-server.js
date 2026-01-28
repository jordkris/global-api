const app = require('./app');
let appListen = app.listen(process.env.PORT || 30000, () => {
    console.log("[%s] Express server listening on port %d in %s mode", new Date().toLocaleString(), appListen.address().port, app.settings.env);
});