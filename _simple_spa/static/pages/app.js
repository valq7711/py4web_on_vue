define(["vue","axios.min","vue-router","rs_req","pg_loader"],function(Vue,axios,VueRouter,rs_req,pg_loader){
var exports = {};
(function(){
"use strict";

(function(){

    var __name__ = "__main__";

    var BASE, loading_wrapper;
    BASE = window.location.pathname.split("/", 2).join("/") + "/";
    loading_wrapper = {
        render: function(h, ctx) {
            return h(ctx.parent.$root.loading_handler, ctx.data, ctx.children);
        },
        functional: true
    };
    function start(el, pg_dir, spa_routes, app_templ) {
        var routes, router, app;
        Vue.use(VueRouter);
        routes = [ {
            path: "/index"
        }, {
            path: "/:pg/:args*",
            component: pg_loader(BASE, pg_dir, spa_routes),
            props: function(route) {
                var args, vars;
                args = route.params.args;
                args = args && args.split("/");
                vars = route.query;
                return {
                    args: args,
                    vars: vars,
                    pg: route.params.pg
                };
            },
            meta: {
                loading_handler: {
                    template: "<div>Loading...</div>"
                }
            }
        } ];
        router = new VueRouter({
            routes: routes,
            mode: "history",
            base: BASE
        });
        router.beforeEach(function(to_, from_, next) {
            var loading_handler, app;
            loading_handler = to_.matched.length && to_.matched[0].meta.loading_handler;
            if (!loading_handler) {
                next();
                return;
            }
            app = router.app;
            app.loading_handler = loading_handler;
            app.route_state = "resolving";
            setTimeout(function() {
                if (app.route_state === "resolving") {
                    app.route_state = "loading";
                }
                300;
            });
            next();
        });
        router.afterEach(function(to_, from_) {
            router.app.route_state = "ok";
        });
        app = {
            data: {
                route_state: "ok"
            },
            template: app_templ,
            router: router,
            beforeCreate: function beforeCreate() {
                var self = this;
                self.loading_handler = null;
            },
            components: {
                loading: loading_wrapper
            }
        };
        window.app = new Vue(app);
        window.spa_routes = spa_routes;
        window.app.$mount(el || "#app");
        window.rs_req = rs_req;
    }
    exports.start = start;
})();
})();

return exports;})