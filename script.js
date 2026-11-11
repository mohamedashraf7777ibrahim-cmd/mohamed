window.PATHLY_QUIZ = [
    { q: "Which of the following is a core component of logistics?", o: ["Warehousing", "Accounting", "Webhosting", "Branding"], a: 0, e: "Warehousing" },
    { q: "Which transport mode is best for large volumes over long distances?", o: ["Road", "Air", "Sea", "Rail"], a: 2, e: "Sea" },
    { q: "What is the primary strength of Road Transport?", o: ["Lowest cost", "Door-to-door service", "High sea capacity", "Flight speed"], a: 1, e: "Door-to-door service" },
    { q: "What protects products and makes loading easier?", o: ["Packaging", "Tracking", "Forecasting", "Invoicing"], a: 0, e: "Packaging" },
    { q: "What causes Low Visibility in supply chains?", o: ["Fuel price changes", "Separate systems & late data", "Fast weather changes", "Heavy traffic"], a: 1, e: "Separate systems & late data" }];
window.PATHLY_MONTHLY = { "Cairo": { "y2025": [41, 50, 30, 34, 36, 30, 35, 35, 44, 46, 47, 50], "y2024": [44, 47, 37, 30, 32, 27, 32, 32, 38, 43, 46, 44] }, "Mexico City": { "y2025": [67, 74, 72, 69, 76, 77, 76, 79, 79, 84, 79, 75], "y2024": [71, 74, 68, 79, 73, 78, 80, 86, 86, 89, 86, 80] }, "Bengaluru": { "y2025": [71, 69, 69, 72, 77, 77, 79, 77, 81, 72, 74, 74], "y2024": [68, 68, 64, 61, 67, 74, 79, 79, 76, 78, 75, 81] }, "Jakarta": { "y2025": [57, 67, 53, 47, 59, 57, 62, 57, 57, 65, 64, 68], "y2024": [58, 55, 59, 48, 57, 59, 61, 58, 59, 61, 62, 64] }, "Bangkok": { "y2025": [66, 72, 65, 59, 66, 71, 72, 74, 69, 66, 71, 64], "y2024": [61, 67, 62, 57, 64, 68, 70, 74, 70, 68, 73, 65] }, "Bogotá": { "y2025": [54, 69, 67, 67, 72, 63, 69, 71, 72, 73, 78, 73], "y2024": [47, 60, 55, 62, 61, 57, 60, 64, 64, 69, 73, 66] }, "Nairobi": { "y2025": [49, 50, 47, 48, 51, 48, 51, 47, 53, 52, 51, 47], "y2024": [47, 48, 46, 48, 54, 49, 47, 46, 50, 48, 53, 45] }, "São Paulo": { "y2025": [44, 61, 55, 61, 58, 59, 53, 60, 60, 62, 62, 63], "y2024": [43, 56, 59, 56, 56, 56, 52, 60, 57, 61, 67, 66] }, "London": { "y2025": [46, 49, 49, 47, 52, 54, 53, 45, 59, 54, 57, 52], "y2024": [46, 48, 47, 46, 52, 52, 51, 45, 54, 54, 57, 52] }, "Sydney": { "y2025": [37, 47, 44, 42, 47, 42, 41, 46, 44, 44, 47, 43], "y2024": [36, 48, 43, 42, 47, 43, 40, 44, 41, 42, 45, 40] } };
(function () {
    var cv = document.getElementById('map'), ctx = cv.getContext('2d');
    var COLS = 7, ROWS = 5, X0 = 50, Y0 = 50, DX = 90, DY = 80, N = COLS * ROWS, DEPOT = 28;
    var jam = {}, zones = [], stops = [9, 19, 24], raf = 0;
    function pos(n) { return [X0 + (n % COLS) * DX, Y0 + Math.floor(n / COLS) * DY] }
    function ek(a, b) { return a < b ? a + '-' + b : b + '-' + a }
    function md(a, b) { return Math.abs(Math.floor(a / COLS) - Math.floor(b / COLS)) + Math.abs(a % COLS - b % COLS) }
    var edges = [], adj = []; for (var i = 0; i < N; i++)adj[i] = [];
    for (var r = 0; r < ROWS; r++)for (var c = 0; c < COLS; c++) {
        var n = r * COLS + c;
        if (c < COLS - 1) { edges.push([n, n + 1]); adj[n].push(n + 1); adj[n + 1].push(n) }
        if (r < ROWS - 1) { edges.push([n, n + COLS]); adj[n].push(n + COLS); adj[n + COLS].push(n) }
    }
    var closed = {}, alg = 'dij', bestOrder = false, showGraph = false, showOther = false;
    function wgt(a, b) { var k = ek(a, b); return closed[k] ? Infinity : (jam[k] ? 4 : 1) }
    function pcost(p) { var s = 0; for (var i = 0; i < p.length - 1; i++)s += wgt(p[i], p[i + 1]); return s }
    function jcount(p) { var s = 0; for (var i = 0; i < p.length - 1; i++)if (jam[ek(p[i], p[i + 1])]) s++; return s }
    function perms(a) { if (a.length < 2) return [a]; var o = []; a.forEach(function (x, i) { perms(a.slice(0, i).concat(a.slice(i + 1))).forEach(function (p) { o.push([x].concat(p)) }) }); return o }
    function search(m, s0, t) {
        var d = [], pv = [], done = [], ord = [], i; for (i = 0; i < N; i++) { d[i] = 1e9; pv[i] = -1 } d[s0] = 0;
        if (m === 'bfs') { var q = [s0], h = 0, seen = {}; seen[s0] = 1; while (h < q.length) { var u = q[h++]; ord.push(u); if (u === t) break; adj[u].forEach(function (v) { if (closed[ek(u, v)] || seen[v]) return; seen[v] = 1; d[v] = d[u] + 1; pv[v] = u; q.push(v) }) } }
        else {
            for (var k = 0; k < N; k++) {
                var u2 = -1; for (i = 0; i < N; i++)if (!done[i] && d[i] < 1e9 && (u2 < 0 || d[i] < d[u2])) u2 = i; if (u2 < 0) break; done[u2] = 1; ord.push(u2); if (u2 === t) break;
                adj[u2].forEach(function (v) { var w = wgt(u2, v); if (w === Infinity) return; var nd = d[u2] + w; if (nd < d[v]) { d[v] = nd; pv[v] = u2 } })
            }
        }
        var path = null; if (ord.indexOf(t) > -1) { path = [t]; while (pv[path[0]] >= 0) path.unshift(pv[path[0]]) }
        return { path: path, ord: ord }
    }
    function plan(m) {
        var pts = [DEPOT].concat(stops), n = stops.length, cache = {};
        function leg(i, j) { var k = i + '>' + j; if (!cache[k]) cache[k] = search(m, pts[i], pts[j]); return cache[k] }
        var idx = stops.map((_, i) => i + 1), seqs = [idx], best = null, bc = 1e18;
        seqs.forEach(function (p) { var seq = [0].concat(p, [0]), c = 0, ok = true; for (var i = 0; i < seq.length - 1; i++) { var L = leg(seq[i], seq[i + 1]); if (!L.path) { ok = false; break } c += m === 'bfs' ? L.path.length - 1 : pcost(L.path) } if (ok && c < bc) { bc = c; best = seq } });
        if (!best) { var f = leg(0, 1); return { path: null, explored: f.ord.length, first: f.ord, ends: [] } }
        var path = [DEPOT], explored = 0, first = null, ends = []; for (var i = 0; i < best.length - 1; i++) { var L = leg(best[i], best[i + 1]); path = path.concat(L.path.slice(1)); explored += L.ord.length; if (i === 0) first = L.ord; ends.push(path.length - 1) }
        return { path: path, explored: explored, first: first, ends: ends }
    }
    var fixedKey = '', fixedRes = null;
    function fixedPlan() { var key = stops.join(','); if (key === fixedKey && fixedRes) return fixedRes; var sj = jam, sc = closed; jam = {}; closed = {}; var r = plan('bfs'); jam = sj; closed = sc; fixedKey = key; fixedRes = r; return r }
    function evalRoute(r, fixed) {
        if (!r || !r.path) return null; var p = r.path, t = 0, fuel = 0, km = (p.length - 1) * .4;
        for (var i = 0; i < p.length - 1; i++) { var k = ek(p[i], p[i + 1]), w = closed[k] ? (fixed ? 15 : 1) : (jam[k] ? 4 : 1); t += w; fuel += (closed[k] && fixed) ? .09 : (jam[k] ? .09 : .04) }
        var min = t * 2, usd = min * .5 + fuel * 1.4 + km * .12, on = 0, cum = 0, prev = DEPOT, cc = 0, ends = r.ends || [], n = ends.length - 1;
        for (var e = 0; e < n; e++) { var node = p[ends[e]]; cum += md(prev, node); prev = node; var arr = 0; for (var q = 0; q < ends[e]; q++) { var kk = ek(p[q], p[q + 1]); arr += closed[kk] ? (fixed ? 15 : 1) : (jam[kk] ? 4 : 1) } if (arr * 2 <= cum * 2 + 8) on++ }
        return { min: min, km: km, fuel: fuel, usd: usd, on: on, n: Math.max(0, n) }
    }
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    var W = 0, Hh = 0, dpr = 1, tk = 0, yawU = .55, pit = 1.0, yaw = .55, gcs = 1, gsn = 0, gcp = 1, gsp = 0, gtx = 0, gtz = 1, F = 1, drag = null, moved = 0, vis = true, sm = null, oth = null, pl = null, expl = null, explFlag = false, NP = [], vp = [], vtot = 0, loopRaf = 0;
    function wp(n) { return [n % COLS - 3, Math.floor(n / COLS) - 2] }
    var LANE = .06, RW = .14, VS = .85; // lane offset, road half-width, van scale
    var sd = 7; function rnd() { sd |= 0; sd = sd + 0x6D2B79F5 | 0; var q = Math.imul(sd ^ sd >>> 15, 1 | sd); q = q + Math.imul(q ^ q >>> 7, 61 | q) ^ q; return ((q ^ q >>> 14) >>> 0) / 4294967296 }
    var BL = [], PK = [], TR = [];
    (function () {
        for (var br = 0; br < ROWS - 1; br++)for (var bc = 0; bc < COLS - 1; bc++) {
            var x0 = bc - 3, z0 = br - 2, park = rnd() < .2 && !(bc === 0 && br === 3);
            if (park) { PK.push({ x: x0, z: z0 }); for (var ti = 0; ti < 6; ti++)TR.push({ x: x0 + .22 + rnd() * .56, z: z0 + .22 + rnd() * .56, r: .045 + rnd() * .035 }); continue }
            var bx0 = x0 + .17, bz0 = z0 + .17, bs = .66, pt = rnd(), bk = pt < .3 ? 1 : pt < .65 ? 2 : 4, bd = Math.hypot(bc - 2.5, br - 1.5);
            var rc = bk === 1 ? [[0, 0, 1, 1]] : bk === 2 ? (rnd() < .5 ? [[0, 0, .48, 1], [.52, 0, .48, 1]] : [[0, 0, 1, .48], [0, .52, 1, .48]]) : [[0, 0, .48, .48], [.52, 0, .48, .48], [0, .52, .48, .48], [.52, .52, .48, .48]];
            rc.forEach(function (q) {
                var h = ((.12 + rnd() * .55) * (1.5 - bd * .17) + (rnd() < .12 ? .35 : 0)) * .8, tall = h > .45;
                BL.push({ id: BL.length, x: bx0 + (q[0] + q[2] / 2) * bs, z: bz0 + (q[1] + q[3] / 2) * bs, w: q[2] * bs, d: q[3] * bs, h: Math.max(.1, h), rgb: tall ? [34 + rnd() * 20, 64 + rnd() * 30, 112 + rnd() * 40] : [30 + rnd() * 18, 40 + rnd() * 20, 64 + rnd() * 30] })
            })
        }
    })();
    var ST = []; for (var si = 0; si < 90; si++)ST.push([rnd(), rnd() * .55, rnd()]);
    var EO = []; for (var n0 = 0; n0 < N; n0++)EO[n0] = []; edges.forEach(function (e, i) { EO[e[0]].push(i); EO[e[1]].push(i) });
    var CCOL = [[205, 64, 64], [232, 234, 240], [64, 112, 205], [242, 172, 52], [72, 74, 86], [52, 160, 124]], CARS = [], lastSig = '';
    function jamDeg(n) { var k = 0; adj[n].forEach(function (v) { if (jam[ek(n, v)]) k++ }); return k }
    function newDest(c, from) { for (var t = 0; t < 24; t++) { var d = Math.floor(rnd() * N); if (d === from) continue; if (jamDeg(d) >= 2 && rnd() < .88) continue; var r = search('dij', from, d); if (r.path && r.path.length > 1) { c.dest = d; c.path = r.path.slice(1); return true } } c.dest = null; c.path = []; return false }
    (function () { for (var ci = 0; ci < 14; ci++) { var a = Math.floor(rnd() * N), nb = adj[a][Math.floor(rnd() * adj[a].length)], c = { from: a, to: nb, p: rnd(), s: .55 + rnd() * .5, c: CCOL[Math.floor(rnd() * CCOL.length)], dest: null, path: [] }; CARS.push(c); newDest(c, nb) } })();
    function carPose(c) { var a = wp(c.from), b = wp(c.to), dx = b[0] - a[0], dz = b[1] - a[1], ln = Math.hypot(dx, dz) || 1, ux = dx / ln, uz = dz / ln; return [a[0] + dx * c.p - uz * LANE, a[1] + dz * c.p + ux * LANE, ux, uz] }
    function vanPose() { var ux, uz, x, z; if (van.from !== van.to) { var a = wp(van.from), b = wp(van.to), dx = b[0] - a[0], dz = b[1] - a[1], ln = Math.hypot(dx, dz) || 1; ux = dx / ln; uz = dz / ln; x = a[0] + dx * van.p; z = a[1] + dz * van.p } else { var w = wp(van.from); ux = Math.cos(van.tang); uz = Math.sin(van.tang); x = w[0]; z = w[1] } return [x - Math.sin(van.ang) * LANE, z + Math.cos(van.ang) * LANE, ux, uz] }
    function obbHit(a, b) {
        var ax = [[a.ux, a.uz], [-a.uz, a.ux], [b.ux, b.uz], [-b.uz, b.ux]], dx = b.x - a.x, dz = b.z - a.z;
        for (var k = 0; k < 4; k++) { var x = ax[k][0], z = ax[k][1], ra = a.hl * Math.abs(x * a.ux + z * a.uz) + a.hw * Math.abs(-x * a.uz + z * a.ux), rb = b.hl * Math.abs(x * b.ux + z * b.uz) + b.hw * Math.abs(-x * b.uz + z * b.ux); if (Math.abs(dx * x + dz * z) > ra + rb) return false }
        return true
    }
    function vanBox() { var vp = vanPose(), ux = Math.cos(van.ang), uz = Math.sin(van.ang); return { x: vp[0] + ux * .015 * VS, z: vp[1] + uz * .015 * VS, ux: ux, uz: uz, hl: .185 * VS, hw: .085 * VS } }
    function carBox(cp) { return { x: cp[0], z: cp[1], ux: cp[2], uz: cp[3], hl: .06, hw: .03 } }
    function vanCheckCrash() {
        var vb = vanBox();
        for (var i = 0; i < CARS.length; i++) {
            var c = CARS[i]; if (c.to === c.from) continue;
            if (c.cool > 0) { if (obbHit(vb, carBox(carPose(c)))) c.cool = Math.max(c.cool, 700); continue } // still touching the same car: not a new crash
            if (obbHit(vb, carBox(carPose(c)))) {
                van.crash = 1600; van.crashes++; van.v = 0; van.min += 3; van.fuel += .02; c.hold = 100; c.cool = 4000;
                return true
            }
        }
        return false
    }
    // where a vehicle will be after travelling s more units along its route (nodes[0]->nodes[1] ... , p = progress on first segment)
    function ahead(nodes, p, s) {
        var t = p + s, k = Math.min(Math.floor(t), nodes.length - 2); if (k < 0) k = 0; var f = t - k, a = wp(nodes[k]), b = wp(nodes[k + 1]), dx = b[0] - a[0], dz = b[1] - a[1], ln = Math.hypot(dx, dz) || 1, ux = dx / ln, uz = dz / ln;
        return { x: a[0] + dx * f - uz * LANE, z: a[1] + dz * f + ux * LANE, ux: ux, uz: uz }
    }
    function carNodes(c) { return [c.from, c.to].concat(c.path) }
    function vanNodes() { return van.from !== van.to ? [van.from, van.to].concat(van.path) : [van.from].concat(van.path) }
    var TS = [.15, .3, .45, .6, .75, .9, 1.05, 1.2, 1.35, 1.5], CSPD = .45, VSPD = .667;
    function vanAllow() {
        van.blk = -1; var vp = vanPose(), allow = 1, gapV = .185 * VS + .06 + .045, vn = vanNodes(), vpp = van.from !== van.to ? van.p : 0, inJunction = van.from !== van.to && (van.p < .2 || van.p > .78);
        if (vn.length < 2) return 1;
        var pv = TS.map(function (t) { var q = ahead(vn, vpp, VSPD * t); return { x: q.x + q.ux * .015 * VS, z: q.z + q.uz * .015 * VS, ux: q.ux, uz: q.uz, hl: .185 * VS + .02, hw: .085 * VS } });
        for (var i = 0; i < CARS.length; i++) {
            var c = CARS[i]; if (c.to === c.from) continue;
            var cp = carPose(c), rx = cp[0] - vp[0], rz = cp[1] - vp[1], dot = cp[2] * vp[2] + cp[3] * vp[3];
            var ah = rx * vp[2] + rz * vp[3], lt = Math.abs(rx * vp[3] - rz * vp[2]);
            if (dot < -.5 && lt > .05) { /* oncoming, own lane: only the route prediction below can matter */ } else if (ah > 0 && ah < gapV + .4 && lt < .11) { var al0 = Math.max(0, (ah - gapV) / .4); if (al0 < allow) { allow = al0; van.blk = i } }
            if (ah < -.1 || Math.hypot(rx, rz) > 1.6) continue; // behind us, or too far to matter
            if (inJunction && van.v > .3) continue; // already crossing the junction: clear it rather than stop in the middle
            var cn = carNodes(c), sp = c.hold > 0 ? 0 : c.s * CSPD * (jam[ek(c.from, c.to)] ? .2 : 1) * (c.vel === undefined ? 1 : c.vel);
            for (var k = 0; k < TS.length; k++) {
                var q = ahead(cn, c.p, sp * TS[k]);
                if (obbHit(pv[k], { x: q.x, z: q.z, ux: q.ux, uz: q.uz, hl: .06 + .02, hw: .03 })) { var al1 = Math.max(0, (TS[k] - .5) / .7); if (al1 < allow) { allow = al1; van.blk = i } break }
            }
        }
        return allow
    }
    function respawnCar(c) { // put a stuck car back on a quiet road, far from the van
        var wv = wp(van.from), n = 0, tries = 0; do { n = Math.floor(Math.random() * N); tries++ } while (tries < 30 && Math.hypot(wp(n)[0] - wv[0], wp(n)[1] - wv[1]) < 2.5);
        c.from = n; c.to = adj[n][Math.floor(Math.random() * adj[n].length)]; c.p = 0; c.hold = 0; c.vel = 1; c.still = 0; c.cool = 0; newDest(c, c.to)
    }
    function stepCars() {
        var sig = Object.keys(jam).sort().join(',') + '|' + Object.keys(closed).sort().join(',');
        if (sig !== lastSig) {
            lastSig = sig; CARS.forEach(function (c) {
                if (closed[ek(c.from, c.to)]) { var t = c.from; c.from = c.to; c.to = t; c.p = 1 - c.p }
                if (c.dest !== null && c.dest !== c.to) { var r = search('dij', c.to, c.dest); if (r.path && r.path.length > 1) c.path = r.path.slice(1); else newDest(c, c.to) } else newDest(c, c.to)
            })
        }
        var poses = CARS.map(function (c) { return c.to !== c.from ? carPose(c) : null });
        var fut = CARS.map(function (c) { if (c.to === c.from) return null; var cn = carNodes(c), sp = c.s * CSPD * (jam[ek(c.from, c.to)] ? .2 : 1); return TS.slice(0, 5).map(function (t) { var q = ahead(cn, c.p, sp * t); return { x: q.x, z: q.z, ux: q.ux, uz: q.uz, hl: .06 + .015, hw: .03 } }) });
        var vp = van.phase !== 'idle' ? vanPose() : null, vbx = vp ? vanBox() : null; if (vbx) { vbx.hl += .02 }
        CARS.forEach(function (c, i) {
            c.braking = false;
            if (c.hold > 0) { c.hold--; c.braking = true; return }
            var cp = poses[i], f = 1;
            if (cp) {
                for (var j = 0; j < CARS.length; j++) {
                    var o = poses[j]; if (j === i || !o) continue;
                    var rx = o[0] - cp[0], rz = o[1] - cp[1], dd = o[2] * cp[2] + o[3] * cp[3];
                    if (dd >= .8) { // follow the car in front (same lane, same direction)
                        var ah = rx * cp[2] + rz * cp[3], lt = Math.abs(rx * cp[3] - rz * cp[2]);
                        if (lt < .05 && ah > 0 && ah < .3) f = Math.min(f, Math.max(0, (ah - .15) / .15))
                    }
                }
                if (vp) { // the van in front, or a van standing in our way
                    var vx = vp[0] - cp[0], vz = vp[1] - cp[1], va = vx * cp[2] + vz * cp[3], vl = Math.abs(vx * cp[3] - vz * cp[2]), vg = .06 + .185 * VS + .04;
                    if (vp[2] * cp[2] + vp[3] * cp[3] > .8 && vl < .07 && va > 0 && va < vg + .15) f = Math.min(f, Math.max(0, (va - vg) / .15));
                    else if (van.v < .3 && va > -.05 && va < .7) for (var k2 = 0; k2 < 5; k2++) if (obbHit(fut[i][k2], vbx)) { f = Math.min(f, Math.max(0, (k2 - 1) / 3)); break }
                }
            }
            if (c.free > 0) c.free--;
            if (f < .05) { c.still = (c.still || 0) + 1; if (c.still > 300) { respawnCar(c); return } } else c.still = 0;
            c.vel = f; if (f < .6) c.braking = true;
            c.p += c.s * .0075 * (jam[ek(c.from, c.to)] ? .2 : 1) * f;
            if (c.p >= 1) { c.from = c.to; c.p -= 1; if (!c.path.length) newDest(c, c.from); c.to = c.path.length ? c.path.shift() : c.from; if (c.to === c.from) c.p = 0 }
        })
    }
    function mkSpr(r, g, b) { var c = document.createElement('canvas'); c.width = c.height = 64; var x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',1)'); gr.addColorStop(.35, 'rgba(' + r + ',' + g + ',' + b + ',.35)'); gr.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return c }
    var SPW = mkSpr(255, 196, 120), SPR = mkSpr(255, 60, 50), SPH = mkSpr(255, 250, 225);
    function P(x, y, z) { var x1 = x * gcs - z * gsn, z1 = x * gsn + z * gcs, yv = y * gcp - z1 * gsp, zv = y * gsp + z1 * gcp, dp = 12 - zv, k = F / dp; return [W / 2 + x1 * k, Hh * .54 - yv * k, dp, k] }
    function shd(c, s) { return 'rgb(' + Math.round(Math.min(255, c[0] * s)) + ',' + Math.round(Math.min(255, c[1] * s)) + ',' + Math.round(Math.min(255, c[2] * s)) + ')' }
    function poly(pts, fill, stroke) { ctx.beginPath(); pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]) }); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1 * dpr; ctx.stroke() } }
    function wh(a, b, c, d) { var n = Math.imul(a + 1, 73856093) ^ Math.imul(b + 7, 19349663) ^ Math.imul(c + 13, 83492791) ^ Math.imul(d + 29, 374761393); n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967296 }
    var LX = -.507, LZ = .862;
    function boxItem(x, z, w, d, h, ang, rgb, glow, id, y0) {
        return {
            dep: P(x, 0, z)[2], draw: function () {
                var cs = Math.cos(ang), sn = Math.sin(ang), hw = w / 2, hd = d / 2, cr = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map(function (p) { return [x + p[0] * cs - p[1] * sn, z + p[0] * sn + p[1] * cs] });
                var bt = cr.map(function (p) { return P(p[0], y0 || 0, p[1]) }), tp = cr.map(function (p) { return P(p[0], h, p[1]) });
                if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 14 * dpr }
                for (var i = 0; i < 4; i++) {
                    var j = (i + 1) % 4, dx = cr[j][0] - cr[i][0], dz = cr[j][1] - cr[i][1], ln = Math.hypot(dx, dz) || 1, nx = dz / ln, nz = -dx / ln;
                    if (nx * gtx + nz * gtz <= 0) continue;
                    poly([bt[i], bt[j], tp[j], tp[i]], shd(rgb, .38 + .5 * Math.max(0, nx * LX + nz * LZ)), 'rgba(120,160,230,.14)');
                    if (glow) ctx.shadowBlur = 0;
                    if (id !== undefined && Math.hypot(bt[i][0] - bt[j][0], bt[i][1] - bt[j][1]) > 14 * dpr) {
                        var nW = Math.max(1, Math.round(ln * 7)), nH = Math.max(2, Math.round(h * 10));
                        for (var cx = 0; cx < nW; cx++)for (var ry = 1; ry < nH; ry++) {
                            var hv = wh(id, i, cx, ry), u0 = (cx + .2) / nW, u1 = (cx + .78) / nW, v0 = (ry + .2) / nH, v1 = (ry + .7) / nH;
                            var ax = bt[i][0] + (bt[j][0] - bt[i][0]) * u0, ay = bt[i][1] + (bt[j][1] - bt[i][1]) * u0, bx = bt[i][0] + (bt[j][0] - bt[i][0]) * u1, by = bt[i][1] + (bt[j][1] - bt[i][1]) * u1,
                                tx0 = tp[i][0] + (tp[j][0] - tp[i][0]) * u0, ty0 = tp[i][1] + (tp[j][1] - tp[i][1]) * u0, tx1 = tp[i][0] + (tp[j][0] - tp[i][0]) * u1, ty1 = tp[i][1] + (tp[j][1] - tp[i][1]) * u1;
                            ctx.fillStyle = hv < .5 ? 'rgba(255,' + Math.round(196 + 50 * hv) + ',130,' + (.55 + .4 * hv) + ')' : 'rgba(8,16,34,.5)';
                            ctx.beginPath(); ctx.moveTo(ax + (tx0 - ax) * v0, ay + (ty0 - ay) * v0); ctx.lineTo(bx + (tx1 - bx) * v0, by + (ty1 - by) * v0); ctx.lineTo(bx + (tx1 - bx) * v1, by + (ty1 - by) * v1); ctx.lineTo(ax + (tx0 - ax) * v1, ay + (ty0 - ay) * v1); ctx.closePath(); ctx.fill()
                        }
                    }
                }
                poly(tp, shd(rgb, 1.25), 'rgba(160,195,255,.3)'); ctx.shadowBlur = 0;
                if (id !== undefined && h > .4 && id % 3 === 0 && ((tk >> 5) + id) % 2 === 0) { var pp = P(x, h + .05, z); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .8; ctx.drawImage(SPR, pp[0] - 5 * dpr, pp[1] - 5 * dpr, 10 * dpr, 10 * dpr); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over' }
            }
        }
    }
    function treeItem(t) {
        return {
            dep: P(t.x, 0, t.z)[2], draw: function () {
                var b = P(t.x, 0, t.z), tp = P(t.x, .07, t.z), c = P(t.x, .13, t.z), r = t.r * c[3];
                ctx.strokeStyle = '#3a2a1c'; ctx.lineWidth = 2 * dpr; ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(tp[0], tp[1]); ctx.stroke();
                ctx.fillStyle = '#14442b'; ctx.beginPath(); ctx.arc(tp[0], tp[1], r, 0, 7); ctx.fill(); ctx.fillStyle = '#1d6a3f'; ctx.beginPath(); ctx.arc(c[0], c[1], r * .8, 0, 7); ctx.fill()
            }
        }
    }
    function prep() { var cs = Math.cos(yaw), sn = Math.sin(yaw); gcs = cs; gsn = sn; gcp = Math.cos(pit); gsp = Math.sin(pit); gtx = gcp * sn; gtz = gcp * cs; F = W * 1.25 }
    function lineP(nodes, y) { ctx.beginPath(); nodes.forEach(function (n, i) { var w = wp(n), p = P(w[0], y, w[1]); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]) }) }
    function glowAt(spr, x, y, z, px, al) { var p = P(x, y, z), s = px * dpr * p[3] / (F / 12); ctx.globalAlpha = al; ctx.drawImage(spr, p[0] - s / 2, p[1] - s / 2, s, s) }
    function frame() {
        tk++; yaw = yawU + (reduce ? 0 : Math.sin(tk * .0035) * .22); prep(); if (!reduce) stepCars();
        var bg = ctx.createLinearGradient(0, 0, 0, Hh); bg.addColorStop(0, '#060b20'); bg.addColorStop(1, '#101b3d'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, Hh);
        ST.forEach(function (q) { ctx.globalAlpha = .25 + .55 * Math.abs(Math.sin(tk * .02 + q[2] * 20)); ctx.fillStyle = '#cfe0ff'; ctx.fillRect(q[0] * W, q[1] * Hh, 1.4 * dpr, 1.4 * dpr) }); ctx.globalAlpha = 1;
        var rg = ctx.createRadialGradient(W / 2, Hh * .55, 0, W / 2, Hh * .55, W * .6); rg.addColorStop(0, 'rgba(255,170,90,.2)'); rg.addColorStop(1, 'rgba(255,170,90,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, Hh);
        for (var n = 0; n < N; n++) { var w0 = wp(n), p0 = P(w0[0], showGraph ? .34 : 0, w0[1]); NP[n] = [p0[0] / dpr, p0[1] / dpr] }
        var gp = [[-3.4, -2.45], [3.4, -2.45], [3.4, 2.45], [-3.4, 2.45]].map(function (q) { return P(q[0], 0, q[1]) });
        ctx.shadowColor = '#ff9a2e'; ctx.shadowBlur = 22 * dpr; poly(gp, '#0b101c', 'rgba(255,160,70,.35)'); ctx.shadowBlur = 0;
        function lot(x0, z0, ins, fill) { poly([P(x0 + ins, .002, z0 + ins), P(x0 + 1 - ins, .002, z0 + ins), P(x0 + 1 - ins, .002, z0 + 1 - ins), P(x0 + ins, .002, z0 + 1 - ins)], fill) }
        for (var br = 0; br < ROWS - 1; br++)for (var bc = 0; bc < COLS - 1; bc++) { var isP = PK.some(function (q) { return q.x === bc - 3 && q.z === br - 2 }); lot(bc - 3, br - 2, .15, '#2d3446'); lot(bc - 3, br - 2, .18, isP ? '#123a22' : '#1a202e') }
        zones.forEach(function (z) { var c = wp(z), ring = []; for (var i = 0; i < 48; i++) { var a = i / 48 * 6.2832; ring.push(P(c[0] + Math.cos(a) * 1.45, .012, c[1] + Math.sin(a) * 1.45)) } poly(ring, 'rgba(255,70,70,.1)', 'rgba(255,90,90,.5)') });
        edges.forEach(function (e) {
            var a = wp(e[0]), b = wp(e[1]), dx = b[0] - a[0], dz = b[1] - a[1], ln = Math.hypot(dx, dz), px = -dz / ln * RW, pz = dx / ln * RW, j = jam[ek(e[0], e[1])] && !closed[ek(e[0], e[1])], cl = closed[ek(e[0], e[1])];
            var q = [P(a[0] + px, .005, a[1] + pz), P(b[0] + px, .005, b[1] + pz), P(b[0] - px, .005, b[1] - pz), P(a[0] - px, .005, a[1] - pz)]; poly(q, cl ? '#090c14' : '#1c2232');
            if (j) { ctx.shadowColor = '#ff4d4d'; ctx.shadowBlur = 14 * dpr; poly(q, 'rgba(255,70,70,.6)'); ctx.shadowBlur = 0 }
        });
        for (var m = 0; m < N; m++) { var c2 = wp(m); poly([P(c2[0] - RW, .006, c2[1] - RW), P(c2[0] + RW, .006, c2[1] - RW), P(c2[0] + RW, .006, c2[1] + RW), P(c2[0] - RW, .006, c2[1] + RW)], '#1c2232') }
        ctx.strokeStyle = 'rgba(240,225,160,.42)'; ctx.lineWidth = 1 * dpr; ctx.setLineDash([5 * dpr, 6 * dpr]);
        edges.forEach(function (e) { if (closed[ek(e[0], e[1])]) return; var a = wp(e[0]), b = wp(e[1]), p = P(a[0], .008, a[1]), q = P(b[0], .008, b[1]); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke() }); ctx.setLineDash([]);
        ctx.globalCompositeOperation = 'lighter'; for (var m2 = 0; m2 < N; m2++) { var c3 = wp(m2); glowAt(SPW, c3[0] + .1, .11, c3[1] + .1, 46, .55) } ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        var vA = wp(van.from), vB = wp(van.to), vx0 = vA[0] + (vB[0] - vA[0]) * van.p, vz0 = vA[1] + (vB[1] - vA[1]) * van.p, fk = sigLive + '|' + van.phase + '|' + van.target + '|' + alg;
        function polyNodes(nodes, y, col, wd, dash, glow) {
            ctx.beginPath(); var p0 = P(vx0, y, vz0); ctx.moveTo(p0[0], p0[1]); nodes.forEach(function (n) { var w = wp(n), p = P(w[0], y, w[1]); ctx.lineTo(p[0], p[1]) });
            if (glow) { ctx.shadowColor = '#ff9a2e'; ctx.shadowBlur = 14 * dpr } ctx.strokeStyle = col; ctx.lineWidth = wd * dpr; ctx.setLineDash(dash ? [dash[0] * dpr, dash[1] * dpr] : []); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.setLineDash([]); ctx.shadowBlur = 0
        }
        if (futKey !== fk) {
            futKey = fk; fut = []; var ph = van.phase, t0 = van.target; if (ph === 'toPickup') { var f1 = search('dij', pickup, delivery).path, f2 = search('dij', delivery, DEPOT).path; fut = (f1 ? f1.slice(1) : []).concat(f2 ? f2.slice(1) : []) } else if (ph === 'toDelivery') { var f3 = search('dij', delivery, DEPOT).path; fut = f3 ? f3.slice(1) : [] }
            var ot = alg === 'dij' ? 'bfs' : 'dij'; if (ph.indexOf('to') === 0) { var sj2 = jam, sc2 = closed; if (ot === 'bfs') { jam = {}; closed = {} } var rr = search(ot, van.to, van.target); jam = sj2; closed = sc2; othLeg = rr.path } else othLeg = null
        }
        if (showOther && othLeg && othLeg.length > 1 && van.phase.indexOf('to') === 0) polyNodes(othLeg, .03, 'rgba(190,205,235,.9)', 3, [2, 7], false);
        if (van.phase.indexOf('to') === 0) { var cur = [van.to].concat(van.path); if (van.to !== van.from || van.path.length) polyNodes(cur, .04, '#ffb35c', 5, null, true); if (fut.length) { polyNodes([van.target].concat(fut), .035, 'rgba(255,179,92,.45)', 3, [6, 6], false) } }
        if (van.flash > 0) { var fr = []; for (var q = 0; q < 28; q++) { var an = q / 28 * 6.2832, rr2 = .22 + (2000 - van.flash) / 2000 * .5; fr.push(P(vx0 + Math.cos(an) * rr2, .03, vz0 + Math.sin(an) * rr2)) } poly(fr, 'rgba(80,220,255,' + (.18 * van.flash / 2000) + ')', 'rgba(80,220,255,' + (.9 * van.flash / 2000) + ')') }
        if (expl && expl.ord.length) {
            var tot = expl.ord.length, shn = reduce ? tot : Math.floor((tk - expl.t0) / 3) + 1;
            for (var ei = 0; ei < Math.min(shn, tot); ei++) {
                var wn = wp(expl.ord[ei]), ring = [], hh = 205 - 160 * ei / Math.max(1, tot - 1), al = Math.max(.2, Math.min(.95, 1 - (shn - ei) * .012));
                for (var a3 = 0; a3 < 24; a3++) { var an = a3 / 24 * 6.2832; ring.push(P(wn[0] + Math.cos(an) * .19, .03, wn[1] + Math.sin(an) * .19)) }
                poly(ring, 'hsla(' + hh + ',95%,60%,' + (al * .35) + ')', 'hsla(' + hh + ',95%,66%,' + al + ')')
            }
            if (!reduce && shn > tot + 120) expl = null
        }
        var items = BL.map(function (b) { return boxItem(b.x, b.z, b.w, b.d, b.h, 0, b.rgb, null, b.id) });
        TR.forEach(function (t) { items.push(treeItem(t)) });
        var lights = [], haz = []; CARS.forEach(function (c) {
            if (c.to === c.from) return; var a = wp(c.from), b = wp(c.to), dx = b[0] - a[0], dz = b[1] - a[1], ln = Math.hypot(dx, dz) || 1, ox = -dz / ln * LANE, oz = dx / ln * LANE, x = a[0] + dx * c.p + ox, z = a[1] + dz * c.p + oz, ang = Math.atan2(dz, dx);
            items.push(boxItem(x, z, .12, .06, .045, ang, c.c)); lights.push([x, z, Math.cos(ang), Math.sin(ang), (jam[ek(c.from, c.to)] || c.braking) ? 1 : 0]); if (c.hold > 0) haz.push([x, z, Math.cos(ang), Math.sin(ang)])
        });
        edges.forEach(function (e) { if (!closed[ek(e[0], e[1])]) return; var a = wp(e[0]), b = wp(e[1]); items.push(boxItem((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, .08, .22, .15, Math.atan2(b[1] - a[1], b[0] - a[0]), [235, 64, 64], '#ff3b3b')) });
        var dw = wp(DEPOT); items.push(boxItem(dw[0], dw[1], .34, .34, .42, 0, [41, 121, 255], '#2979ff'));
        var vanL = null;
        if (van.phase !== 'idle') {
            var tgA = van.from !== van.to ? Math.atan2(vB[1] - vA[1], vB[0] - vA[0]) : van.tang; van.tang = tgA; var dfa = ((tgA - van.ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI; van.ang += dfa * .16;
            var ca = Math.cos(van.ang), sa = Math.sin(van.ang), cx0 = vx0 - sa * LANE, cz0 = vz0 + ca * LANE;
            var vs = VS; function lp(dx, dy) { return [cx0 + (ca * dx - sa * dy) * vs, cz0 + (sa * dx + ca * dy) * vs] }
            poly([lp(-.17, -.1), lp(.2, -.1), lp(.2, .1), lp(-.17, .1)].map(function (q) { return P(q[0], .003, q[1]) }), 'rgba(0,0,0,.38)');
            var ah = [van.to].concat(van.path).slice(0, 3), aj = false; for (var ai = 0; ai < ah.length - 1; ai++) { var kk = ek(ah[ai], ah[ai + 1]); if (jam[kk] || closed[kk]) aj = true } van.aheadJam = aj;
            if (van.phase.indexOf('to') === 0 && van.v > .05) {
                var fan = [lp(.1, 0)]; for (var fi = -6; fi <= 6; fi++) { var fa = fi / 6 * .62; fan.push(lp(.1 + Math.cos(fa) * .75, Math.sin(fa) * .75)) }
                poly(fan.map(function (q) { return P(q[0], .012, q[1]) }), aj ? 'rgba(255,93,93,.16)' : 'rgba(34,211,238,.1)', aj ? 'rgba(255,93,93,.55)' : 'rgba(34,211,238,.35)')
            }
            poly([lp(.2, -.045), lp(.62, -.17), lp(.62, .17), lp(.2, .045)].map(function (q) { return P(q[0], .01, q[1]) }), 'rgba(255,240,200,.11)');
            function part(dx, dy, w, d, h, y0, rgb, glow) { var q = lp(dx, dy); items.push(boxItem(q[0], q[1], w * vs, d * vs, h * vs, van.ang, rgb, glow, undefined, y0 * vs)) }
            part(-.03, 0, .2, .15, .17, .035, [238, 243, 252], van.blocked || van.crash > 0 ? '#ff3b3b' : '#ff9a2e');
            part(.125, 0, .1, .14, .115, .035, [255, 150, 40], null);
            part(.182, 0, .02, .11, .05, .08, [12, 20, 44], null);
            [[-.09, -.08], [-.09, .08], [.12, -.08], [.12, .08]].forEach(function (w2) { part(w2[0], w2[1], .06, .025, .05, 0, [16, 18, 28], null) });
            vanL = { f1: lp(.2, -.05), f2: lp(.2, .05), r1: lp(-.14, -.05), r2: lp(-.14, .05), brake: van.v < .9 || van.blocked || van.wait > 0 }
        }
        items.sort(function (a, b) { return b.dep - a.dep }); if (showGraph) ctx.globalAlpha = .4; items.forEach(function (it) { it.draw() }); ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'lighter'; lights.forEach(function (l) { glowAt(SPH, l[0] + l[2] * .07, .03, l[1] + l[3] * .07, 15, .9); glowAt(SPR, l[0] - l[2] * .07, .03, l[1] - l[3] * .07, l[4] ? 22 : 12, l[4] ? 1 : .8) });
        if (((tk >> 3) & 1) === 0) { haz.forEach(function (h) { glowAt(SPW, h[0] + h[2] * .06, .04, h[1] + h[3] * .06, 22, 1); glowAt(SPW, h[0] - h[2] * .06, .04, h[1] - h[3] * .06, 22, 1) }); if (vanL && van.crash > 0) { [vanL.f1, vanL.f2, vanL.r1, vanL.r2].forEach(function (q) { glowAt(SPW, q[0], .08, q[1], 30, 1) }) } }
        if (vanL) { glowAt(SPH, vanL.f1[0], .07, vanL.f1[1], 26, .95); glowAt(SPH, vanL.f2[0], .07, vanL.f2[1], 26, .95); var bk = vanL.brake; glowAt(SPR, vanL.r1[0], .07, vanL.r1[1], bk ? 24 : 13, bk ? 1 : .6); glowAt(SPR, vanL.r2[0], .07, vanL.r2[1], bk ? 24 : 13, bk ? 1 : .6) } ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        var hz = ctx.createLinearGradient(0, 0, 0, Hh * .5); hz.addColorStop(0, 'rgba(6,11,32,.55)'); hz.addColorStop(1, 'rgba(6,11,32,0)'); ctx.fillStyle = hz; ctx.fillRect(0, 0, W, Hh * .5);
        if (showGraph) {
            var kb2 = F / 12;
            edges.forEach(function (e) {
                var k = ek(e[0], e[1]), a = wp(e[0]), b = wp(e[1]), p = P(a[0], .34, a[1]), q = P(b[0], .34, b[1]), cl = closed[k], jm = jam[k];
                ctx.strokeStyle = cl ? 'rgba(160,170,200,.55)' : jm ? '#ff6b6b' : '#5a9bff'; ctx.lineWidth = (jm ? 3.2 : 2.2) * dpr; ctx.setLineDash(cl ? [4 * dpr, 5 * dpr] : []); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); ctx.setLineDash([]);
                var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; ctx.fillStyle = 'rgba(6,12,32,.82)'; ctx.beginPath(); ctx.arc(mx, my, 8 * dpr, 0, 7); ctx.fill(); ctx.fillStyle = cl ? '#aab4d4' : jm ? '#ff9a9a' : '#cfe0ff'; ctx.font = '700 ' + 10 * dpr + 'px Lexend,sans-serif'; ctx.textAlign = 'center'; ctx.fillText(cl ? '×' : jm ? '4' : '1', mx, my + 3.5 * dpr)
            });
            for (var gn = 0; gn < N; gn++) {
                var w = wp(gn), b0 = P(w[0], 0, w[1]), t0 = P(w[0], .34, w[1]); ctx.strokeStyle = 'rgba(120,170,255,.18)'; ctx.lineWidth = 1 * dpr; ctx.beginPath(); ctx.moveTo(b0[0], b0[1]); ctx.lineTo(t0[0], t0[1]); ctx.stroke();
                ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 8 * dpr; ctx.fillStyle = '#2979ff'; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.6 * dpr; ctx.beginPath(); ctx.arc(t0[0], t0[1], 5.5 * dpr * t0[3] / kb2, 0, 7); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0
            }
        }
        var kb = F / 12; ctx.textAlign = 'center'; ctx.font = '700 ' + 13 * dpr + 'px Lexend,system-ui,sans-serif';
        [pickup, delivery].forEach(function (sn2, i) {
            var w = wp(sn2), b0 = P(w[0], 0, w[1]), t0 = P(w[0], .62, w[1]), r = 12 * dpr * t0[3] / kb;
            ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2 * dpr; ctx.beginPath(); ctx.moveTo(b0[0], b0[1]); ctx.lineTo(t0[0], t0[1]); ctx.stroke();
            ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 12 * dpr; ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(t0[0], t0[1], r, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
            ctx.fillStyle = '#06121f'; ctx.fillText(i + 1, t0[0], t0[1] + 4.5 * dpr)
        });
        var dt = P(dw[0], .6, dw[1]); ctx.fillStyle = '#e6ecff'; ctx.fillText('D', dt[0], dt[1]);
        if (van.phase !== 'idle') {
            var vb = P(vx0, .5, vz0), bad = van.aheadJam || van.blocked, st2 = van.blocked ? 'Blocked' : van.flash > 0 ? 'Re-routing...' : van.aheadJam ? 'Jam ahead' : van.wait > 0 ? (van.phase === 'loading' ? 'Loading' : 'Unloading') : 'Cruising';
            var rem = [van.to].concat(van.path), cst = 0; for (var ri = 0; ri < rem.length - 1; ri++) { var kr = ek(rem[ri], rem[ri + 1]); cst += closed[kr] ? 15 : (jam[kr] ? 4 : 1) } if (van.from !== van.to) cst += (1 - van.p) * (jam[ek(van.from, van.to)] ? 4 : 1);
            var tx1 = (alg === 'dij' ? 'AI' : 'Fixed') + ' \u00b7 ETA ' + Math.ceil(cst * 2) + ' min'; ctx.font = '600 ' + 12 * dpr + 'px Lexend,system-ui,sans-serif';
            var w1 = Math.max(ctx.measureText(tx1).width, ctx.measureText(st2).width) + 18 * dpr, h1 = 36 * dpr, bx = vb[0] - w1 / 2, by = vb[1] - h1 - 10 * dpr;
            ctx.fillStyle = 'rgba(8,16,40,.9)'; ctx.strokeStyle = bad ? '#ff6b6b' : '#22d3ee'; ctx.lineWidth = 1.3 * dpr; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(bx, by, w1, h1, 8 * dpr); else ctx.rect(bx, by, w1, h1); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#e6ecff'; ctx.textAlign = 'center'; ctx.fillText(tx1, vb[0], by + 14 * dpr); ctx.font = '500 ' + 11 * dpr + 'px Lexend,system-ui,sans-serif'; ctx.fillStyle = bad ? '#ff9a9a' : '#7de8f7'; ctx.fillText(st2, vb[0], by + 28 * dpr)
        }
    }
    var pickup = 11, delivery = 30, setMode = 'pickup', autoTraffic = true, events = [], nextEv = 0, sigLive = '', lastRef = 0, othLeg = null, futKey = '', fut = [], othKey = '';
    stops = [pickup, delivery];
    var van = { from: DEPOT, to: DEPOT, p: 0, path: [], phase: 'idle', wait: 0, target: DEPOT, min: 0, km: 0, fuel: 0, rer: 0, jams: 0, flash: 0, crash: 0, crashes: 0, blocked: false, log: [], ang: 0, v: 1, tang: 0, aheadJam: false };
    function nowMs() { return performance.now() }
    function legPath(a, b) { if (alg === 'dij') return search('dij', a, b).path; var sj = jam, sc = closed; jam = {}; closed = {}; var r = search('bfs', a, b); jam = sj; closed = sc; return r.path }
    function logEv(t) { van.log.unshift({ t: Math.round(van.min) + ' min', txt: t }); if (van.log.length > 5) van.log.pop(); var el = document.getElementById('evlog'); if (el) el.innerHTML = van.log.map(function (l) { return '<li><b>' + l.t + '</b>' + l.txt + '</li>' }).join(''); lastRef = 0 }
    function startTrip() {
        var dwp = wp(DEPOT); CARS.forEach(function (c) { if (c.to === c.from) return; var q = carPose(c); if (Math.hypot(q[0] - dwp[0], q[1] - dwp[1]) < .9) { var far = Math.floor(Math.random() * N); c.from = far; c.to = adj[far][0]; c.p = Math.random() * .5; newDest(c, c.to) } }); // keep the depot yard clear
        van.from = DEPOT; van.to = DEPOT; van.p = 0; van.min = 0; van.km = 0; van.fuel = 0; van.rer = 0; van.jams = 0; van.crash = 0; van.crashes = 0; van.log = []; van.blocked = false; van.phase = 'toPickup'; van.wait = 0; van.target = pickup; van.flash = 0;
        var pth = legPath(DEPOT, pickup); van.path = pth ? pth.slice(1) : []; nextEv = nowMs() + 3500; sigLive = '';
        logEv('Trip started. Pickup (1), then delivery (2), then back to the depot.'); if (!pth) logEv('No open road leads to the pickup point.'); update()
    }
    function arrive() {
        if (van.phase === 'toPickup') { van.phase = 'loading'; van.wait = 1400; logEv('Order picked up.') }
        else if (van.phase === 'toDelivery') { van.phase = 'unloading'; van.wait = 1400; logEv('Order delivered.') }
        else if (van.phase === 'toDepot') { van.phase = 'done'; van.wait = 4500; logEv('Back at the depot: ' + Math.round(van.min) + ' min, ' + van.fuel.toFixed(2) + ' L, ' + van.rer + ' re-routes.') }
    }
    function advance() {
        if (van.phase === 'done') { startTrip(); return }
        if (van.phase === 'loading') { van.phase = 'toDelivery'; van.target = delivery } else if (van.phase === 'unloading') { van.phase = 'toDepot'; van.target = DEPOT }
        var pth = legPath(van.from, van.target); van.path = pth ? pth.slice(1) : []; if (!pth) logEv('No open road leads there.')
    }
    function pcost2(p) { var t = 0; for (var i = 0; i < p.length - 1; i++) { var k = ek(p[i], p[i + 1]); t += closed[k] ? 15 : (jam[k] ? 4 : 1) } return t }
    function replan(why) {
        if (van.phase.indexOf('to') !== 0) return;
        if (van.to !== van.from && closed[ek(van.from, van.to)]) { var t = van.from; van.from = van.to; van.to = t; van.p = 1 - van.p }
        var start = van.to, old = [start].concat(van.path), oldCost = pcost2(old), r = search('dij', start, van.target);
        if (!r.path) { van.path = []; van.blocked = true; logEv(why + ' Every road to the target is blocked. Waiting for it to clear.'); return }
        van.blocked = false; var same = old.length === r.path.length && old.every(function (n, i) { return n === r.path[i] }); van.path = r.path.slice(1);
        if (!same) { van.rer++; van.flash = 2000; var sv = Math.round((oldCost - pcost2(r.path)) * 2); logEv(why + ' The AI found a way out and changed the route' + (sv > 0 ? ', saving about ' + sv + ' min.' : '.')) }
    }
    function spawnEvent(type) {
        var route = [van.to].concat(van.path), i = (route.length > 3 && Math.random() < .75) ? 1 + Math.floor(Math.random() * (route.length - 2)) : -1, c = i > 0 ? route[i] : Math.floor(Math.random() * N), keys = [];
        if (type === 'accident') { var b2 = (i > 0 && route[i + 1] !== undefined) ? route[i + 1] : adj[c][0], k = ek(c, b2); if (closed[k]) return; closed[k] = 1; keys = [k]; logEv('Accident: a road on the way is blocked.') }
        else {
            var rad = type === 'rush' ? 2 : 1; edges.forEach(function (e) { if (md(e[0], c) <= rad && md(e[1], c) <= rad || (rad === 1 && (md(e[0], c) <= 1 || md(e[1], c) <= 1))) { var k = ek(e[0], e[1]); if (!jam[k] && !closed[k]) { jam[k] = 1; keys.push(k) } } });
            if (!keys.length) return; logEv(type === 'rush' ? 'Rush hour: a whole district is jammed.' : 'A jam appeared near the route.')
        }
        events.push({ type: type === 'accident' ? 'accident' : 'jam', keys: keys, ends: nowMs() + (type === 'accident' ? 13000 + Math.random() * 5000 : (type === 'rush' ? 26000 : 17000) + Math.random() * 7000) })
    }
    function simStep(dt) {
        var now = nowMs();
        if (autoTraffic && now > nextEv && van.phase.indexOf('to') === 0) { spawnEvent(Math.random() < .22 ? 'accident' : 'jam'); nextEv = now + 7000 + Math.random() * 4500 }
        for (var i = events.length - 1; i >= 0; i--) { var ev = events[i]; if (now > ev.ends) { ev.keys.forEach(function (k) { if (ev.type === 'jam') delete jam[k]; else delete closed[k] }); events.splice(i, 1); logEv(ev.type === 'jam' ? 'A jam cleared.' : 'The road reopened.') } }
        var sig = Object.keys(jam).sort().join(',') + '|' + Object.keys(closed).sort().join(',');
        if (sig !== sigLive) { var first = sigLive === ''; sigLive = sig; if (!first) { if (alg === 'dij') replan('Traffic changed.'); update() } }
        if (van.flash > 0) van.flash -= dt;
        if (now - lastRef > 200) { lastRef = now; refreshLive() }
        CARS.forEach(function (c) { if (c.cool > 0) c.cool -= dt });
        if (van.phase === 'idle') return;
        if (van.crash > 0) { van.crash -= dt; van.v *= .8; van.min += dt / 1500 * 2; return }
        if (vanCheckCrash()) return;
        if (van.wait > 0) { van.wait -= dt; van.v *= .85; van.fuel += dt / 1000 * .003; van.min += dt / 1500 * .7; if (van.wait <= 0) advance(); return }
        if (van.from === van.to) {
            if (!van.path.length) { if (van.from === van.target) arrive(); else { van.blocked = true; van.min += dt / 1500 * 2 } return }
            var nx = van.path[0];
            if (closed[ek(van.from, nx)]) { if (alg === 'dij') { replan('A road closed ahead.'); nx = van.path[0]; if (nx === undefined) return } else { if (!van.blocked) { van.blocked = true; logEv('The fixed route is blocked. The van is stuck.') } van.min += dt / 1500 * 2; return } }
            van.blocked = false; van.path.shift(); van.to = nx; van.p = 0; if (jam[ek(van.from, nx)]) van.jams++
        }
        var jm = jam[ek(van.from, van.to)], allow = vanAllow(); var vtar = (jm ? .28 : 1) * allow;
        if (allow < .05 && van.crash <= 0) { van.stuck = (van.stuck || 0) + dt; if (van.stuck > 2500 && van.blk >= 0) { respawnCar(CARS[van.blk]); van.stuck = 0 } } else van.stuck = 0; // break traffic deadlocks
        van.v += (vtar - van.v) * Math.min(1, dt / (vtar < van.v ? 110 : 240)); var d = dt / 1500 * van.v; van.p += d; van.km += d * .4; van.fuel += d * (jm ? .09 : .04); van.min += dt / 1500 * 2;
        if (van.p >= 1) { van.from = van.to; van.p = 0; if (!van.path.length && van.from === van.target) arrive() }
    }
    function refreshLive() {
        var S = document.getElementById.bind(document); function put(id, v) { var e = S(id); if (e && e.textContent !== v) e.textContent = v }
        put('mTime', Math.round(van.min) + ' min'); put('mFuel', van.fuel.toFixed(2) + ' L'); put('mCost', '$' + Math.round(van.min * .5 + van.fuel * 1.4 + van.km * .12)); put('mKm', van.km.toFixed(1) + ' km');
        var st = { toPickup: 'Heading to pickup', loading: 'Loading', toDelivery: 'Delivering', unloading: 'Unloading', toDepot: 'Returning', done: 'Trip complete', idle: 'Ready' }[van.phase]; if (van.blocked) st = 'Stuck';
        put('mOn', st); put('mOther', van.rer + ' re-routes, ' + van.jams + ' jams met'); put('tapHint', setMode === 'pickup' ? 'Next tap sets the pickup (1).' : 'Next tap sets the delivery (2).'); put('msg', van.log.length ? van.log[0].txt : 'Choose a pickup and a delivery point.')
    }
    function setPoint(n) { if (n === DEPOT) return; if (setMode === 'pickup') { if (n === delivery) return; pickup = n; setMode = 'delivery' } else { if (n === pickup) return; delivery = n; setMode = 'pickup' } stops = [pickup, delivery]; startTrip(); syncUI(); draw() }
    function update() {
        var S = document.getElementById.bind(document), dash = ['kTime', 'kTimeT', 'kFuel', 'kFuelT', 'kCost', 'kCostT', 'kOn', 'kOnT']; function put(id, v) { var e = S(id); if (e) e.textContent = v }
        stops = [pickup, delivery]; var intel = plan('dij'), trad = fixedPlan(); pl = intel;
        if (!intel.path) { dash.forEach(function (i) { put(i, '-') }); return }
        var ei = evalRoute(intel, false), et = evalRoute(trad, true);
        put('kTime', Math.round(ei.min) + ' min'); put('kTimeT', 'Traditional: ' + Math.round(et.min) + ' min'); put('kFuel', ei.fuel.toFixed(2) + ' L'); put('kFuelT', 'Traditional: ' + et.fuel.toFixed(2) + ' L');
        put('kCost', '$' + Math.round(ei.usd)); put('kCostT', 'Traditional: $' + Math.round(et.usd)); put('kOn', ei.on + ' of ' + ei.n); put('kOnT', 'Traditional: ' + et.on + ' of ' + et.n)
    }
    function draw() { update(); refreshLive(); if (reduce || !vis) frame() }
    var lastTs = 0; function loop() { var nw = performance.now(), dt = Math.min(60, lastTs ? nw - lastTs : 16); lastTs = nw; simStep(dt); frame(); if (vis && !reduce) loopRaf = requestAnimationFrame(loop) }
    function size() { dpr = Math.min(2, window.devicePixelRatio || 1); var w = cv.clientWidth || 700; W = Math.round(w * dpr); Hh = Math.round(W * .66); cv.width = W; cv.height = Hh; cv.style.height = (Hh / dpr) + 'px' }
    function pp(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }
    function segD(p, a, b) { var vx = b[0] - a[0], vy = b[1] - a[1], l = vx * vx + vy * vy || 1, u = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / l)); return Math.hypot(p[0] - (a[0] + vx * u), p[1] - (a[1] + vy * u)) }
    function pick(p) {
        var bn = -1, bd = 16; for (var n = 0; n < N; n++) { var d = Math.hypot(NP[n][0] - p[0], NP[n][1] - p[1]); if (d < bd) { bd = d; bn = n } }
        if (bn > -1 && bn !== DEPOT) { toggleStop(bn); return }
        var be = -1, ed = 11; edges.forEach(function (e, i) { var d = segD(p, NP[e[0]], NP[e[1]]); if (d < ed) { ed = d; be = i } });
        if (be > -1) { var k = ek(edges[be][0], edges[be][1]); if (closed[k]) delete closed[k]; else if (jam[k]) { delete jam[k]; closed[k] = 1 } else jam[k] = 1; draw() }
    }
    cv.addEventListener('pointerdown', function (e) { drag = pp(e); moved = 0; cv.setPointerCapture && cv.setPointerCapture(e.pointerId) });
    cv.addEventListener('pointermove', function (e) { if (!drag) return; var p = pp(e), dx = p[0] - drag[0], dy = p[1] - drag[1]; moved += Math.abs(dx) + Math.abs(dy); yawU -= dx * .008; pit = Math.max(.55, Math.min(1.35, pit + dy * .006)); drag = p; if (reduce) frame() });
    cv.addEventListener('pointerup', function (e) { if (drag && moved < 6) pick(pp(e)); drag = null });
    cv.addEventListener('pointerleave', function () { drag = null });
    window.addEventListener('resize', function () { size(); if (reduce) frame() });
    if (window.IntersectionObserver) new IntersectionObserver(function (en) { var v = en[0].isIntersecting; if (v && !vis && !reduce) { vis = true; loop() } vis = v }, { threshold: 0 }).observe(cv);
    size(); if (!reduce) loop();
    function toggleStop(n) { setPoint(n) }
    function addZone(cn) { zones.push(cn); edges.forEach(function (e) { if (md(e[0], cn) <= 2 && md(e[1], cn) <= 2) jam[ek(e[0], e[1])] = 1 }) }


    document.getElementById('addStop').onclick = function () { var a, b; do { a = Math.floor(Math.random() * N) } while (a === DEPOT); do { b = Math.floor(Math.random() * N) } while (b === DEPOT || b === a || md(a, b) < 4); pickup = a; delivery = b; stops = [pickup, delivery]; setMode = 'pickup'; startTrip(); syncUI(); draw() };
    function syncUI() { var S = document.getElementById.bind(document); S('algDij').setAttribute('aria-pressed', alg === 'dij'); S('algBfs').setAttribute('aria-pressed', alg === 'bfs'); S('graphBtn').setAttribute('aria-pressed', showGraph) }
    function setAlg(a) { alg = a; futKey = ''; syncUI(); if (alg === 'dij' && van.phase.indexOf('to') === 0) replan('AI re-routing is on.'); draw() }


    document.getElementById('algDij').onclick = function () { setAlg('dij') }; document.getElementById('algBfs').onclick = function () { setAlg('bfs') };

    document.getElementById('graphBtn').onclick = function () { showGraph = !showGraph; syncUI(); draw() };

    Array.prototype.forEach.call(document.querySelectorAll('[data-act]'), function (b) { b.onclick = function () { var a = b.dataset.act; if (a === 'graph') showGraph = true; else if (a === 'trad') { alg = 'bfs'; explFlag = true } else if (a === 'intel') { alg = 'dij'; explFlag = true } syncUI(); draw(); document.getElementById('top').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }) } });
    document.getElementById('theme').onclick = function () {
        var de = document.documentElement;
        var cur = de.dataset.theme || (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
        de.dataset.theme = cur === 'dark' ? 'light' : 'dark'; draw()
    };
    function preset(p) {
        var go = function () { document.getElementById('top').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }) };
        if (p === 'accident') { spawnEvent('accident'); go(); return }
        jam = {}; closed = {}; zones = []; events = [];
        if (p === 'bridge') { for (var r = 0; r < 4; r++)closed[ek(r * COLS + 2, r * COLS + 3)] = 1; pickup = 10; delivery = 20 }
        else if (p === 'cut') { for (var r2 = 0; r2 < 5; r2++)closed[ek(r2 * COLS + 2, r2 * COLS + 3)] = 1; pickup = 10; delivery = 20 }
        else if (p === 'many') { addZone(9); addZone(19); pickup = 8; delivery = 26 }
        else { pickup = 11; delivery = 30 }
        stops = [pickup, delivery]; setMode = 'pickup'; startTrip(); if (p === 'rush') spawnEvent('rush'); syncUI(); draw(); go()
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-p]'), function (b) { b.onclick = function () { preset(b.dataset.p) } });
    startTrip(); syncUI(); draw();
    function intro() {
        var form = document.getElementById('reg'), truck = document.getElementById('truck'), cargo = document.getElementById('cargoIn'), row = truck.parentNode;
        function A(el, kf, o) { return el.animate(kf, o) }
        var fr = form.getBoundingClientRect(), cr = cargo.getBoundingClientRect(), dx = cr.left + cr.width / 2 - (fr.left + fr.width / 2), dy = cr.top + cr.height / 2 - (fr.top + fr.height / 2), ez = 'cubic-bezier(.2,.7,.3,1)';
        A(truck, [{ transform: 'translateX(-130vw)' }, { transform: 'translateX(2%)', offset: .82 }, { transform: 'translateX(0) rotate(2.4deg)', offset: .93 }, { transform: 'translateX(0) rotate(0deg)' }], { duration: 1500, easing: ez, fill: 'both' });
        Array.prototype.forEach.call(truck.querySelectorAll('.wheel'), function (w) { A(w, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(1260deg)' }], { duration: 1500, easing: ez, fill: 'both' }) });
        A(document.getElementById('road'), [{ backgroundPosition: '0 0' }, { backgroundPosition: '-700px 0' }], { duration: 1500, easing: ez, fill: 'both' });
        for (var i = 0; i < 5; i++) { var pf = document.createElement('div'); pf.className = 'puff'; pf.style.left = (8 + i * 4) + '%'; row.appendChild(pf); A(pf, [{ opacity: .7, transform: 'translate(0,0) scale(.4)' }, { opacity: 0, transform: 'translate(' + (-30 - i * 14) + 'px,' + (-14 - i * 6) + 'px) scale(2.2)' }], { duration: 900, delay: 1150 + i * 50, easing: 'ease-out', fill: 'both' }) }
        A(document.getElementById('door'), [{ transform: 'scaleY(1)' }, { transform: 'scaleY(.06)' }], { duration: 650, delay: 1700, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'both' });
        A(document.getElementById('tglow'), [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 1900, fill: 'both' });
        A(form, [{ opacity: 0, transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.12)' }, { opacity: 1, offset: .22 }, { opacity: 1, transform: 'translate(0,-14px) scale(1.04)', offset: .8 }, { opacity: 1, transform: 'translate(0,0) scale(1)' }], { duration: 1000, delay: 2250, easing: 'cubic-bezier(.2,.9,.25,1)', fill: 'both' });
        Array.prototype.forEach.call(form.children, function (c, k) { A(c, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 420, delay: 2450 + k * 60, easing: 'ease-out', fill: 'both' }) })
    }
    (function () {
        var st = document.querySelector('#contact .stage'), fm = document.getElementById('reg'); if (!st || !fm || reduce || !fm.animate || !window.IntersectionObserver) return;
        st.classList.add('pre'); var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); st.classList.remove('pre'); intro() } }, { threshold: .35 }); io.observe(st)
    })();

    (function () {
        var Q = window.PATHLY_QUIZ, box = document.getElementById('qzList'); if (!Q || !box) return; var score = 0, done = 0, L = 'ABCD';
        function txt(el, t) { el.textContent = t; return el }
        function render() {
            box.innerHTML = ''; score = 0; done = 0; document.getElementById('qzEnd').hidden = true; document.getElementById('qzScore').textContent = '0';
            Q.forEach(function (it, qi) {
                var c = document.createElement('div'); c.className = 'qz'; var n = document.createElement('div'); n.className = 'qn'; n.textContent = qi + 1; var b = document.createElement('div'); b.className = 'qb'; var h = document.createElement('h3'); txt(h, it.q); b.appendChild(h);
                var og = document.createElement('div'); og.setAttribute('role', 'group'); og.setAttribute('aria-label', 'Answers to question ' + (qi + 1));
                it.o.forEach(function (t, oi) { var bt = document.createElement('button'); bt.type = 'button'; bt.className = 'opt'; var i = document.createElement('i'); i.textContent = L[oi]; var sp = document.createElement('span'); sp.textContent = t; bt.appendChild(i); bt.appendChild(sp); bt.onclick = function () { choose(c, it, oi) }; og.appendChild(bt) });
                b.appendChild(og); var f = document.createElement('div'); f.className = 'qf'; f.hidden = true; f.setAttribute('aria-live', 'polite'); b.appendChild(f); c.appendChild(n); c.appendChild(b); box.appendChild(c)
            })
        }
        function choose(c, it, oi) {
            if (c.dataset.done) return; c.dataset.done = '1'; done++; var ok = oi === it.a; if (ok) score++;
            Array.prototype.forEach.call(c.querySelectorAll('.opt'), function (b, i) { b.disabled = true; if (i === it.a) b.classList.add('right'); else if (i === oi) b.classList.add('wrong') });
            var f = c.querySelector('.qf'); f.hidden = false; f.className = 'qf ' + (ok ? 'ok' : 'no'); f.innerHTML = '';
            var h = document.createElement('b'); txt(h, (ok ? 'Correct! ' : 'Not quite. ') + 'Correct answer: ' + L[it.a]); var p = document.createElement('p'); txt(p, it.e); var sm = null; if (it.s) { sm = document.createElement('small'); var w = document.createElement('b'); txt(w, 'Where to find it in the presentation: '); sm.appendChild(w); sm.appendChild(document.createTextNode(it.s + ' (' + it.t + ')')); }
            f.appendChild(h); f.appendChild(p); if (sm) f.appendChild(sm); document.getElementById('qzScore').textContent = score;
            if (done === Q.length) finish()
        }
        function finish() {
            var e = document.getElementById('qzEnd'); e.innerHTML = ''; var h = document.createElement('h3'); txt(h, score === Q.length ? 'Perfect score! ' + score + ' / ' + Q.length : 'You scored ' + score + ' / ' + Q.length); var p = document.createElement('p');
            txt(p, score === Q.length ? 'You nailed the key ideas.' : score >= 3 ? 'Good work. Review the slides marked above and try again.' : 'Check the slides marked above and give it another go.'); var b = document.createElement('button'); b.type = 'button'; b.textContent = 'Try again'; b.onclick = function () { render(); box.scrollIntoView({ behavior: 'smooth', block: 'start' }) };
            e.appendChild(h); e.appendChild(p); e.appendChild(b); e.hidden = false
        }
        render()
    })();
    (function () {
        if (reduce || !window.IntersectionObserver) return; var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }) }, { threshold: .12 });
        Array.prototype.forEach.call(document.querySelectorAll('section h2,section .cols>div,section .steps>div,section .tl li,section .two>div,section .about,#faq details,.gl,.calc,.kpis>div,.cbot>.cp'), function (el, i) { el.classList.add('rv'); el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el) })
    })();
    document.getElementById('reg').onsubmit = function (e) {
        e.preventDefault();
        var n = document.getElementById('fn').value.trim(), m = document.getElementById('fe').value.trim(), er = document.getElementById('err'); er.className = '';
        if (!n) { er.textContent = 'Please enter your name.'; return }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)) { er.textContent = 'Please enter a valid email address.'; return }
        er.className = 'ok'; er.textContent = 'Thanks, ' + n + '. This is a demo form, so nothing was sent.'; this.reset()
    };
})();

(function () {
    var cv = document.getElementById('globe'); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d');
    var LAND = [
        [-168, 66, -156, 71, -140, 70, -125, 70, -110, 68, -95, 70, -85, 69, -82, 64, -92, 59, -94, 57, -82, 55, -79, 52, -78, 60, -70, 61, -64, 58, -60, 54, -65, 49, -67, 45, -70, 42, -74, 40, -76, 35, -81, 31, -80, 26, -83, 29, -89, 30, -94, 29, -97, 26, -97, 22, -94, 18, -90, 21, -87, 21, -88, 16, -84, 15, -83, 10, -80, 8.5, -83, 8, -88, 13, -92, 14.5, -96, 16, -105, 20, -106, 23, -110, 27, -114, 31, -117, 32.5, -121, 35, -124, 40, -124, 47, -128, 51, -135, 58, -146, 61, -152, 59, -160, 56, -164, 60, -166, 64],
        [-55, 60, -45, 60, -20, 70, -20, 82, -45, 83, -65, 80, -70, 76, -55, 70],
        [-80, 73, -62, 67, -65, 62, -78, 64, -88, 70],
        [-77, 8, -72, 12, -62, 10, -52, 5, -50, 0, -44, -2, -35, -6, -38, -13, -40, -20, -48, -26, -53, -34, -58, -38, -62, -41, -65, -45, -68, -52, -70, -55, -74, -50, -74, -40, -71, -30, -70, -18, -76, -14, -81, -5, -80, 0, -77, 4],
        [-9, 37, -9, 43, -2, 43.5, -1, 46, -4.5, 48, 2, 51, 8, 54, 10, 57.5, 8, 58, 5, 59, 5, 62, 10, 64, 15, 68, 20, 70, 28, 71, 40, 68, 44, 66, 55, 68, 68, 69, 73, 72, 80, 73, 100, 77, 113, 74, 130, 72, 140, 72, 160, 70, 170, 70, 180, 68, 180, 65, 172, 64, 165, 61, 160, 60, 163, 56, 156, 51, 155, 57, 143, 59, 137, 54, 141, 48, 135, 43, 130, 42, 127, 39, 129, 35, 126, 35, 126, 38, 122, 40, 121, 37, 119, 35, 122, 30, 120, 26, 117, 23, 110, 21, 106, 20, 109, 15, 109, 11, 105, 8.5, 102, 12, 100, 13, 99, 9, 101, 3, 104, 1.5, 98, 8, 98, 16, 94, 17, 92, 22, 88, 22, 86, 20, 80, 15, 80, 10, 77, 8, 73, 16, 72, 21, 69, 22, 67, 25, 61, 25, 57, 26, 56, 27, 52, 28, 48, 30, 50, 26, 51, 24, 56, 25, 59, 22, 55, 17, 52, 16, 45, 13, 43, 15, 39, 21, 35, 28, 34.5, 31, 36, 34, 36, 36, 30, 36.5, 26, 38, 23, 36.5, 21, 38.5, 19, 42, 13, 45.5, 16, 41.5, 18, 40, 15.5, 38, 12, 42, 8, 44, 3, 43, 0, 39, -2, 37, -5.5, 36],
        [-17, 21, -13, 28, -9, 32, -6, 36, 10, 37, 11, 33, 20, 31, 25, 32, 32, 31, 34, 28, 37, 22, 43, 12, 51, 12, 48, 4, 42, -1, 40, -10, 40, -15, 35, -24, 32, -28, 28, -33, 20, -35, 18, -33, 15, -26, 12, -17, 13, -10, 9, -1, 9, 4, 4, 6, -4, 5, -8, 4.5, -13, 8, -17, 14],
        [114, -22, 122, -18, 130, -12, 137, -12, 141, -12, 143, -14, 146, -19, 153, -26, 150, -37, 141, -38, 135, -34, 129, -32, 115, -34, 113, -26],
        [44, -25, 47, -25, 50, -15, 49, -12, 44, -17],
        [-5, 50, 1, 51, 2, 53, -2, 56, -3, 58.5, -6, 57, -5, 54.5, -3, 53, -5, 52],
        [-10, 52, -6, 52, -6, 55, -10, 54],
        [130, 31, 135, 34, 140, 36, 142, 40, 141, 42, 145, 44, 140, 45, 139, 40, 136, 36, 131, 34],
        [95, 5, 98, 4, 104, -2, 106, -6, 101, -3, 96, 2],
        [109, 1, 117, 7, 119, 1, 116, -4, 111, -3],
        [105, -6, 114, -7, 114, -8.5, 106, -7.5],
        [131, -1, 141, -3, 150, -10, 141, -9, 137, -5],
        [120, 18, 122, 18, 126, 9, 122, 7, 120, 14],
        [172, -34, 178, -38, 175, -41, 172, -41],
        [167, -46, 174, -41, 171, -45],
        [-24, 64, -14, 64, -15, 66, -22, 66],
        [-85, 22, -80, 23, -74, 20, -78, 20],
        [-180, -78, -150, -77, -120, -74, -100, -73, -80, -73, -65, -68, -58, -64, -62, -70, -60, -75, -45, -78, -20, -72, 0, -70, 20, -69, 40, -67, 60, -67, 70, -68, 90, -66, 110, -66, 130, -66, 150, -69, 165, -70, 170, -72, 180, -78, 180, -90, -180, -90],
        [80, 6, 82, 7.5, 80.5, 9.5, 79.8, 8], [120.2, 22.5, 121.8, 25, 121.5, 22.5], [12.5, 38, 15.5, 38, 15, 37], [8.2, 39, 9.7, 39, 9.7, 41, 8.3, 41],
        [-59, 47.5, -52.7, 47, -53, 51.5, -56, 51.5], [-74.4, 18.5, -68.5, 18.5, -69, 19.8, -72.5, 19.9], [11, 78, 17, 77, 25, 79, 20, 80.2], [52, 71, 58, 70.5, 69, 76.5, 60, 76.5],
        [142, 46, 143.5, 49, 143, 54, 142.2, 54], [108.7, 19, 111, 19.5, 110.5, 20], [144.7, -41, 148.3, -41, 147.5, -43.5, 145.5, -42.5], [119, -5, 121, 1.3, 125, 1.5, 121, -1, 121, -4.5],
        [-90, 76, -62, 82, -75, 83, -90, 80], [-118, 70, -100, 69, -102, 73, -117, 73]];
    var WATER = [[47, 45, 52, 47, 53, 45, 54, 41, 53, 37, 50, 37, 49, 40, 47.5, 43], [27.8, 41.8, 28.5, 44, 29.7, 45.3, 31, 46.5, 33.5, 46, 35, 45, 37, 44.5, 41.5, 42, 41.5, 41.3, 38, 41, 35, 42, 31, 41.2, 28.5, 41.2], [10, 54.3, 14, 54, 19, 54.5, 21.5, 57, 23.5, 59.5, 29.5, 60, 23, 60.4, 21.2, 61, 21.5, 63.5, 25, 65.6, 22, 65.8, 18, 62.5, 18.5, 59.5, 16.5, 57, 15, 56, 12.7, 56, 11, 55.6]];
    window.PATHLY_LAND = LAND;
    function inPoly(p, lo, la) {
        var c = false, n = p.length / 2; for (var i = 0, j = n - 1; i < n; j = i++) {
            var xi = p[2 * i], yi = p[2 * i + 1], xj = p[2 * j], yj = p[2 * j + 1];
            if ((yi > la) !== (yj > la) && lo < (xj - xi) * (la - yi) / (yj - yi) + xi) c = !c
        } return c
    }
    function bbx(P) { var a = 1e9, b = -1e9, c = 1e9, d = -1e9; for (var i = 0; i < P.length; i += 2) { a = Math.min(a, P[i]); b = Math.max(b, P[i]); c = Math.min(c, P[i + 1]); d = Math.max(d, P[i + 1]) } return [a, b, c, d] }
    var LB = LAND.map(bbx), WB = WATER.map(bbx);
    function inAny(L, B, lo, la) { for (var i = 0; i < L.length; i++) { var b = B[i]; if (lo < b[0] || lo > b[1] || la < b[2] || la > b[3]) continue; if (inPoly(L[i], lo, la)) return true } return false }
    function isLand(lo, la) { return inAny(LAND, LB, lo, la) && !inAny(WATER, WB, lo, la) }
    var lit = [], M = 36000, D = Math.PI / 180, G = [];
    var PAL = ['#1c7f6b', '#25927a', '#3f8f73', '#50a082', '#2a6a5c', '#33796a', '#d49a50', '#e4ae68', '#8aa0b4', '#9db2c4', '#e8f2ff', '#ffffff', '#8b7f86', '#9c909a'];
    function cls(lo, la) {
        if (la < -60) return 10; if (lo > -75 && lo < -12 && la > 59) return 10; if (la > 68) return 8; if (lo > 74 && lo < 102 && la > 27 && la < 38) return 12;
        if ((lo > -16 && lo < 36 && la > 14 && la < 31) || (lo > 35 && lo < 60 && la > 14 && la < 31) || (lo > 88 && lo < 112 && la > 37 && la < 46) || (lo > 118 && lo < 142 && la > -32 && la < -19) || (lo > 15 && lo < 25 && la > -28 && la < -18)) return 6;
        var a = Math.abs(la); return a < 23 ? 0 : a < 45 ? 2 : a < 66 ? 4 : 8
    }
    function genLand() {
        lit = []; G = PAL.map(function () { return [] });
        for (var i = 0; i < M; i++) {
            var y = 1 - 2 * (i + .5) / M, r = Math.sqrt(1 - y * y), th = i * 2.399963, x = Math.cos(th) * r, z = Math.sin(th) * r;
            var la = Math.asin(y) / D, lo = Math.atan2(x, z) / D; if (isLand(lo, la)) { G[cls(lo, la) + (Math.random() < .5 ? 0 : 1)].push(x, y, z); if (la > -56 && Math.random() < .1) lit.push([x, y, z, .2 + Math.random() * .3]) }
        }
    }
    var CL = []; for (var ci = 0; ci < 420; ci++) {
        var bd = Math.random(), cla = bd < .3 ? (Math.random() - .5) * 20 : bd < .65 ? (Math.random() < .5 ? 1 : -1) * (30 + Math.random() * 20) : (Math.random() < .5 ? 1 : -1) * (55 + Math.random() * 20), clo = Math.random() * 360 - 180;
        for (var qq = 0; qq < 7; qq++) { var la2 = cla + (Math.random() - .5) * 8, lo2 = clo + (Math.random() - .5) * 14; CL.push(Math.cos(la2 * D) * Math.sin(lo2 * D) * 1.012, Math.sin(la2 * D) * 1.012, Math.cos(la2 * D) * Math.cos(lo2 * D) * 1.012, .07 + Math.random() * .16) }
    }
    var C = [['Mexico City', 19.43, -99.13, 75.9, 184, '34 min 29 s', 'Mexico'], ['Bengaluru', 12.97, 77.59, 74.4, 168, '36 min 9 s', 'India'], ['Dublin', 53.35, -6.26, 72.9, 191, null, 'Ireland'], ['Pune', 18.52, 73.86, 71.1, 152, null, 'India'], ['Bogotá', 4.71, -74.07, 69.6, 153, '31 min 45 s', 'Colombia'], ['Bangkok', 13.75, 100.5, 67.9, 115, '22 min 59 s', 'Thailand'], ['Istanbul', 41.0, 28.98, 62, null, null, 'Türkiye'], ['New Delhi', 28.61, 77.21, 60.2, 104, null, 'India'], ['Jakarta', -6.2, 106.85, 59.8, 125, '26 min 19 s', 'Indonesia'], ['Nairobi', -1.29, 36.82, 49.6, 109, '26 min 47 s', 'Kenya'], ['Cairo', 30.04, 31.24, 40.5, 74, null, 'Egypt'],
    ['Davao City', 7.07, 125.61, 66.2, 168, null, 'Philippines'], ['Manila', 14.6, 120.98, 57.0, 143, null, 'Philippines'], ['São Paulo', -23.55, -46.63, 58.5, 132, '27 min 39 s', 'Brazil'], ['Los Angeles', 34.05, -118.24, 59.8, 83, null, 'United States'], ['San Francisco', 37.77, -122.42, 49.7, 116, null, 'United States'], ['New York', 40.71, -74.0, 48.8, 125, null, 'United States'], ['Chicago', 41.88, -87.63, 46.1, 79, null, 'United States'], ['Seattle', 47.61, -122.33, 44.9, 69, null, 'United States'], ['Miami', 25.76, -80.19, 46.8, 72, null, 'United States'], ['London', 51.51, -0.13, 51.6, 141, '36 min 22 s', 'United Kingdom'], ['Melbourne', -37.81, 144.96, 52.9, null, null, 'Australia'], ['Adelaide', -34.93, 138.6, 55.1, 109, null, 'Australia'], ['Sydney', -33.87, 151.21, 43.7, 93, '24 min', 'Australia']];
    C.sort(function (a, b) { return b[3] - a[3] }); window.PATHLY_CITIES = C;
    function genClusters() {
        C.forEach(function (c) {
            var n = 0, tr = 0; while (n < 70 && tr < 300) {
                tr++; var lo = c[2] + (Math.random() + Math.random() + Math.random() - 1.5) * 8, la = c[1] + (Math.random() + Math.random() + Math.random() - 1.5) * 5;
                if (isLand(lo, la)) { lit.push([Math.cos(la * D) * Math.sin(lo * D), Math.sin(la * D), Math.cos(la * D) * Math.cos(lo * D), .6 + Math.random() * .4]); n++ }
            }
        })
    }
    function rebuild() { genLand(); genClusters() }
    rebuild();

    var yaw = -99 * D, pit = 18 * D, sel = -1, hov = -1, drag = null, moved = 0, tw = null, vis = true, t = 0, col = {};
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    function colors() { col = { '--ink': '#e6ecff' } }
    function xyz(la, lo) { return [Math.cos(la * D) * Math.sin(lo * D), Math.sin(la * D), Math.cos(la * D) * Math.cos(lo * D)] }
    function rot(p, s) {
        var a = Math.cos(yaw), b = Math.sin(yaw), x1 = p[0] * a - p[2] * b, z1 = p[0] * b + p[2] * a, c = Math.cos(pit), d = Math.sin(pit);
        return [x1, p[1] * c - z1 * d, p[1] * d + z1 * c]
    }
    var W = 0, H = 0, R = 0, dpr = 1, hit = [];
    var spr = document.createElement('canvas'); spr.width = spr.height = 32; (function () { var g = spr.getContext('2d'), r = g.createRadialGradient(16, 16, 0, 16, 16, 16); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 32, 32) })();
    var GLc = document.getElementById('globeGL'), gl = null, uni = {}, texA = null, texB = null, texReady = false, TW = 2048, TH = 1024;
    function initGL() {
        try { gl = GLc.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false }) || GLc.getContext('experimental-webgl') } catch (e) { gl = null }
        if (!gl) return;
        var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
        var fs = ['precision highp float;', 'uniform vec2 uRes;uniform mat3 uM;uniform vec3 uSun;uniform float uT;uniform sampler2D uA;uniform sampler2D uB;', 'const float PI=3.14159265;',
            'vec2 tuv(vec3 n){return vec2(atan(n.x,n.z)/(2.*PI)+.5,.5-asin(clamp(n.y,-1.,1.))/PI);}',
            'void main(){vec2 q=(gl_FragCoord.xy-.5*uRes)/(.4*uRes.x);float l=length(q);',
            'if(l>1.24){float h=fract(sin(dot(floor(gl_FragCoord.xy*.5),vec2(12.9898,78.233)))*43758.5453);float st=step(.9965,h)*(.35+.65*fract(h*91.7));gl_FragColor=vec4(vec3(.8,.88,1.)*st,st);return;}',
            'if(l>1.){float g=pow(1.-(l-1.)/.24,3.);float sd=clamp(dot(normalize(vec3(q,0.)),uSun)*.5+.62,.25,1.);vec3 gc=vec3(.3,.58,1.)*g*sd;gl_FragColor=vec4(gc*.85,g*.85*sd);return;}',
            'float z=sqrt(1.-l*l);vec3 nv=vec3(q,z);vec3 nw=nv*uM;vec2 uv=tuv(nw);',
            'vec4 a=texture2D(uA,uv);vec4 b=texture2D(uB,uv);',
            'float hE=texture2D(uA,uv+vec2(1./2048.,0.)).a;float hN=texture2D(uA,uv+vec2(0.,-1./1024.)).a;',
            'vec3 east=normalize(vec3(nw.z,0.,-nw.x)+vec3(1e-4,0.,0.));vec3 north=normalize(vec3(0.,1.,0.)-nw*nw.y+vec3(0.,0.,1e-4));',
            'vec3 nb=normalize(nw-7.*((hE-a.a)*east+(hN-a.a)*north));',
            'vec3 sw=uSun*uM;float dif=dot(nb,sw);float day=smoothstep(-.12,.28,dot(nw,sw));',
            'float ocean=b.b;vec2 cuv=uv+vec2(uT*.0009,0.);float cl=max(smoothstep(.52,.86,texture2D(uB,cuv).r),.75*smoothstep(.56,.9,texture2D(uB,vec2(uv.x*1.9-uT*.0006,fract(uv.y*1.7))).r));float cs=smoothstep(.52,.86,texture2D(uB,cuv+vec2(.004,.003)).r);',
            'vec3 col=a.rgb*(.05+max(dif,0.)*1.08)*(1.-.4*cs*day);',
            'vec3 hv=normalize(uSun+vec3(0.,0.,1.));vec2 wu=fract(uv*vec2(14.,7.));vec3 wn=normalize(nv+.06*vec3(texture2D(uB,wu).r-.5,texture2D(uB,wu+.37).r-.5,0.));float sp=pow(max(dot(wn,hv),0.),90.)*ocean*(1.-cl);col+=vec3(.9,.95,1.)*sp*.6*day;',
            'float cd=.07+.93*clamp(dif*1.1+.12,0.,1.);col=mix(col,vec3(.96,.98,1.)*cd,cl*.9);',
            'float nl=b.g*(1.-day)*(1.-cl*.8);col+=vec3(1.,.62,.24)*nl*1.7;',
            'float rim=pow(1.-z,3.);col+=vec3(.26,.52,1.)*rim*(.22+.78*day)*.95;',
            'float tw=smoothstep(-.05,.12,dot(nw,sw))*(1.-smoothstep(.12,.4,dot(nw,sw)));col+=vec3(.95,.45,.18)*tw*.17*(1.-cl*.6);', 'gl_FragColor=vec4(col,1.);}'].join('\n');
        function mk(t, src) { var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.log('shader error', gl.getShaderInfoLog(s)); return null } return s }
        var v = mk(gl.VERTEX_SHADER, vs), f = mk(gl.FRAGMENT_SHADER, fs); if (!v || !f) { gl = null; return }
        var pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { gl = null; return }
        gl.useProgram(pr); var bf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        var lc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(lc); gl.vertexAttribPointer(lc, 2, gl.FLOAT, false, 0, 0);
        ['uRes', 'uM', 'uSun', 'uT', 'uA', 'uB'].forEach(function (n) { uni[n] = gl.getUniformLocation(pr, n) }); texA = gl.createTexture(); texB = gl.createTexture()
    }
    function sm(e0, e1, x) { var t2 = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t2 * t2 * (3 - 2 * t2) }
    function h2(x, y) { var n = Math.imul(x, 374761393) + Math.imul(y, 668265263) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967296 }
    function vn(x, y, per) {
        var xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, u = fx * fx * (3 - 2 * fx), w = fy * fy * (3 - 2 * fy), x0 = per ? ((xi % per) + per) % per : xi, x1 = per ? (((xi + 1) % per) + per) % per : xi + 1;
        return (h2(x0, yi) * (1 - u) + h2(x1, yi) * u) * (1 - w) + (h2(x0, yi + 1) * (1 - u) + h2(x1, yi + 1) * u) * w
    }
    function gm(lo, la, cl, ca, sl, sa) { return Math.exp(-((lo - cl) * (lo - cl) / (2 * sl * sl) + (la - ca) * (la - ca) / (2 * sa * sa))) }
    function bm(lo, la, l0, l1, a0, a1, s) { return sm(l0 - s, l0, lo) * sm(l1 + s, l1, lo) * sm(a0 - s, a0, la) * sm(a1 + s, a1, la) }
    function buildTextures() {
        if (!gl) return;
        var mc = document.createElement('canvas'); mc.width = TW; mc.height = TH; var mx = mc.getContext('2d'); mx.fillStyle = '#000'; mx.fillRect(0, 0, TW, TH);
        function pth(p) { mx.beginPath(); for (var i = 0; i < p.length; i += 2) { var x = (p[i] + 180) / 360 * TW, y = (90 - p[i + 1]) / 180 * TH; i ? mx.lineTo(x, y) : mx.moveTo(x, y) } mx.closePath(); mx.fill() }
        mx.fillStyle = '#fff'; LAND.forEach(pth); mx.fillStyle = '#000'; WATER.forEach(pth);
        var md = mx.getImageData(0, 0, TW, TH).data;
        var sc = document.createElement('canvas'); sc.width = 256; sc.height = 128; sc.getContext('2d').drawImage(mc, 0, 0, 256, 128);
        var bc = document.createElement('canvas'); bc.width = 1024; bc.height = 512; var bx = bc.getContext('2d'); bx.imageSmoothingEnabled = true; bx.drawImage(sc, 0, 0, 1024, 512); var bd = bx.getImageData(0, 0, 1024, 512).data;
        var A = new Uint8ClampedArray(TW * TH * 4), TR = [22, 92, 50], SV = [112, 128, 52], TE = [58, 104, 52], BO = [38, 70, 46], DE = [206, 168, 108], TU = [132, 138, 118], IC = [240, 246, 252], RK = [112, 100, 92];
        function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] }
        for (var y = 0; y < TH; y++) {
            var la = 90 - (y + .5) / TH * 180, ta = Math.abs(la);
            for (var x = 0; x < TW; x++) {
                var i = (y * TW + x) * 4, m = md[i] / 255, lo = (x + .5) / TW * 360 - 180, bf = bd[(((y >> 1) * 1024) + (x >> 1)) * 4] / 255;
                var sh = sm(.01, .5, bf), oc = [6 + 30 * sh, 36 + 92 * sh, 90 + 80 * sh], r, g, b, hh = 0;
                if (ta > 66 && m < .5) { var ic = sm(66, 78, ta) * .55 * (1 - sh); oc = mix(oc, [190, 215, 235], ic) }
                if (m > .02) {
                    var nz = vn(x / 70, y / 70) * .5 + vn(x / 26, y / 26) * .3 + vn(x / 9, y / 9) * .2, nz2 = vn(x / 14 + 40, y / 14 + 9);
                    var wT = 1 - sm(14, 30, ta), wM = sm(14, 30, ta) * (1 - sm(40, 58, ta)), wB = sm(40, 58, ta) * (1 - sm(62, 72, ta)), wU = sm(62, 72, ta);
                    var c1 = mix(SV, TR, sm(.3, .7, nz)), c2 = mix(SV, TE, sm(.2, .7, nz)), c3 = mix(BO, TE, sm(.55, .9, nz) * .5);
                    var c = [wT * c1[0] + wM * c2[0] + wB * c3[0] + wU * TU[0], wT * c1[1] + wM * c2[1] + wB * c3[1] + wU * TU[1], wT * c1[2] + wM * c2[2] + wB * c3[2] + wU * TU[2]];
                    var dz = Math.max(bm(lo, la, -16, 36, 15, 30, 5), bm(lo, la, 36, 58, 15, 30, 5), bm(lo, la, 88, 112, 37, 46, 4), bm(lo, la, 118, 142, -32, -19, 5), bm(lo, la, 14, 25, -28, -18, 4) * .8, bm(lo, la, -72, -68, -27, -18, 2) * .9, bm(lo, la, -117, -105, 28, 37, 4) * .7, bm(lo, la, 50, 65, 28, 40, 4) * .8, bm(lo, la, -72, -64, -50, -38, 3) * .5);
                    dz *= .6 + .4 * sm(.3, .8, nz); c = mix(c, [DE[0] * (.9 + .2 * nz2), DE[1] * (.9 + .2 * nz2), DE[2] * (.9 + .2 * nz2)], Math.min(1, dz));
                    var mw = Math.max(gm(lo, la, 86, 33, 16, 5) * .95, gm(lo, la, -69, -25, 3.2, 22) * .85, gm(lo, la, -110, 42, 7, 12) * .65, gm(lo, la, 10, 46.5, 6, 1.6) * .7, gm(lo, la, 78, 41, 10, 3) * .6, gm(lo, la, 39, 9, 3, 5) * .5, gm(lo, la, 60, 58, 1.5, 8) * .4, gm(lo, la, 44, 42, 5, 1.2) * .5, gm(lo, la, -82, 36, 4, 4) * .3, gm(lo, la, 28, -29, 3, 3) * .35);
                    hh = .04 + .14 * nz + mw * .5; c = mix(c, RK, Math.min(1, mw * .75));
                    var ice = Math.max(bm(lo, la, -75, -12, 60, 84, 4), sm(-62, -66, la), sm(76, 84, la) * .8, sm(.74, .9, hh)); c = mix(c, IC, Math.min(1, ice)); if (ice > .5) hh = Math.max(hh, .3 + ice * .1);
                    var k = .94 + .12 * nz2; r = c[0] * k; g = c[1] * k; b = c[2] * k;
                    r = oc[0] * (1 - m) + r * m; g = oc[1] * (1 - m) + g * m; b = oc[2] * (1 - m) + b * m; hh *= m
                }
                else { r = oc[0]; g = oc[1]; b = oc[2] }
                A[i] = r; A[i + 1] = g; A[i + 2] = b; A[i + 3] = Math.min(255, hh * 255)
            }
        }
        var BW = 1024, BH = 512, B = new Uint8ClampedArray(BW * BH * 4), lcv = document.createElement('canvas'); lcv.width = BW; lcv.height = BH; var lx = lcv.getContext('2d'); lx.fillStyle = '#000'; lx.fillRect(0, 0, BW, BH); lx.globalCompositeOperation = 'lighter';
        C.forEach(function (c) { var x = (c[2] + 180) / 360 * BW, y = (90 - c[1]) / 180 * BH, gr = lx.createRadialGradient(x, y, 0, x, y, 11); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); lx.fillStyle = gr; lx.fillRect(x - 11, y - 11, 22, 22) });
        var rr = function () { return Math.random() }, dsp = document.createElement('canvas'); dsp.width = dsp.height = 8; (function () { var g = dsp.getContext('2d'), r = g.createRadialGradient(4, 4, 0, 4, 4, 4); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 8, 8) })();
        for (var n = 0; n < 110000; n++) {
            var lo2 = rr() * 360 - 180, la2 = rr() * 110 - 48; var px = Math.floor((lo2 + 180) / 360 * TW), py = Math.floor((90 - la2) / 180 * TH); if (md[(py * TW + px) * 4] < 128) continue;
            var pop = .03 + .5 * Math.max(bm(lo2, la2, -10, 40, 35, 60, 4) * .9, bm(lo2, la2, 105, 145, 22, 45, 4), bm(lo2, la2, 68, 90, 8, 30, 4) * .85, bm(lo2, la2, -95, -70, 28, 45, 4) * .85, bm(lo2, la2, 29, 33, 24, 31, 2), bm(lo2, la2, -48, -38, -25, -5, 3) * .5, bm(lo2, la2, 2, 8, 5, 8, 2) * .8, bm(lo2, la2, 105, 114, -8, -6, 2), bm(lo2, la2, -105, -97, 17, 22, 3) * .7);
            C.forEach(function (c) { var d = Math.hypot(lo2 - c[2], la2 - c[1]); pop = Math.max(pop, Math.exp(-d * d / 60)) });
            if (rr() < pop) { lx.globalAlpha = .25 + rr() * .5; lx.drawImage(dsp, (lo2 + 180) / 360 * BW - 2.5, (90 - la2) / 180 * BH - 2.5, 5, 5) }
        }
        var ld = lx.getImageData(0, 0, BW, BH).data;
        for (var y2 = 0; y2 < BH; y2++) {
            for (var x2 = 0; x2 < BW; x2++) {
                var j = (y2 * BW + x2) * 4, fx = x2 / 64, fy = y2 / 64, cn = .5 * vn(fx, fy, 16) + .27 * vn(fx * 2, fy * 2, 32) + .15 * vn(fx * 4, fy * 4, 64) + .08 * vn(fx * 8, fy * 8, 128),
                    lat2 = 90 - (y2 + .5) / BH * 180, band = .82 + .3 * Math.cos(lat2 * Math.PI / 45); B[j] = Math.min(255, cn * band * 290); B[j + 1] = ld[j]; B[j + 2] = 255 * (1 - md[((y2 * 2) * TW + x2 * 2) * 4] / 255); B[j + 3] = 255
            }
        }
        function up(tx, w, h, data) {
            gl.bindTexture(gl.TEXTURE_2D, tx); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        }
        up(texA, TW, TH, A); up(texB, BW, BH, B); texReady = true; redraw()
    }
    function renderGL() {
        var cs = Math.cos(yaw), sn = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit);
        gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uni.uRes, W, H); gl.uniformMatrix3fv(uni.uM, false, new Float32Array([cs, -sp * sn, cp * sn, 0, cp, sp, -sn, -sp * cs, cp * cs])); gl.uniform3f(uni.uSun, -.38, .32, .87); gl.uniform1f(uni.uT, t);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texA); gl.uniform1i(uni.uA, 0); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texB); gl.uniform1i(uni.uB, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    function size() { dpr = Math.min(2, window.devicePixelRatio || 1); var w = cv.clientWidth || 400; W = Math.round(w * dpr); H = W; cv.width = W; cv.height = H; R = W * 0.40; if (gl) { GLc.width = W; GLc.height = H } }
    function lvlCol(l) { return 'hsl(' + Math.max(0, Math.min(50, (78 - l) * 1.4)) + ',95%,55%)' }
    function frame() {
        if (++t % 60 === 1) colors();
        if (tw) { var k0 = Math.min(1, (t - tw.t0) / 45), e0 = 1 - Math.pow(1 - k0, 3); yaw = tw.y0 + tw.dy * e0; pit = tw.p0 + tw.dp * e0; if (k0 >= 1) tw = null }
        else if (!drag && !reduce && hov < 0) yaw += 0.0025;
        ctx.clearRect(0, 0, W, H); var cx = W / 2, cy = H / 2;
        if (gl && texReady) { renderGL() } else {
            var ag = ctx.createRadialGradient(cx, cy, R * .98, cx, cy, R * 1.16); ag.addColorStop(0, 'rgba(110,185,255,.55)'); ag.addColorStop(1, 'rgba(110,185,255,0)');
            ctx.fillStyle = ag; ctx.beginPath(); ctx.arc(cx, cy, R * 1.16, 0, 7); ctx.fill();
            ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
            var og = ctx.createRadialGradient(cx - R * .35, cy - R * .35, R * .05, cx, cy, R); og.addColorStop(0, '#2a6fd6'); og.addColorStop(.55, '#123f9a'); og.addColorStop(1, '#050f34');
            ctx.fillStyle = og; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
            var cw = Math.cos(yaw), sw = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit), sz = R * .023;
            for (var k = 0; k < G.length; k++) {
                var arr = G[k]; ctx.fillStyle = PAL[k];
                for (var i = 0; i < arr.length; i += 3) { var x = arr[i], y = arr[i + 1], z = arr[i + 2], x1 = x * cw - z * sw, z1 = x * sw + z * cw; if (y * sp + z1 * cp < 0.01) continue; ctx.fillRect(cx + x1 * R - sz / 2, cy - (y * cp - z1 * sp) * R - sz / 2, sz, sz) }
            }
            var yc = yaw + t * 0.0006, cc = Math.cos(yc), sc = Math.sin(yc), cz = R * .04;
            for (var j = 0; j < CL.length; j += 4) { var x = CL[j], y = CL[j + 1], z = CL[j + 2], x1 = x * cc - z * sc, z1 = x * sc + z * cc, z2 = y * sp + z1 * cp; if (z2 < 0.02) continue; ctx.globalAlpha = Math.min(1, CL[j + 3] * 1.9 * (.4 + .6 * z2)); ctx.drawImage(spr, cx + x1 * R - cz, cy - (y * cp - z1 * sp) * R - cz, cz * 2, cz * 2) }
            ctx.globalAlpha = 1;
            var sh = ctx.createRadialGradient(cx - R * .55, cy - R * .4, R * .35, cx - R * .1, cy - R * .05, R * 1.5); sh.addColorStop(0, 'rgba(0,10,40,0)'); sh.addColorStop(.55, 'rgba(0,10,40,.06)'); sh.addColorStop(1, 'rgba(0,6,24,.8)');
            ctx.fillStyle = sh; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
            var s2 = ctx.createRadialGradient(cx - R * .4, cy - R * .45, 0, cx - R * .4, cy - R * .45, R * .35); s2.addColorStop(0, 'rgba(255,255,255,.16)'); s2.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = s2; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
            var lb = ctx.createRadialGradient(cx, cy, R * .78, cx, cy, R); lb.addColorStop(0, 'rgba(120,190,255,0)'); lb.addColorStop(1, 'rgba(120,190,255,.34)'); ctx.fillStyle = lb; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
            ctx.restore();
            ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = '#ffa23a';
            for (var m = 0; m < lit.length; m++) {
                var d = lit[m], x1 = d[0] * cw - d[2] * sw, z1 = d[0] * sw + d[2] * cw, z2 = d[1] * sp + z1 * cp; if (z2 < 0.02) continue; var y2 = d[1] * cp - z1 * sp, sd = -.5 * x1 + .4 * y2 + .7 * z2;
                ctx.globalAlpha = (.18 + d[3] * .75) * (sd < .25 ? 1 : .3) * (.4 + .6 * z2); var zz = (1.1 + d[3] * 1.7) * dpr; ctx.fillRect(cx + x1 * R - zz / 2, cy - y2 * R - zz / 2, zz, zz)
            }
            ctx.restore();
            ctx.strokeStyle = 'rgba(150,205,255,.35)'; ctx.lineWidth = 1.4 * dpr; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
        }
        hit = []; var items = [];
        C.forEach(function (c, i) { var p = xyz(c[1], c[2]), q = rot(p); if (q[2] < -0.02) return; items.push([i, q, p]) });
        items.sort(function (a, b) { return a[1][2] - b[1][2] });
        items.forEach(function (it) {
            var i = it[0], c = C[i], p = it[2], q = it[1], h = 0.04 + Math.max(0, c[3] - 30) / 50 * 0.22, q2 = rot([p[0] * (1 + h), p[1] * (1 + h), p[2] * (1 + h)]);
            var bx = cx + q[0] * R, by = cy - q[1] * R, tx = cx + q2[0] * R, ty = cy - q2[1] * R, cl = lvlCol(c[3]), on = i === sel || i === hov, pulse = (Math.sin(t * 0.07 + i) + 1) / 2;
            ctx.globalAlpha = .3 + .3 * pulse; ctx.fillStyle = cl; ctx.beginPath(); ctx.arc(bx, by, (6 + c[3] / 9) * dpr * (0.5 + 0.5 * q[2]), 0, 7); ctx.fill();
            ctx.globalAlpha = 1; ctx.shadowColor = cl; ctx.shadowBlur = 10 * dpr; ctx.strokeStyle = cl; ctx.lineWidth = (on ? 4 : 2.8) * dpr; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke();
            ctx.fillStyle = cl; ctx.beginPath(); ctx.arc(tx, ty, (on ? 6 : 4) * dpr, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
            if (on) {
                ctx.strokeStyle = col['--ink']; ctx.lineWidth = 1.5 * dpr; ctx.beginPath(); ctx.arc(tx, ty, (8 + 2 * pulse) * dpr, 0, 7); ctx.stroke();
                ctx.shadowColor = '#000'; ctx.shadowBlur = 6 * dpr; ctx.fillStyle = col['--ink']; ctx.font = '600 ' + 13 * dpr + 'px Lexend,system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillText(c[0], tx, ty - 14 * dpr); ctx.shadowBlur = 0
            }
            if (q[2] > 0.1) hit.push([i, tx / dpr, ty / dpr])
        });
        if (vis && !reduce) requestAnimationFrame(frame)
    }
    function redraw() { if (reduce || !vis) frame() }
    function select(i, go, quiet) {
        sel = i; var c = C[i]; document.getElementById('wName').textContent = c[0]; document.getElementById('wTag').textContent = c[6] + (c[4] ? ' · ' + c[4] + ' hours lost in rush hour per driver (2025)' : '');
        document.getElementById('wBar').style.width = Math.min(100, c[3] / 80 * 100) + '%'; document.getElementById('wLvl').textContent = 'Congestion level ' + c[3] + '% in 2025' + (c[5] ? ' · a 10 km drive takes ' + c[5] : '') + (function () { var m = window.PATHLY_MONTHLY && window.PATHLY_MONTHLY[c[0]]; if (!m) return ''; var a = m.y2025.slice(6).reduce(function (t, x) { return t + x }, 0) / 6; return ' · Jul–Dec 2025 average ' + a.toFixed(0) + '%' })();
        Array.prototype.forEach.call(document.querySelectorAll('#wList button'), function (b, k) { b.setAttribute('aria-pressed', k === i) });
        if (go) { var dy = ((c[2] * D - yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI; tw = { t0: t, y0: yaw, dy: dy, p0: pit, dp: Math.max(-1.1, Math.min(1.1, c[1] * D * 0.8)) - pit } } redraw(); if (!quiet && window.PATHLY_ON) window.PATHLY_ON(i)
    }
    window.PATHLY_PICK = function (i) { select(i, true, true) };

    function pt(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }
    function near(p) { var b = -1, bd = 22; hit.forEach(function (h) { var d = Math.hypot(h[1] - p[0], h[2] - p[1]); if (d < bd) { bd = d; b = h[0] } }); return b }
    cv.addEventListener('pointerdown', function (e) { drag = pt(e); moved = 0; tw = null; cv.setPointerCapture && cv.setPointerCapture(e.pointerId) });
    cv.addEventListener('pointermove', function (e) {
        var p = pt(e);
        if (drag) { var dx = p[0] - drag[0], dy = p[1] - drag[1]; moved += Math.abs(dx) + Math.abs(dy); yaw -= dx * 0.007; pit = Math.max(-1.2, Math.min(1.2, pit + dy * 0.007)); drag = p; redraw() }
        else { var n = near(p); if (n !== hov) { hov = n; cv.style.cursor = n > -1 ? 'pointer' : 'grab'; redraw() } }
    });
    cv.addEventListener('pointerup', function (e) { if (drag && moved < 6) { var n = near(pt(e)); if (n > -1) select(n, true) } drag = null });
    cv.addEventListener('pointerleave', function () { hov = -1; drag = null });
    window.addEventListener('resize', function () { size(); redraw() });
    document.getElementById('theme').addEventListener('click', function () { setTimeout(function () { colors(); redraw() }, 0) });
    if (window.IntersectionObserver) new IntersectionObserver(function (en) { var v = en[0].isIntersecting; if (v && !vis && !reduce) { vis = true; requestAnimationFrame(frame) } vis = v; }, { threshold: 0 }).observe(cv);
    function useGeo(g) {
        try {
            var rings = []; (g.features || []).forEach(function (f) {
                var ge = f.geometry; if (!ge) return;
                var pl = ge.type === 'Polygon' ? [ge.coordinates] : ge.type === 'MultiPolygon' ? ge.coordinates : [];
                pl.forEach(function (p) { var r = p[0]; if (r && r.length > 3) { var fl = []; for (var i = 0; i < r.length; i++)fl.push(r[i][0], r[i][1]); rings.push(fl) } })
            });
            if (rings.length < 60) return false; LAND = rings; WATER = []; LB = LAND.map(bbx); WB = []; rebuild(); if (gl) buildTextures(); redraw(); return true
        } catch (e) { return false }
    }
    (function () {
        var src = 'https://cdn.jsdelivr.net/npm/@amcharts/amcharts4-geodata@4.1.30/dist/script/worldLow.js';
        try {
            var sc = document.createElement('script'); sc.src = src; sc.async = true; sc.onload = function () { useGeo(window.am4geodata_worldLow) }; sc.onerror = function () { };
            (document.head || document.body).appendChild(sc)
        } catch (e) { }
    })();
    initGL(); colors(); size(); select(0, false); frame(); if (gl) setTimeout(function () { try { buildTextures() } catch (e) { console.log('texture error', e) } }, 80);
})();

(function () {
    var D = window.PATHLY_CITIES || []; if (!D.length) return;
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    function hc(l) { return 'hsl(' + Math.max(0, Math.min(50, (78 - l) * 1.4)) + ',95%,58%)' }
    var MON = window.PATHLY_MONTHLY || {}; function avg(a) { return a.reduce(function (t, x) { return t + x }, 0) / a.length }
    var L = document.getElementById('cList'), TB = document.getElementById('cRows');
    D.forEach(function (c, i) {
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
        b.innerHTML = '<i style="background:' + hc(c[3]) + '"></i>' + c[0] + '<em>' + c[3] + '%</em>'; b.onclick = function () { select(i) }; L.appendChild(b)
    });
    TB.innerHTML = D.map(function (c, i) { var m6 = MON[c[0]], cell = '-'; if (m6) { var a6 = avg(m6.y2025.slice(6)), b6 = avg(m6.y2024.slice(6)); cell = Math.round(a6) + '% <span style="color:' + (a6 > b6 ? '#ff6b6b' : '#3ddc97') + '">' + (a6 > b6 ? '▲' : '▼') + '</span>' } return '<tr data-i="' + i + '"><td>' + c[0] + '</td><td>' + c[3] + '%</td><td>' + (c[4] ? c[4] + ' h' : '-') + '</td><td>' + cell + '</td></tr>' }).join('');
    TB.onclick = function (e) { var tr = e.target.closest && e.target.closest('tr'); if (tr) select(+tr.dataset.i) };
    var mc = document.getElementById('cmon'), mx = mc.getContext('2d'), MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], curSel = 0;
    function drawMonth(i) {
        curSel = i; var c = D[i], m = MON[c[0]], w = mc.clientWidth || 600, h = 190, d = Math.min(2, window.devicePixelRatio || 1); mc.width = w * d; mc.height = h * d; mx.setTransform(d, 0, 0, d, 0, 0); mx.clearRect(0, 0, w, h);
        document.getElementById('cmT').textContent = 'Month by month: ' + c[0]; var cap = document.getElementById('cmC');
        if (!m) { mx.fillStyle = '#8392b8'; mx.font = '13px Lexend,sans-serif'; mx.textAlign = 'center'; mx.fillText('Monthly readings were not collected for this city.', w / 2, h / 2); cap.textContent = 'Monthly readings are available for: ' + Object.keys(MON).join(', ') + '.'; return }
        var mxv = Math.max.apply(null, m.y2025.concat(m.y2024)), top = Math.ceil((mxv + 4) / 20) * 20, L0 = 34, R0 = 8, T0 = 26, B0 = 24, gw = (w - L0 - R0) / 12;
        mx.fillStyle = 'rgba(255,154,46,.09)'; mx.fillRect(L0 + gw * 6, T0 - 10, gw * 6, h - T0 - B0 + 10); mx.fillStyle = '#ffb35c'; mx.font = '600 11px Lexend,sans-serif'; mx.textAlign = 'center'; mx.fillText('Latest 6 months', L0 + gw * 9, T0 - 1);
        mx.strokeStyle = 'rgba(120,140,200,.18)'; mx.lineWidth = 1; mx.fillStyle = '#8392b8'; mx.font = '10px Lexend,sans-serif'; mx.textAlign = 'right';
        for (var g = 0; g <= 4; g++) { var v = top * g / 4, y = T0 + (h - T0 - B0) * (1 - v / top); mx.beginPath(); mx.moveTo(L0, y); mx.lineTo(w - R0, y); mx.stroke(); mx.fillText(Math.round(v) + '%', L0 - 4, y + 3) }
        for (var k = 0; k < 12; k++) {
            var x = L0 + gw * k, bw = gw * .32, h1 = (h - T0 - B0) * m.y2024[k] / top, h2 = (h - T0 - B0) * m.y2025[k] / top, y0 = h - B0;
            mx.fillStyle = '#5b6b99'; mx.fillRect(x + gw * .15, y0 - h1, bw, h1); var gr = mx.createLinearGradient(0, y0 - h2, 0, y0); gr.addColorStop(0, '#ffb55c'); gr.addColorStop(1, '#a8530a'); mx.fillStyle = gr; mx.fillRect(x + gw * .15 + bw + 2, y0 - h2, bw, h2);
            mx.fillStyle = '#8392b8'; mx.textAlign = 'center'; mx.font = '10px Lexend,sans-serif'; mx.fillText(MO[k], x + gw / 2, h - 8);
            if (k >= 6) { mx.fillStyle = '#e6ecff'; mx.font = '600 10px Lexend,sans-serif'; mx.fillText(m.y2025[k], x + gw * .15 + bw + 2 + bw / 2, y0 - h2 - 4) }
        }
        var a = avg(m.y2025.slice(6)), b = avg(m.y2024.slice(6)), df = a - b;
        cap.textContent = 'Jul–Dec 2025 averaged ' + a.toFixed(1) + '% against ' + b.toFixed(1) + '% in the same months of 2024 (' + (df >= 0 ? '+' : '−') + Math.abs(df).toFixed(1) + ' points). Orange is 2025, grey is 2024. TomTom publishes the Index once a year, so December 2025 is the newest month available and 2026 months are not out yet.'
    }
    function mark(i) {
        drawMonth(i); Array.prototype.forEach.call(L.children, function (b, k) { b.setAttribute('aria-pressed', k === i) });
        Array.prototype.forEach.call(TB.children, function (tr, k) { tr.setAttribute('aria-selected', k === i) })
    }
    function select(i) { mark(i); if (window.PATHLY_PICK) window.PATHLY_PICK(i) }
    window.PATHLY_ON = mark;
    var B = D.filter(function (c) { return c[4] }).sort(function (a, b) { return b[4] - a[4] }), bc = document.getElementById('cbars'), bx = bc.getContext('2d'), gr = 1;
    function bars() {
        var n = B.length, h = n * 15 + 8, w = bc.clientWidth || 300, d = Math.min(2, window.devicePixelRatio || 1); bc.style.height = h + 'px'; bc.width = w * d; bc.height = h * d; bx.setTransform(d, 0, 0, d, 0, 0); bx.clearRect(0, 0, w, h);
        var rh = (h - 6) / n, left = 96, right = 40;
        B.forEach(function (c, i) {
            var y = i * rh + 4, bw = (w - left - right) * (c[4] / 200) * gr;
            bx.fillStyle = '#8392b8'; bx.font = '10.5px Lexend,sans-serif'; bx.textAlign = 'left'; bx.fillText(c[0], 0, y + rh / 2 + 1);
            var g = bx.createLinearGradient(left, 0, left + bw + 1, 0); g.addColorStop(0, '#a8530a'); g.addColorStop(1, '#ffb55c'); bx.fillStyle = g; bx.fillRect(left, y, bw, rh - 6);
            bx.fillStyle = '#e6ecff'; bx.fillText(c[4] + ' h', left + bw + 5, y + rh / 2 + 1)
        })
    }
    function run() {
        var k = document.querySelectorAll('.kpis b'), T = []; Array.prototype.forEach.call(k, function (el) { T.push(+el.dataset.k) });
        var t0 = null; function step(ts) {
            if (t0 === null) t0 = ts; var p = reduce ? 1 : Math.min(1, (ts - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
            Array.prototype.forEach.call(k, function (el, i) { var d = +el.dataset.d || 0, v = T[i] * e; el.textContent = (d ? v.toFixed(d) : Math.round(v).toLocaleString('en-US')) + (el.dataset.s || '') });
            gr = e; bars(); var gv = 75.9 * e; document.getElementById('gArc').setAttribute('stroke-dashoffset', 326.7 * (1 - gv / 100)); document.getElementById('gTxt').textContent = gv.toFixed(1) + '%';
            if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }
    window.addEventListener('resize', function () { bars(); drawMonth(curSel) });
    var started = false; function go() { if (started) return; started = true; run() }
    var kp = document.querySelector('.kpis');
    if (window.IntersectionObserver && kp) new IntersectionObserver(function (en) { if (en[0].isIntersecting) go() }, { threshold: .1 }).observe(kp); else go();
    mark(0); bars();
})();
