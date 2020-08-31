(function(){
"use strict";
function enumerate(item) {
    var arr, iter, i;
    arr = [];
    iter = ՐՏ_Iterable(item);
    for (i = 0; i < iter.length; i++) {
        arr[arr.length] = [ i, item[i] ];
    }
    return arr;
}
function ՐՏ_extends(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.__base__ = parent;
    child.prototype.constructor = child;
}
function ՐՏ_Iterable(iterable) {
    var tmp;
    if (iterable.constructor === [].constructor || iterable.constructor === "".constructor || (tmp = Array.prototype.slice.call(iterable)).length) {
        return tmp || iterable;
    }
    if (Set && iterable.constructor === Set) {
        return Array.from(iterable);
    }
    return Object.keys(iterable);
}
function ՐՏ_eq(a, b) {
    var ՐՏitr7, ՐՏidx7;
    var i;
    if (a === b) {
        return true;
    }
    if (a === void 0 || b === void 0 || a === null || b === null) {
        return false;
    }
    if (a.constructor !== b.constructor) {
        return false;
    }
    if (Array.isArray(a)) {
        if (a.length !== b.length) {
            return false;
        }
        for (i = 0; i < a.length; i++) {
            if (!ՐՏ_eq(a[i], b[i])) {
                return false;
            }
        }
        return true;
    } else if (a.constructor === Object) {
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }
        ՐՏitr7 = ՐՏ_Iterable(a);
        for (ՐՏidx7 = 0; ՐՏidx7 < ՐՏitr7.length; ՐՏidx7++) {
            i = ՐՏitr7[ՐՏidx7];
            if (!ՐՏ_eq(a[i], b[i])) {
                return false;
            }
        }
        return true;
    } else if (Set && a.constructor === Set || Map && a.constructor === Map) {
        if (a.size !== b.size) {
            return false;
        }
        for (i of a) {
            if (!b.has(i)) {
                return false;
            }
        }
        return true;
    } else if (a.constructor === Date) {
        return a.getTime() === b.getTime();
    } else if (typeof a.__eq__ === "function") {
        return a.__eq__(b);
    }
    return false;
}
var ՐՏ_modules = {};
ՐՏ_modules["asset.fs_path"] = {};
ՐՏ_modules["asset"] = {};

(function(){
    var __name__ = "asset.fs_path";

    function is_valid_name(name) {
        return /^(\.[\w\-]|[\w\-])([\w\-]|\.)*$/.test(name);
    }
    function to_arr(path) {
        var ՐՏitr1, ՐՏidx1;
        var dirs, beg, d;
        if (path === "" || path === "/") {
            return [ "" ];
        }
        dirs = path.split("/");
        if (dirs[dirs.length-1] === "") {
            dirs = dirs.slice(0, -1);
        }
        beg = dirs[0] === "" ? 1 : 0;
        ՐՏitr1 = ՐՏ_Iterable(dirs.slice(beg));
        for (ՐՏidx1 = 0; ՐՏidx1 < ՐՏitr1.length; ՐՏidx1++) {
            d = ՐՏitr1[ՐՏidx1];
            if (!(d === ".." || is_valid_name(d))) {
                throw new Error("Bad path: " + path);
            }
        }
        return dirs;
    }
    function path_arr_resolve(arr, allow_out_root) {
        var ՐՏitr2, ՐՏidx2;
        var i, ret, path_start, it;
        i = 0;
        ret = [];
        path_start = 0;
        ՐՏitr2 = ՐՏ_Iterable(arr);
        for (ՐՏidx2 = 0; ՐՏidx2 < ՐՏitr2.length; ՐՏidx2++) {
            it = ՐՏitr2[ՐՏidx2];
            if (it === "") {
                ret[0] = "";
                i = 1;
                path_start = 1;
                continue;
            } else if (it === "..") {
                --i;
                if (i >= path_start) {
                    continue;
                } else if (!allow_out_root) {
                    throw new Error("Out of root dir");
                } else {
                    ret.unshift("..");
                    ++path_start;
                    i += 2;
                    continue;
                }
            }
            ret[i] = it;
            ++i;
        }
        return ret.slice(0, i);
    }
    function path_join() {
        var ՐՏitr3, ՐՏidx3;
        var arr, p_str;
        arr = [];
        ՐՏitr3 = ՐՏ_Iterable(arguments);
        for (ՐՏidx3 = 0; ՐՏidx3 < ՐՏitr3.length; ՐՏidx3++) {
            p_str = ՐՏitr3[ՐՏidx3];
            if (p_str) {
                Array.prototype.push.apply(arr, to_arr(p_str));
            }
        }
        return path_arr_resolve(arr).join("/");
    }
    function rel_path_join() {
        var ՐՏitr4, ՐՏidx4;
        var arr, p_str;
        arr = [];
        ՐՏitr4 = ՐՏ_Iterable(arguments);
        for (ՐՏidx4 = 0; ՐՏidx4 < ՐՏitr4.length; ՐՏidx4++) {
            p_str = ՐՏitr4[ՐՏidx4];
            if (p_str) {
                Array.prototype.push.apply(arr, to_arr(p_str));
            }
        }
        return path_arr_resolve(arr, true).join("/");
    }
    ՐՏ_modules["asset.fs_path"]["is_valid_name"] = is_valid_name;
    ՐՏ_modules["asset.fs_path"]["to_arr"] = to_arr;
    ՐՏ_modules["asset.fs_path"]["path_arr_resolve"] = path_arr_resolve;
    ՐՏ_modules["asset.fs_path"]["path_join"] = path_join;
    ՐՏ_modules["asset.fs_path"]["rel_path_join"] = rel_path_join;
})();

(function(){
    var __name__ = "asset";

    ՐՏ_modules["asset"]["fs_path"] = ՐՏ_modules["asset.fs_path"];

})();

(function(){

    var __name__ = "__main__";

    var merge_call;
    var fs_path = ՐՏ_modules["asset.fs_path"];
    
    class Module {
        static __init_class__ (import_amd) {
            this.prototype.import_amd = import_amd;
        }
        constructor (def_args, path) {
            var self = this;
            self.loaded = false;
            self.ok_err = null;
            self.path = path || "";
            self.deps = [];
            self.dep_mods = {};
            if (Array.isArray(def_args[0])) {
                self.deps = def_args.shift();
                self.dep_count = self.deps.length;
            }
            self.init = def_args[0];
            self.load_deps().then(self.run.bind(self));
        }
        on_load_script (ok_err) {
            var self = this;
            self.ok_err = ok_err;
            if (self.loaded) {
                ok_err.ok(self.exports);
            }
        }
        run (deps) {
            var ՐՏitr5, ՐՏidx5;
            var self = this;
            var i, p, exports, _exports;
            ՐՏitr5 = ՐՏ_Iterable(enumerate(self.deps));
            for (ՐՏidx5 = 0; ՐՏidx5 < ՐՏitr5.length; ՐՏidx5++) {
                [i, p] = ՐՏitr5[ՐՏidx5];
                exports = null;
                self.dep_mods[p] = deps[i];
                if (deps[i] === "exports") {
                    deps[i] = exports = {};
                }
            }
            _exports = self.init.apply(null, deps);
            self.exports = exports || _exports;
            self.loaded = true;
            if (self.ok_err) {
                self.ok_err.ok(self.exports);
            }
        }
        load_deps () {
            var ՐՏitr6, ՐՏidx6;
            var self = this;
            var p, mod_path;
            p = [];
            ՐՏitr6 = ՐՏ_Iterable(self.deps);
            for (ՐՏidx6 = 0; ՐՏidx6 < ՐՏitr6.length; ՐՏidx6++) {
                mod_path = ՐՏitr6[ՐՏidx6];
                if (mod_path === "exports") {
                    p.push(Promise.resolve("exports"));
                } else {
                    p.push(self.import_amd(mod_path, self.path));
                }
            }
            return Promise.all(p);
        }
    }
    function doc_ready(arg_to_pass) {
        var p;
        p = function(ok, err) {
            document.addEventListener("readystatechange", function() {
                if (document.readyState === "complete") {
                    ok(arg_to_pass);
                }
            });
        };
        if (document.readyState === "complete") {
            return Promise.resolve(arg_to_pass);
        }
        return new Promise(p);
    }
    class RS_require {
        constructor (cfg) {
            var self = this;
            var define, rs_req;
            self.cfg = cfg || {};
            self.modules = {};
            self._modules = [];
            define = window.define = function(req_list, mod) {
                self.define(req_list, mod);
            };
            define.amd = {};
            self.fs_path = fs_path;
            Module.__init_class__(self.import_amd.bind(self));
            rs_req = {
                import_amd: self.import_amd.bind(self),
                asyncer: asyncer,
                set_base: function(p) {
                    self.cfg.js_root_dir = p;
                }
            };
            self.mount_module("rs_req", rs_req);
        }
        mount_module (as_name, mod) {
            var self = this;
            self.modules[as_name] = {
                exports: mod,
                loaded: true,
                req_chain: []
            };
        }
        define (req_list, cb) {
            var self = this;
            var cs;
            function make_mod(path) {
                var mod;
                mod = new Module([ req_list, cb ], path);
                self._modules.push(mod);
                return mod;
            }
            if ((cs = document.currentScript) && cs.dataset.rs_req) {
                self.make_mod = make_mod;
            } else {
                make_mod();
            }
        }
        on_load_script (path, ok_err) {
            var self = this;
            var mod;
            if (self.make_mod) {
                mod = self.make_mod(path);
                self.make_mod = null;
                mod.on_load_script(ok_err);
            }
        }
        on_error (name, e) {
            var self = this;
            console.log("error on load: ", name);
        }
        import_amd (name, requester) {
            var self = this;
            var is_url, src, js_root_dir, mod, exp, ok_err, s, p, req_chain;
            is_url = /https?:\/{2}.*/.test(name);
            src = name;
            if (!is_url) {
                if (name.startsWith("./") && requester) {
                    name = name.slice(2);
                    name = fs_path.rel_path_join(requester.split("/").slice(0, -1).join("/"), name);
                }
                js_root_dir = self.cfg && self.cfg.js_root_dir || "";
                src = fs_path.rel_path_join(js_root_dir, name);
            }
            if (mod = self.modules[name]) {
                if (!mod.loaded) {
                    if (mod.req_chain.find(function(it) {
                        return it === name;
                    })) {
                        throw new Error("Circular dependency: " + name + " and " + requester);
                    }
                    mod.req_chain.push(requester);
                }
                exp = mod.exports;
                return exp instanceof Promise ? exp : Promise.resolve(exp);
            }
            ok_err = {};
            s = document.createElement("script");
            s.src = src + ".js";
            s.async = true;
            s.onerror = function(e) {
                self.on_error(name, e);
                ok_err.err("loading error: " + s.src);
            };
            s.dataset.rs_req = true;
            p = new Promise(function(ok, err) {
                ok_err = {
                    ok: ok,
                    err: err
                };
            });
            s.onload = function() {
                self.on_load_script(name, ok_err);
            };
            document.head.appendChild(s);
            p.then(function(exports) {
                var mod;
                if (mod = self.modules[name]) {
                    mod.loaded = true;
                    mod.exports = exports;
                } else {
                    throw new Error("load_stack seems corrupted");
                }
            });
            req_chain = requester ? [ requester ] : [];
            self.modules[name] = {
                req_chain: req_chain,
                exports: p,
                loaded: false
            };
            return p;
        }
    }
    class Merge_call {
        merge (a) {
            var self = this;
            self.cmd = "merge";
            self.args = a;
            return self;
        }
    }
    function asyncer(fun) {
        var merge_call, ret;
        merge_call = {};
        function wrap(ctx) {
            function pret(ok, err) {
                function inner(f, opt) {
                    var ret_v, ret_throw, merge_key, v, p;
                    if (opt) {
                        ret_v = opt.ret_v;
                        ret_throw = opt.ret_throw;
                        merge_key = opt.merge_key;
                    }
                    function _err(e, merge_key) {
                        err(e);
                        if (merge_key) {
                            merge_call[merge_key].map(function(cb) {
                                cb.err(e);
                            });
                            delete merge_call[merge_key];
                        }
                    }
                    if (ret_throw) {
                        v = ret_throw;
                    } else {
                        try {
                            f = f || fun.apply(ctx.self, ctx.args);
                            v = f.next(ret_v);
                        } catch (ՐՏ_Exception) {
                            var e = ՐՏ_Exception;
                            _err(e, merge_key);
                            return;
                        }
                    }
                    if (v.value instanceof Merge_call) {
                        if (v.value.cmd === "get_keys") {
                            Promise.resolve(Object.keys(merge_call)).then(function(ret_v) {
                                inner(f, {
                                    ret_v: ret_v,
                                    merge_key: merge_key
                                });
                            });
                        } else if (v.value.cmd === "merge") {
                            if (p = merge_call[v.value.args]) {
                                p.push({
                                    ok: function(v) {
                                        ok(v);
                                    },
                                    err: function(v) {
                                        err(v);
                                    }
                                });
                                return;
                            } else {
                                merge_key = v.value.args;
                                merge_call[merge_key] = [];
                                Promise.resolve(null).then(function(ret_v) {
                                    inner(f, {
                                        ret_v: ret_v,
                                        merge_key: merge_key
                                    });
                                });
                            }
                        } else {
                            Promise.resolve(null).then(function(ret_v) {
                                inner(f, {
                                    ret_v: ret_v,
                                    merge_key: merge_key
                                });
                            });
                        }
                    } else if (!v.done) {
                        if (v.value instanceof Promise) {
                            v.value.then(function(ret_v) {
                                inner(f, {
                                    ret_v: ret_v,
                                    merge_key: merge_key
                                });
                            }, function(e) {
                                var v;
                                try {
                                    v = f.throw(e);
                                } catch (ՐՏ_Exception) {
                                    var e = ՐՏ_Exception;
                                    _err(e, merge_key);
                                    return;
                                }
                                inner(f, {
                                    ret_throw: v,
                                    merge_key: merge_key
                                });
                            });
                        } else {
                            Promise.resolve(v.value).then(function(ret_v) {
                                inner(f, {
                                    ret_v: ret_v,
                                    merge_key: merge_key
                                });
                            });
                        }
                    } else {
                        ok(v.value);
                        if (merge_key) {
                            merge_call[merge_key].map(function(cb) {
                                cb.ok(v.value);
                            });
                            delete merge_call[merge_key];
                        }
                    }
                }
                inner();
            }
            return pret;
        }
        ret = function() {
            var ctx, p;
            ctx = {
                self: this,
                args: arguments
            };
            p = new Promise(wrap(ctx));
            return p;
        };
        ret.__name__ = fun.__name__ || fun.name;
        return ret;
    }
    merge_call = new Merge_call();
    asyncer.merge = merge_call.merge.bind(merge_call);
    new RS_require();
})();
})();
