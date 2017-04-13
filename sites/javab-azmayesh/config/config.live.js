// JavabAzmayesh project configuration file
// Environment: LIVE

var config = {

    /*-------------------------------------*/
    env: /*--------------------------------*/ "live",
    /*-------------------------------------*/
    port: /*-------------------------------*/ 50310,
    domain: /*-----------------------------*/ "javabazmayesh.ir",
    /*-------------------------------------*/
    protocol: /*---------------------------*/ "https",
    private_key_path: /*-------------------*/ "/etc/letsencrypt/live/javabazmayesh.ir/privkey.pem",
    certificate_path: /*-------------------*/ "/etc/letsencrypt/live/javabazmayesh.ir/fullchain.pem",
    /*-------------------------------------*/
    storage_path: /*-----------------------*/ "/root/sites/javab-azmayesh/live/data",
    upload_path: /*------------------------*/ "/root/sites/javab-azmayesh/live/files",
    /*-------------------------------------*/
    confirmation_expires_after: /*---------*/ 10, // Hours
    user_access_key_expires_after: /*------*/ 24, // Hours
    /*-------------------------------------*/
    cryptr_key: /*-------------------------*/ "---InTheNameOfGOD---",
    /*-------------------------------------*/
    nik_sms_username: /*-------------------*/ "09337770720",
    nik_sms_password: /*-------------------*/ "nspassword",
    nik_sms_main_number: /*----------------*/ "50004545454545",
    /*-------------------------------------*/
    google_recaptcha: /*-------------------*/ true,
    google_recaptcha_secret_key: /*--------*/ "6LexDAwUAAAAAP7U7z8YEIcI006D8KGajx3WtR31",
    google_recaptcha_public_key: /*--------*/ "6LexDAwUAAAAAPXalUBl6eGUWa3dz7PrXXa-a7EG",
    /*-------------------------------------*/
    enable_statistics: /*------------------*/ true,
    enable_sms_limits: /*------------------*/ true, // See: ./src/modules/sms.js >> smsLimits
    /*-------------------------------------*/

};
