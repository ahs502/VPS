#!/bin/bash

ENV=$1

ROOT=/root
CONFIG=$ROOT/VPS/sites/javab-azmayesh/config/config.${ENV}.js
VERSIONS=$ROOT/VPS/sites/javab-azmayesh/config/versions.json
FOLDER=$ROOT/sites/javab-azmayesh/${ENV}
SITE=$FOLDER/site
APP=ja-$ENV

pm2 stop --silent $APP
pm2 delete --silent $APP

if [ ! -d $SITE ]; then
    mkdir -p $FOLDER
    git clone git@github.com:ahs502/javab-azmayesh.git $SITE
fi

cd $SITE

git reset --hard HEAD
git clean -f
git pull origin master

VERSION=$(node -e "var fs = require('fs');
                   var versions = JSON.parse(fs.readFileSync('${VERSIONS}'));
                   var version = versions['${ENV}'];
                   console.log(version);")

if [ "$VERSION" == "latest" ]; then
    HASH=""
else
    # COMMIT=($(git log --grep $VERSION))
    # HASH=${COMMIT[1]}
    HASH=$(git log --branches=master -1 --pretty=format:'%H' --grep $VERSION)
    if [[ -z "${HASH// }" ]]; then
        echo ">>> VERSION ${VERSION} NOT FOUND"
    fi
fi

if [[ -z "${HASH// }" ]]; then
    # echo ERROR: Version $VERSION not found.
    # exit 1
    echo ">>> LATEST COMMIT"
    git checkout -f $(git log --branches=master -1 --pretty=format:'%H')
else
    echo ">>> VERSION ${VERSION}"
    git checkout -f $HASH
fi

sudo npm install

sed -i.bak 's|\/\*\sCOMMENT\sSTART\s\*\/|\/\*|g' $SITE/config.js
sed -i.bak 's|\/\*\sCOMMENT\sEND\s\*\/|\*\/|g' $SITE/config.js

node -e "var fs = require('fs');
         var conf = fs.readFileSync('${SITE}/config.js');
         var econf = fs.readFileSync('${CONFIG}');
         var ph = '/* ENVIRONMENT SPECIFIC CONFIG */';
         conf = conf.slice(0, conf.indexOf(ph)) + econf + conf.slice(conf.indexOf(ph) + ph.length);
         fs.writeFileSync('${SITE}/config.js', conf);"

pm2 start $SITE/bin/start -n $APP
pm2 save

echo " => Finished deploying JavabAzmayesh in ${ENV} environment."
exit 0
