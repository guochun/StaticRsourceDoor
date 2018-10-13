module.exports = (totalSzie,req,res) => {
    const range = req.headers['range'];
    if(!range) return {code: 200};
    const sizes = range.match(/bytes=(\d*)-(\d*)/);
    const end = sizes[2] || totalSzie - 1;
    const start = sizes[1] || totalSzie - end;
    if(start > end && start < 0 && end > totalSzie) return {code: 200};
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Range', `bytest ${start}-${end}/${totalSzie}`);
    res.setHeader('Content-length', end-start);
    return {
        code: 206,
        start: parseInt(start),
        end: parseInt(end)
    };

};
