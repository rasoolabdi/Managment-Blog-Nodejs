const authBind = require("auto-bind");

class Controller {
    constructor() {
        authBind(this)
    }
};

module.exports = Controller;