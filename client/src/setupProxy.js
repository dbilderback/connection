const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(proxy("/api", { target: "http://server:5000" }));
  app.use(proxy("/api/posts", { target: "http://server:5000" }));
  app.use(proxy("/api/posts/like", { target: "http://server:5000" }));
  app.use(proxy("/api/posts/unlike", { target: "http://server:5000" }));
};
