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
    long_user_access_key_expires_after: /*-*/ 24 * 7, // Hours
    /*-------------------------------------*/
    cryptr_key: /*-------------------------*/ "---InTheNameOfGOD---",
    /*-------------------------------------*/
    nik_sms_username: /*-------------------*/ "09337770720",
    nik_sms_password: /*-------------------*/ "nspassword",
    nik_sms_main_number: /*----------------*/ "50004545454545",
    /*-------------------------------------*/
    email_transporter_service: /*----------*/ 'gmail',
    email_transporter_username: /*---------*/ 'JavabAzmayesh.ArtinCo@gmail.com',
    email_transporter_password: /*---------*/ 'javabazmayesh',
    email_sender_display_name: /*----------*/ "Javab Azmayesh [DO NOT REPLY]",
    /*-------------------------------------*/
    google_recaptcha: /*-------------------*/ true,
    google_recaptcha_secret_key: /*--------*/ "6LexDAwUAAAAAP7U7z8YEIcI006D8KGajx3WtR31",
    google_recaptcha_public_key: /*--------*/ "6LexDAwUAAAAAPXalUBl6eGUWa3dz7PrXXa-a7EG",
    /*-------------------------------------*/
    telegram_bot_name: /*------------------*/ "@JavabAzmayeshBot",
    telegram_bot_api_token: /*-------------*/ "419687845:AAFEocIodRfrTCIrEYQKBohMVBWDcZdpo84",
    /*-------------------------------------*/
    enable_statistics: /*------------------*/ true,
    enable_sms_limits: /*------------------*/ true, // See: ./src/modules/sms.js >> smsLimits
    /*-------------------------------------*/
    zarinpal_merchant_code: /*-------------*/ "3261166c-6be0-11e7-8e75-005056a205be", // Empty to disable
    /*-------------------------------------*/
    post_price: /*-------------------------*/ 2000, // Tomans
    paper_post_price: /*-------------------*/ 4000, // Tomans
    /*-------------------------------------*/
    minified_app_sources: /*---------------*/ true,
    developer_modal: /*--------------------*/ false,
    /*-------------------------------------*/

};
