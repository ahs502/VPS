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
    email_transporter_service: /*----------*/ 'gmail',
    email_transporter_username: /*---------*/ 'ahs502@gmail.com',
    email_transporter_password: /*---------*/ 'gpassword',
    email_sender_display_name: /*----------*/ "(TEST) Javab Azmayesh [DO NOT REPLY]",
    /*-------------------------------------*/
    google_recaptcha: /*-------------------*/ true,
    google_recaptcha_secret_key: /*--------*/ "6LexDAwUAAAAAP7U7z8YEIcI006D8KGajx3WtR31",
    google_recaptcha_public_key: /*--------*/ "6LexDAwUAAAAAPXalUBl6eGUWa3dz7PrXXa-a7EG",
    /*-------------------------------------*/
    telegram_bot_name: /*------------------*/ "@JaTestBot",
    telegram_bot_api_token: /*-------------*/ "397071034:AAHUF403bate7MF9Mo0Zvn78jKRf2Z6wHSI",
    /*-------------------------------------*/
    enable_statistics: /*------------------*/ false,
    enable_sms_limits: /*------------------*/ true, // See: ./src/modules/sms.js >> smsLimits
    /*-------------------------------------*/
    minified_app_sources: /*---------------*/ false,
    developer_modal: /*--------------------*/ true,
    /*-------------------------------------*/
    post_price: /*-------------------------*/ 1000, // Tomans
    /*-------------------------------------*/

};
