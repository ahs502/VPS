// JavabAzmayesh project configuration file
// Environment: TEST

var config = {

    /*-------------------------------------*/
    env: /*--------------------------------*/ "test",
    /*-------------------------------------*/
    port: /*-------------------------------*/ 50307,
    domain: /*-----------------------------*/ "test.javabazmayesh.ir",
    /*-------------------------------------*/
    protocol: /*---------------------------*/ "http",
    private_key_path: /*-------------------*/ "",
    certificate_path: /*-------------------*/ "",
    /*-------------------------------------*/
    storage_path: /*-----------------------*/ "/root/sites/javab-azmayesh/test/data",
    upload_path: /*------------------------*/ "/root/sites/javab-azmayesh/test/files",
    /*-------------------------------------*/
    confirmation_expires_after: /*---------*/ 1, // Hours
    user_access_key_expires_after: /*------*/ 1, // Hours
    /*-------------------------------------*/
    cryptr_key: /*-------------------------*/ "- test 1234567890 cryptr key -",
    /*-------------------------------------*/
    nik_sms_username: /*-------------------*/ "09337770720",
    nik_sms_password: /*-------------------*/ "nspassword",
    nik_sms_main_number: /*----------------*/ "50004545454545",
    /*-------------------------------------*/
    google_recaptcha: /*-------------------*/ true,
    google_recaptcha_secret_key: /*--------*/ "6LexDAwUAAAAAP7U7z8YEIcI006D8KGajx3WtR31",
    google_recaptcha_public_key: /*--------*/ "6LexDAwUAAAAAPXalUBl6eGUWa3dz7PrXXa-a7EG",
    /*-------------------------------------*/
    enable_statistics: /*------------------*/ false,
    enable_sms_limits: /*------------------*/ true, // See: ./src/modules/sms.js >> smsLimits
    /*-------------------------------------*/

};
