module.exports = (router) => {
    router.get('/postgresql/:id?', require('./postgresql'));
};
