module.exports = (req, res, next) => {
    const jwt =  req.cookies['jwt'];
    return res.send(jwt);
}