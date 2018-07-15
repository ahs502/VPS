var childProcess = require('child_process');

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

    /*
    config.nginx := {
        "http": {
            "test.ahs502.ir/some/path/": "http://localhost:8019/",
            "ide.ahs502.ir/": "http://localhost:8080/",
            "test.javabazmayesh.ir/": "http://localhost:50307/",
            "dev.javabazmayesh.ir/": "http://localhost:50304/",
            "ahs502.ir www.ahs502.ir": "http://localhost:8010/"
        },
        "https": {
            "demo.javabazmayesh.ir/": [
                "http://localhost:50309/",
                "/etc/letsencrypt/live/javabazmayesh.ir/privkey.pem",
                "/etc/letsencrypt/live/javabazmayesh.ir/fullchain.pem"
            ],
            "javabazmayesh.ir www.javabazmayesh.ir": [
                "http://localhost:50310/",
                "/etc/letsencrypt/live/javabazmayesh.ir/privkey.pem",
                "/etc/letsencrypt/live/javabazmayesh.ir/fullchain.pem"
            ]
        }
    }
    */

    var data = "";

    for (let domainCollection in config.nginx.http) {
        let serverName = domainCollection.indexOf('/') >= 0 ? domainCollection.slice(0, domainCollection.indexOf('/')) : domainCollection;
        let urlPath = domainCollection.indexOf('/') >= 0 ? domainCollection.slice(domainCollection.indexOf('/')) : '/';

        data +=
            "server {\n" +
            "    listen 80;\n" +
            "    server_name " + serverName + ";\n" +
            "    location " + urlPath + " {\n" +
            "        proxy_pass " + config.nginx.http[domainCollection] + ";\n" +
            "        proxy_http_version 1.1;\n" +
            "        proxy_set_header Upgrade $http_upgrade;\n" +
            "        proxy_set_header Connection 'upgrade';\n" +
            "        proxy_set_header Host $host;\n" +
            "        proxy_cache_bypass $http_upgrade;\n" +
            "        proxy_set_header X-Real-IP $remote_addr;\n" +
            "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n" +
            "        proxy_set_header X-Forwarded-Proto $scheme;\n" +
            "    }\n" +
            "}\n" +
            "\n";
    }

    for (let domainCollection in config.nginx.https) {
        let serverName = domainCollection.indexOf('/') >= 0 ? domainCollection.slice(0, domainCollection.indexOf('/')) : domainCollection;
        let urlPath = domainCollection.indexOf('/') >= 0 ? domainCollection.slice(domainCollection.indexOf('/')) : '/';
        let routeData = config.nginx.https[domainCollection];

        var publicKeyBase64EncodedFingerprint = childProcess.execSync('openssl x509 -pubkey < ' + routeData[2] + ' | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | base64')
            .toString().replace(/\r?\n|\r/g, '');

        data +=
            "server {\n" +
            "    listen 80;\n" +
            "    server_name " + serverName + ";\n" +
            "    return 301 https://$server_name$request_uri;\n" +
            "}\n" +
            "\n" +
            "server {\n" +
            "    listen 443 ssl;\n" +
            "    server_name " + serverName + ";\n" +
            "\n" +
            "    ssl_certificate_key " + routeData[1] + ";\n" +
            "    ssl_certificate " + routeData[2] + ";\n" +
            "\n" +
            "    ssl on;\n" +
            "    ssl_session_cache builtin:1000 shared:SSL:10m;\n" +
            "    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;\n" +
            "    ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;\n" +
            "    ssl_prefer_server_ciphers on;\n" +
            "\n" +
            "    location " + urlPath + " {\n" +
            "        proxy_pass " + routeData[0] + ";\n" +
            "        proxy_http_version 1.1;\n" +
            "        proxy_set_header Upgrade $http_upgrade;\n" +
            "        proxy_set_header Connection 'upgrade';\n" +
            "        proxy_set_header Host $host;\n" +
            "        proxy_cache_bypass $http_upgrade;\n" +
            "        proxy_set_header X-Real-IP $remote_addr;\n" +
            "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n" +
            "        proxy_set_header X-Forwarded-Proto $scheme;\n" +
            "        add_header X-Frame-Options DENY;\n" +
            "        add_header X-XSS-Protection \"1; mode=block\";\n" +
            "        add_header X-Content-Type-Options nosniff;\n" +
            // "        add_header Content-Security-Policy \"default-src 'self';\";\n" + // Managed within the app itself, because it's very application specific.
            "        add_header Public-Key-Pins 'pin-sha256=\"" + publicKeyBase64EncodedFingerprint + "\"; max-age=2592000';\n" +
            "        add_header Strict-Transport-Security \"max-age=31536000\" always;\n" +
            "    }\n" +
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

gulp.task('no-https', done => {
    Object.keys(config.nginx.https).forEach(httpsDomain => config.nginx.http[httpsDomain] = config.nginx.https[httpsDomain][0]);
    config.nginx.https = {};
    done();
});

gulp.task('ns', ['no-https', 'default']);

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
