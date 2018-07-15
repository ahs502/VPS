var config = {

    /* Server IP address */
    serverIp: "176.9.194.237",

    // /*
    // Local port to run Node.js server on for development, 12345 by default.
    // NOTE:
    //     It should be the same for the project under development's port number.
    // */
    // port: 8081, // 5 ports will be reserved (from port to port + 4) when setting BrowserSync.

    /*
    Bind9 name server configurations.
    First domain will be used for reverse zone.
    By default we have :
        At least ["ns1"] for ns,
        "mail" for mail,
        "host" for root and
        at least ["www"] for subdomains.
        Also, we have "CNAME" for "www" subdomain by default.
    In data settings :
        "A" will become "A xx.xx.xx.xx" and
        "CNAME" will become "CNAME domain.ir" unless
        you specify IP or Domain name explicitly or
        you use something else instead.
    Default value for each subdomain in data is "A".
    */
    bind9: {

        "ahs502.ir": {
            // ns: ["ns1"],
            // mail: "mail",
            // root: "host",
            subdomains: [
                "www", "ide", "dev", "bs", "weinre", "test",
                "neo4j",
                "shop", "eco", "mn", "yad",
            ],
            // data: {
            //     "ns1": "A",
            //     "mail": "A",
            //     "www": "CNAME",
            //     "ide": "A",
            //     "test": "A",
            //     // ...
            // }
        },

        "javabazmayesh.ir": {
            subdomains: ["www", "dev", "test", "demo"]
        },

        "aipaco.ir": {
            subdomains: ["www", "test"]
        },

    },

    /*
    Nginx server configurations.
    You can proxy each domain (with any subdomains if you want) to a specified url.
    The acceptable format for http is :
        {
            "[subdomain].domain.ir[/some/path]": ((some where)),
            ...
            "[subdomain1].domain1.ir [[subdomain2].domain2.ir] [...]": ((some where else)),
            ...
        }
    and for https is :
        {
            "((some domain collection like above))":
            [
                ((some where)),
                "path/to/the/private/ssl/key",
                "path/to/the/public/ssl/certificate"
            ],
            ...
        }
    assuming ((some where)) is something like
        8080 or "8080" or (The host will be considered to be 'localhost' by default)
        "localhost:8080" or (The protocol will be considered to be 'http://' by default)
        "http://localhost:8080" or generally
        "http://hostname:port/some/path"
    NOTE:
        If you map 'domain.ir/zxc' to 'somewhereelse', then
        a request to 'domain.ir/zxc' will be redirected to 'somewhereelse/zxc' ('/zxc' will not be discarded) and
        a request to 'domain.ir/zxc/asd' will be redirected to 'somewhereelse/zxc/asd'.
        For 'domain.ir/some/path' it is the same to redirect it to 'somewhereelse' or 'somewhereelse/some/path'.
    NOTE:
        If you set just 'domain.ir' without any prefix or postfix, but do not set 'www.domain.ir' to anywhere,
        then 'www.domain.ir' will be set automatically to 'domain.ir' by default.
    */
    nginx: {

        http: {
            "ahs502.ir": 8010,
            "ide.ahs502.ir": 8080,
            "test.ahs502.ir": 8019,

            "neo4j.ahs502.ir": 7474,

            "shop.ahs502.ir": 6871,
            "eco.ahs502.ir": 6872,
            "mn.ahs502.ir": 6873,
            "yad.ahs502.ir": 6874,

            "dev.javabazmayesh.ir": 50304,
            "test.javabazmayesh.ir": 50307,

            "aipaco.ir": 18010,
            "test.aipaco.ir": 18019,
        },

        https: {
            "javabazmayesh.ir": [
                50310,
                "/etc/letsencrypt/live/javabazmayesh.ir/privkey.pem",
                "/etc/letsencrypt/live/javabazmayesh.ir/fullchain.pem"
            ],
            "demo.javabazmayesh.ir": [
                50309,
                "/etc/letsencrypt/live/javabazmayesh.ir/privkey.pem",
                "/etc/letsencrypt/live/javabazmayesh.ir/fullchain.pem"
            ],
        },

        // /*
        // BrowserSync global domain configuration.
        // All fields are optional.
        // NOTE:
        //     browserSync.dev must be the same as
        //     browserSync.developeOn for the project currently in development.
        // */
        // browserSync: {
        //     dev: "dev.javabazmayesh.ir", //: port + 1 & port + 2
        //     ui: "bs.ahs502.ir", //: port + 3
        //     weinre: "weinre.ahs502.ir", //: port + 4
        // }

    },

};

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

/*
Set all default values
*/

// config.port = config.port || process.env['PORT'] || 12345;

config.bind9 = config.bind9 || {};

config.nginx = config.nginx || {};
config.nginx.http = config.nginx.http || {};
config.nginx.https = config.nginx.https || {};

// config.nginx.browserSync = config.nginx.browserSync || {};
// config.nginx.browserSync.domains = config.nginx.browserSync.domains || {};
// config.nginx.browserSync.port = config.nginx.browserSync.port || (config.port + 1);

// if (config.nginx.browserSync.domains.dev) {
//     config.nginx[config.nginx.browserSync.domains.dev] = "http://localhost:" + config.nginx.browserSync.port;
//     config.nginx[config.nginx.browserSync.domains.dev + "/browser-sync/socket.io"] =
//         "http://localhost:" + (config.nginx.browserSync.port + 1) + "/browser-sync/socket.io/";
// }

// if (config.nginx.browserSync.domains.ui) {
//     config.nginx[config.nginx.browserSync.domains.ui] = "http://localhost:" + (config.nginx.browserSync.port + 2);
// }

// if (config.nginx.browserSync.domains.weinre) {
//     config.nginx[config.nginx.browserSync.domains.weinre] = "http://localhost:" + (config.nginx.browserSync.port + 3);
// }

var httpDomainCollections = Object.keys(config.nginx.http),
    httpDomains = httpDomainCollections
    .map(dd => dd.split(' ').filter(d => d != ''))
    .reduce((previousValue, currentValue, currentIndex, array) => previousValue.concat(currentValue), []);

var httpsDomainCollections = Object.keys(config.nginx.https),
    httpsDomains = httpsDomainCollections
    .map(dd => dd.split(' ').filter(d => d != ''))
    .reduce((previousValue, currentValue, currentIndex, array) => previousValue.concat(currentValue), []);

httpDomainCollections.forEach(domainCollection => {
    let des = String(config.nginx.http[domainCollection] || 80);
    if (des.indexOf(':') < 0) des = 'localhost:' + des;
    if (des.indexOf('://') < 0) des = 'http://' + des;
    if (des.slice(-1) !== '/') des += '/';
    config.nginx.http[domainCollection] = des;
});

httpsDomainCollections.forEach(domainCollection => {
    let arr = [].concat(config.nginx.https[domainCollection]);
    let des = String(arr[0] || 80);
    if (des.indexOf(':') < 0) des = 'localhost:' + des;
    if (des.indexOf('://') < 0) des = 'http://' + des;
    if (des.slice(-1) !== '/') des += '/';
    config.nginx.https[domainCollection] = [des, String(arr[1] || ''), String(arr[2] || '')];
});

for (let domain in config.bind9) {

    if ((httpDomains.indexOf(domain) >= 0) && !(httpDomains.indexOf("www." + domain) >= 0)) {
        httpDomainCollections.forEach(domainCollection => {
            if (domainCollection.split(' ').indexOf(domain) >= 0) {
                config.nginx.http[domainCollection + " www." + domain] = config.nginx.http[domainCollection];
                delete config.nginx.http[domainCollection];
            }
        });
    }

    if ((httpsDomains.indexOf(domain) >= 0) && !(httpsDomains.indexOf("www." + domain) >= 0)) {
        httpsDomainCollections.forEach(domainCollection => {
            if (domainCollection.split(' ').indexOf(domain) >= 0) {
                config.nginx.https[domainCollection + " www." + domain] = config.nginx.https[domainCollection];
                delete config.nginx.https[domainCollection];
            }
        });
    }

}

var routes = {};
Object.keys(config.nginx.http).forEach(domainCollection => {
    if (domainCollection.trim().indexOf(' ') < 0) {
        routes[domainCollection.split(' ').filter(d => d)
            .map(d => d.slice(-1) === '/' ? d : d + '/')
            .join(' ')] = config.nginx.http[domainCollection];
    }
    else {
        routes[domainCollection] = config.nginx.http[domainCollection];
    }
});
config.nginx.http = routes;

routes = {};
Object.keys(config.nginx.https).forEach(domainCollection => {
    if (domainCollection.trim().indexOf(' ') < 0) {
        routes[domainCollection.split(' ').filter(d => d)
            .map(d => d.slice(-1) === '/' ? d : d + '/')
            .join(' ')] = config.nginx.https[domainCollection];
    }
    else {
        routes[domainCollection] = config.nginx.https[domainCollection];
    }
});
config.nginx.https = routes;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

module.exports = config;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
