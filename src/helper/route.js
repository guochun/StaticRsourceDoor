const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const Handebars = require('handlebars');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

const tplPath = path.join(__dirname,'../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handebars.compile(source.toString());

module.exports = async function (req, res, filePath,conf) {

    try {
        const stats = await stat(filePath);
        //判断路径为一个文件
        if (stats.isFile()) {
            const contentType = mime(filePath) + ';charset=utf-8';
            res.setHeader('Conent-Type', contentType);
            if(isFresh(stats,req,res)) {
                res.statusCode = 304;
                res.end();
                return;
            }
            let rs;
            const {code, start, end} = range(stats.size, req, res);
            if(code === 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filePath);
            }else {
                res.statusCode = 206;
                rs = fs.createReadStream(filePath, {start, end});
            }
            if(filePath.match(conf.compress)) {
                rs = compress(rs,req,res);
            }
            rs.pipe(res);
        }
        //判断为文件夹
        else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Conent-Type', 'text/html');
            const dir = path.relative(conf.root, filePath);
            const data = {
                title: path.basename(filePath),
                files: files.map((file) => {
                    return {
                        file: file,
                        icon: mime(file)
                    };
                }),
                dir: dir ? `/${dir}` : '',
            };
            res.end(template(data));
        }

    } catch (ex) {
        console.info(ex);
        res.statusCode = 404;
        res.setHeader('Conent-Type', 'text/plain');
        res.end(`${filePath} is not dirctory or file`);
        return;
    }

};
