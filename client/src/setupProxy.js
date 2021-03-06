const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(proxy("/api", { target: "http://localhost:5000" }));
  app.use(proxy("/api/posts", { target: "http://localhost:5000" }));
  app.use(proxy("/api/posts/like", { target: "http://localhost:5000" }));
  app.use(proxy("/api/posts/unlike", { target: "http://localhost:5000" }));
  app.use(proxy("/api/profile/technicalskills", { target: "http://localhost:5000" }));
};
