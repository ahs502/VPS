var gulp = require("gulp");
var util = require("gulp-util");
var concat = require('gulp-concat');
var gprint = require('gulp-print');
var merge = require("merge-stream");
var file = require("gulp-file");
var shell = require("gulp-shell");

/*var colors =*/
require('colors');

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

var config = require("./config");

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('bind9', callback => {
    var ip = config.serverIp || "11.22.33.44",
        dns = config.bind9 || {},
        named_conf_local = "",
        zone_db = {},
        mainDomain;

    for (var domain in dns) {
        mainDomain = mainDomain || domain;

        var domainConfig = dns[domain] = dns[domain] || {},
            ns = domainConfig.ns = domainConfig.ns || ["ns1"],
            mail = domainConfig.mail = domainConfig.mail || "mail",
            root = domainConfig.root = domainConfig.root || "host",
            subdomains = domainConfig.subdomains = domainConfig.subdomains || ["www"],
            data = domainConfig.data = domainConfig.data || {};
        (subdomains.indexOf("www") < 0) && subdomains.push("www");
        (subdomains.indexOf(mail) < 0) && subdomains.push(mail);
        ns.forEach(ns0 => (subdomains.indexOf(ns0) < 0) && subdomains.push(ns0));
        data["www"] = data["www"] || "CNAME";

        var resolver = subdomain => {
            var res = data[subdomain] || "A";
            (res == "A") && (res = "A " + ip);
            (res == "CNAME") && (res = "CNAME " + domain + ".");
            return res;
        };

        named_conf_local +=
            'zone "' + domain + '" {\n' +
            '        type master;\n' +
            '        file "/etc/bind/zones/' + domain + '.db";\n' +
            '};\n' +
            '\n';

        var db =
            "$TTL 86400\n" +
            "@ IN SOA " + ns[0] + "." + domain + ". " + root + "." + domain + ". (\n" +
            "               2016032700 ; Serial\n" +
            "               7200       ; Refresh\n" +
            "               120        ; Retry\n" +
            "               2419200    ; Expire\n" +
            "               604800)    ; Default TTL\n" +
            "\n";
        ns.forEach(ns0 => db += domain + ". IN NS " + ns0 + "." + domain + ".\n");
        db +=
            "\n" +
            domain + ". IN MX 10 " + mail + "." + domain + ".\n" +
            domain + ". IN A " + ip + "\n" +
            "\n";
        subdomains.forEach(subdomain => db += subdomain + " IN " + resolver(subdomain) + "\n");
        zone_db[domain + ".db"] = db;
    }

    var reverseZone = ip.split('.').reverse().slice(1).join('.') + ".in-addr.arpa";

    named_conf_local +=
        'zone "' + reverseZone + '" {\n' +
        '        type master;\n' +
        '        file "/etc/bind/zones/rev.' + reverseZone + '";\n' +
        '};\n' +
        '\n';

    zone_db["rev." + reverseZone] =
        "$TTL 14400\n" +
        "@ IN SOA " + mainDomain + ". " + dns[mainDomain].root + "." + mainDomain + ". (\n" +
        "              2016032700 ; Serial\n" +
        "              28800      ;\n" +
        "              604800     ;\n" +
        "              604800     ;\n" +
        "              86400)     ;\n" +
        "\n" +
        "@ IN NS " + dns[mainDomain].ns[0] + "." + mainDomain + ".\n";

    //TODO: What about '/etc/resolv.conf' ? It needs some R&D !

    var streams = [file('named.conf.local', named_conf_local, {
            src: true
        })
        .pipe(gulp.dest('/etc/bind/'))
        .pipe(gprint(file => ' -> [' + 'bind9'.blue + '] ' + file + ' has been saved.'.green))
    ];

    for (var zoneFile in zone_db) {
        streams.push(file(zoneFile, zone_db[zoneFile], {
                src: true
            })
            .pipe(gulp.dest('/etc/bind/zones/'))
            .pipe(gprint(file => ' -> [' + 'bind9'.blue + '] ' + file + ' has been saved.'.green)));
    };

    return merge.apply(this, streams)
        .pipe(concat('dumb.file'))
        .pipe(shell([
            "./bin/bind9-zone-serial-update.sh",
            "/etc/init.d/bind9 restart"
        ], {
            quiet: true
        }))
        .on('end', () => {
            util.log(' => [' + 'bind9'.bold.blue + '] ' + 'Route servers have been set.'.green);
            util.log(' -> [' + 'bind9'.bold.blue + '] ' + 'Use the following commands to check the results :');
            util.log('            tail -f /var/log/syslog'.bold.cyan + '   It should contain no errors !'.gray);
            util.log('            nslookup '.bold.cyan + 'domain.ir'.cyan + '        Check domain zone for every domain,'.gray);
            util.log('            host '.bold.cyan + 'xx.xx.xx.xx'.cyan + '          Check reverse zone.'.gray);
        });
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('nginx', () => {
    util.log(" -> [" + 'nginx'.yellow + "] Configuring nginx on your server...");

    var data = "",
        routesAll = (config && config.nginx) || {},
        routes = {},
        domain;

    for (domain in routesAll) {
        var refinedDomain = (domain.slice(-1) != '/' ? (domain + '/') : domain)
        var domainName = refinedDomain.slice(0, refinedDomain.indexOf('/')).trim(),
            domainPath = refinedDomain.slice(refinedDomain.indexOf('/')).trim();
        routes[domainName] = routes[domainName] || {};
        routes[domainName][domainPath] = routesAll[domain];
    }

    for (domain in routes) {
        data +=
            "server {\n" +
            "    listen 80;\n" +
            "    server_name " + domain + ";\n";
        for (var route in routes[domain]) {
            data +=
                "    location " + (route => ((route.slice(-1) != "/") ? (route + "/") : route))((route.slice(0, 1) != "/") ? ("/" + route) : route) + " {\n" +
                "        proxy_pass " + (route => ((route.slice(-1) != "/") ? (route + "/") : route))(routes[domain][route]) + ";\n" +
                "        proxy_http_version 1.1;\n" +
                "        proxy_set_header Upgrade $http_upgrade;\n" +
                "        proxy_set_header Connection 'upgrade';\n" +
                "        proxy_set_header Host $host;\n" +
                "        proxy_cache_bypass $http_upgrade;\n" +
                "        proxy_set_header X-Real-IP $remote_addr;\n" +
                "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n" +
                "        proxy_set_header X-Forwarded-Proto $scheme;\n" +
                "    }\n";
        }
        data +=
            "}\n" +
            "\n";
    }

    return file('default', data, {
            src: true
        })
        .pipe(gulp.dest('/etc/nginx/sites-available/'))
        .pipe(shell([
            "sudo service nginx start",
            "sudo nginx -s reload"
        ], {
            quiet: true
        }))
        .on('end', () => util.log(' => [' + 'nginx'.bold.yellow + '] ' + 'Route servers have been set.'.green));
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('default', ['bind9', 'nginx']);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('help', callback => {

    //TODO: Upgrade help:

    // var help = [
    //     "=================================================".rainbow,
    //     "",
    //     " >> Usage: " + "gulp".bold + " to build, watch & start, or",
    //     "           " + "gulp COMMAND".bold,
    //     "",
    //     " COMMAND".bold + " can be:",
    //     "",
    //     "     clean       ".bold + "Cleans up public/dist folder",
    //     "     build       ".bold + "Builds all files",
    //     "     build-js    ".bold + "Builds javascript files",
    //     "     build-css   ".bold + "Builds stylesheet files",
    //     "     start       ".bold + "Starts Node.js express server",
    //     "     stop        ".bold + "Stops Node.js express server",
    //     "     watch       ".bold + "Watchs changes to source files to build",
    //     "",
    //     "=================================================".rainbow,
    // ];

    // help.forEach(line => process.stdout.write(line + '\n'));
    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//...

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\







































// gulp.task('start-1', callback => {
//     runSequence('build-app');
//     util.log(" => Type 'gulp help' for more information.".bold);
//     callback(); // Nothing !
// });

// //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

// gulp.task('start-2', ['start-1'], callback => {
//     runSequence('build-src');
//     util.log(" => Type 'gulp help' for more information.".bold);
//     callback(); // Nothing !
// });

// //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

// gulp.task('start-3', ['start-2'], callback => {
//     runSequence('start-node');
//     util.log(" => Type 'gulp help' for more information.".bold);
//     callback(); // Nothing !
// });

// //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

// gulp.task('start-4', ['start-3'], callback => {
//     runSequence('watch');
//     util.log(" => Type 'gulp help' for more information.".bold);
//     callback(); // Nothing !
// });

// //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

// gulp.task('start-5', ['start-4'], callback => {
//     runSequence('browser-sync');
//     util.log(" => Type 'gulp help' for more information.".bold);
//     callback(); // Nothing !
// });
