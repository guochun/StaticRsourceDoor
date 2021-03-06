const http = require('http');
const path = require('path');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const route = require('./helper/route');
const openUrl = require('./helper/openUrl')

class Server {
    constructor(config) {
        this.conf = Object.assign({}, conf, config);
    }
    start() {
        const server = http.createServer((req, res) => {

            const filePath = path.join(this.conf.root, req.url);
            route(req, res, filePath,this.conf);

        });

        server.listen(this.conf.port, this.conf.hostName, () => {

            const addr = `http://${this.conf.hostName}:${this.conf.port}`;
            openUrl(addr);
            console.info(`server start at ${chalk.green(addr)}`);
        });
    }
}

module.exports = Server;
