define(["rs_req","axios.min"],function(rs_req,axios){
var exports = {};
(function(){
"use strict";
function ՐՏ_in(val, arr) {
    if (typeof arr.indexOf === "function") {
        return arr.indexOf(val) !== -1;
    } else if (typeof arr.has === "function") {
        return arr.has(val);
    }
    return arr.hasOwnProperty(val);
}

(function(){

    var __name__ = "__main__";

    var PG_DIR, ROUTES, PAGES, asyncer, make_loader;
    PG_DIR = "";
    ROUTES = [];
    PAGES = {};
    asyncer = rs_req.asyncer;
    function fetch_page(full_path, router_base, url_suff) {
        var ՐՏ_1, ՐՏ_2;
        var ret;
        
        var fetchComp = (ՐՏ_1 = function* fetchComp(pg_name) {
            var pg_nodata, pg_resp, another_name, cmp;
            pg_nodata = false;
            try {
                pg_resp = yield axios.get(router_base + full_path.slice(1) + url_suff);
                if (another_name = pg_resp.headers["x-py4web-spa"]) {
                    pg_name = another_name !== "auto" ? another_name : pg_name;
                } else {
                    return [ "not_spa", null ];
                }
            } catch (ՐՏ_Exception) {
                var e = ՐՏ_Exception;
                if (!e.response || e.response.status !== 404) {
                    throw ՐՏ_Exception;
                }
                return [ null, null ];
            }
            try {
                yield axios.head(PG_DIR + pg_name + ".js");
                cmp = yield rs_req.import_amd(PG_DIR + pg_name);
            } catch (ՐՏ_Exception) {
                var e = ՐՏ_Exception;
                if (!e.response || e.response.status !== 404) {
                    throw ՐՏ_Exception;
                }
                cmp = {};
            }
            if (!cmp.render) {
                try {
                    cmp.template = (yield axios.get(PG_DIR + pg_name + ".html")).data;
                } catch (ՐՏ_Exception) {
                    var e = ՐՏ_Exception;
                    if (!e.response || e.response.status !== 404) {
                        throw ՐՏ_Exception;
                    }
                    cmp = null;
                }
            }
            return [ cmp, pg_resp ];
        }, ՐՏ_1 = asyncer(ՐՏ_1), ՐՏ_1);
        
        var make_comp = (ՐՏ_2 = function* make_comp() {
            var pg_name, pg, pg_resp, src, cmp, cmp_data;
            pg_name = full_path.split("/")[1];
            if (!(ՐՏ_in(pg_name, ROUTES))) {
                return "not_found";
            }
            pg = PAGES[pg_name];
            pg_resp = null;
            if (!pg) {
                [src, pg_resp] = yield fetchComp(pg_name);
                if (!src) {
                    if (!pg_resp) {
                        return "not_found";
                    } else {
                        return "component_not_found";
                    }
                }
                if (src === "not_spa") {
                    return src;
                }
                src.py4web = src.py4web || {};
                if (!pg_resp) {
                    src.py4web.data_load = "no";
                }
                pg = PAGES[pg_name] = {
                    src: src
                };
            }
            cmp = pg.src;
            if (cmp.py4web.data_load === "no") {
            } else {
                if (cmp.py4web.data_load !== "once" || !pg.loaded) {
                    cmp.py4web.data = pg_resp ? pg_resp.data : (yield axios.get(router_base + full_path.slice(1) + url_suff)).data;
                }
                if (!pg.loaded) {
                    cmp_data = cmp.data || {};
                    cmp.data = function() {
                        var self, data;
                        self = this;
                        data = cmp_data.call ? cmp_data.call(self) : Object.assign({}, cmp_data);
                        Object.assign(data, self.$options.py4web.data);
                        return data;
                    };
                    cmp.props = [ "args", "vars" ];
                    pg.loaded = true;
                }
            }
            return cmp;
        }, ՐՏ_2 = asyncer(ՐՏ_2), ՐՏ_2);
        ret = make_comp();
        return ret;
    }
    function make_guard(base) {
        var ՐՏ_3;
        
        var process_route = (ՐՏ_3 = function* process_route(to_, from_, next) {
            var location, full_path, url_suff, pg_name, component, url;
            location = to_;
            full_path = location.fullPath;
            url_suff = Object.keys(location.query).length ? "&is_spa=1" : "?is_spa=1";
            pg_name = location.path.slice(1).split("/")[0];
            if (PAGES[pg_name] && PAGES[pg_name].component_not_found) {
            } else {
                component = yield fetch_page(full_path, base, url_suff);
                if (ՐՏ_in(component, [ "not_spa", "not_found" ])) {
                    url = window.location.href.split("/", 4).join("/") + full_path;
                    next(false);
                    window.location.assign(url);
                    return;
                } else if (component === "component_not_found") {
                    component = {
                        template: "<p>Page component not found</p>"
                    };
                    PAGES[pg_name] = {
                        component_not_found: true
                    };
                }
                PAGES[pg_name].component = component;
            }
            next();
        }, ՐՏ_3 = asyncer(ՐՏ_3), ՐՏ_3);
        return process_route;
    }
    make_loader = function(base_url, pg_dir, routes) {
        var guard;
        PG_DIR = pg_dir;
        ROUTES = routes;
        guard = make_guard(base_url);
        return {
            render: function(h, ctx) {
                var cmp;
                cmp = PAGES[ctx.props.pg.split("/")[0]].component;
                return h(cmp, ctx.data, ctx.children);
            },
            functional: true,
            beforeRouteEnter: guard,
            beforeRouteUpdate: guard
        };
    };
    (function() {
        exports = make_loader;
    })();
})();
})();

return exports;})