// JavabAzmayesh project configuration file
// Environment: DEMO

var config = {

    /*-------------------------------------*/
    env: /*--------------------------------*/ "demo",
    /*-------------------------------------*/
    port: /*-------------------------------*/ 50309,
    domain: /*-----------------------------*/ "demo.javabazmayesh.ir",
    /*-------------------------------------*/
    protocol: /*---------------------------*/ "https",
    private_key_path: /*-------------------*/ "/etc/letsencrypt/live/javabazmayesh.ir/privkey.pem",
    certificate_path: /*-------------------*/ "/etc/letsencrypt/live/javabazmayesh.ir/fullchain.pem",
    /*-------------------------------------*/
    storage_path: /*-----------------------*/ "/root/sites/javab-azmayesh/demo/data",
    upload_path: /*------------------------*/ "/root/sites/javab-azmayesh/demo/files",
    /*-------------------------------------*/
    confirmation_expires_after: /*---------*/ 10, // Hours
    user_access_key_expires_after: /*------*/ 24, // Hours
    /*-------------------------------------*/
    cryptr_key: /*-------------------------*/ "- demo 1234567890 cryptr key -",
    /*-------------------------------------*/
    nik_sms_username: /*-------------------*/ "09337770720",
    nik_sms_password: /*-------------------*/ "nspassword",
    nik_sms_main_number: /*----------------*/ "50004545454545",
    /*-------------------------------------*/
    email_transporter_service: /*----------*/ 'gmail',
    email_transporter_username: /*---------*/ 'ahs502@gmail.com',
    email_transporter_password: /*---------*/ 'gpassword',
    email_sender_display_name: /*----------*/ "Javab Azmayesh [DO NOT REPLY]",
    /*-------------------------------------*/
    google_recaptcha: /*-------------------*/ true,
    google_recaptcha_secret_key: /*--------*/ "6LexDAwUAAAAAP7U7z8YEIcI006D8KGajx3WtR31",
    google_recaptcha_public_key: /*--------*/ "6LexDAwUAAAAAPXalUBl6eGUWa3dz7PrXXa-a7EG",
    /*-------------------------------------*/
    telegram_bot_name: /*------------------*/ "@JaDemoBot",
    telegram_bot_api_token: /*-------------*/ "445086538:AAEzR_D7YqSQHU3mswLJXGmZl3qL-aD5HLU",
    /*-------------------------------------*/
    enable_statistics: /*------------------*/ true,
    enable_sms_limits: /*------------------*/ true, // See: ./src/modules/sms.js >> smsLimits
    /*-------------------------------------*/
    minified_app_sources: /*---------------*/ false,
    developer_modal: /*--------------------*/ true,
    /*-------------------------------------*/
    post_price: /*-------------------------*/ 1000, // Tomans
    /*-------------------------------------*/

};
