define(["rs_req"],function(rs_req){
var exports = {};
(function(){
"use strict";
function ՐՏ_print() {
    if (typeof console === "object") {
        console.log.apply(console, arguments);
    }
}

(function(){

    var __name__ = "__main__";

    var ՐՏ_1;
    var asyncer;
    asyncer = rs_req.asyncer;
    
    var init = (ՐՏ_1 = function* init() {
        var dataset, static_ver, js_root_dir, pg_dir, routes, axios, app, app_templ;
        dataset = document.getElementsByTagName("script")[0].dataset;
        static_ver = dataset.static_ver;
        static_ver = static_ver && "/_" + static_ver || "";
        js_root_dir = window.location.pathname.split("/", 2).join("/") + "/static" + static_ver + "/js/";
        pg_dir = window.location.pathname.split("/", 2).join("/") + "/static" + static_ver + "/pages/";
        routes = JSON.parse(dataset.routes);
        rs_req.set_base(js_root_dir);
        axios = yield rs_req.import_amd("axios.min");
        app = yield rs_req.import_amd(pg_dir + "app");
        app_templ = (yield axios.get(pg_dir + "app.html")).data;
        app.start("#app", pg_dir, routes, app_templ);
        ՐՏ_print("Done!!!");
        return;
    }, ՐՏ_1 = asyncer(ՐՏ_1), ՐՏ_1);
    init();
})();
})();

return exports;})