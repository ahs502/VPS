var config = {

    /* Server IP address */
    serverIp: "176.9.194.237",

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
            subdomains: ["www", "ide", "dev", "bs", "weinre", "test"],
            // data: {
            //     "ns1": "A",
            //     "mail": "A",
            //     "www": "CNAME",
            //     "ide": "A",
            //     "test": "A",
            //     // ...
            // }
        },

        "hesamhesab.ir": {
            subdomains: ["www", "ide", "dev", "bs", "weinre", "test"]
        },

        "mehrnoosh72.ir": {
            subdomains: ["www", "ide", "dev", "bs", "weinre", "test"]
        },

        "minush.ir": {
            subdomains: ["www", "ide", "dev", "bs", "weinre", "test"]
        },

    },

    /*
    Nginx server configurations.
    You can proxy each domain (with any subdomains if you want) to a specified url.
    The acceptable format is :
        {
            "[subdomain].domain.ir[/some/path]": "somewhereelse1",
            ...
            "[subdomain1].domain1.ir [subdomain2].domain2.ir[/some/path1] [subdomain3].domain3.ir[/some/path2]": "somewhereelse2",
            ...
        }
    where "somewhereelse" is something like 
        "http://localhost:8081" or
        "http://localhost:8082/some/path/" (It is better when ends by '/').
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

        "ahs502.ir": "http://localhost:8010",
        "test.ahs502.ir": "http://localhost:8019",
        "ide.ahs502.ir": "http://localhost:8080",

        "hesamhesab.ir": "http://localhost:8020",
        "test.hesamhesab.ir": "http://localhost:8029",
        "ide.hesamhesab.ir": "http://localhost:8080",

        "mehrnoosh72.ir": "http://localhost:8030",
        "test.mehrnoosh72.ir": "http://localhost:8039",
        "ide.mehrnoosh72.ir": "http://localhost:8080",

        "minush.ir": "http://localhost:8040",
        "test.minush.ir": "http://localhost:8049",
        "ide.minush.ir": "http://localhost:8080",

        /*
        browser-sync domain settings.
        All fields are optional.
        */
        browserSync: {

            dev: "dev.ahs502.ir", //: port & port + 1
            ui: "bs.ahs502.ir", //: port + 2
            weinre: "weinre.ahs502.ir", //: port + 3

            port: null, // By default = (process.env['PORT'] || 12345) + 1

        }

    },

};

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

/*
Set all default values
*/

config.bind9 = config.bind9 || {};

config.nginx = config.nginx || {};

config.nginx.browserSync = config.nginx.browserSync || {};
config.nginx.browserSync.domains = config.nginx.browserSync.domains || {};
config.nginx.browserSync.port = config.nginx.browserSync.port || ((process.env['PORT'] || 12345) + 1);

if (config.nginx.browserSync.domains.dev) {
    config.nginx[config.nginx.browserSync.domains.dev] = "http://localhost:" + config.nginx.browserSync.port;
    config.nginx[config.nginx.browserSync.domains.dev + "/browser-sync/socket.io"] =
        "http://localhost:" + (config.nginx.browserSync.port + 1) + "/browser-sync/socket.io/";
}

if (config.nginx.browserSync.domains.ui) {
    config.nginx[config.nginx.browserSync.domains.ui] = "http://localhost:" + (config.nginx.browserSync.port + 2);
}

if (config.nginx.browserSync.domains.weinre) {
    config.nginx[config.nginx.browserSync.domains.weinre] = "http://localhost:" + (config.nginx.browserSync.port + 3);
}

var allDomains = Object.keys(config.nginx)
    .filter(dd => dd != 'browserSync')
    .map(dd => dd.split(' ').filter(d => d != ''))
    .reduce((previousValue, currentValue, currentIndex, array) => previousValue.concat(currentValue), []),
    domain, domainKey;

for (domain in config.bind9) {
    if ((allDomains.indexOf(domain) >= 0) && !(allDomains.indexOf("www." + domain) >= 0)) {
        for (domainKey in config.nginx) {
            if (domainKey.split(' ').indexOf(domain) >= 0) {
                config.nginx[domainKey + " www." + domain] = config.nginx[domainKey];
                delete config.nginx[domainKey];
                break;
            }
        }
    }
}

delete config.nginx.browserSync;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

module.exports = config;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
