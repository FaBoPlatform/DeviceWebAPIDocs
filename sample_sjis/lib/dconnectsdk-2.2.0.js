/**
 @preserve Device Connect SDK Library v2.2.0
 Copyright (c) 2017 NTT DOCOMO,INC.
 Released under the MIT license
 http://opensource.org/licenses/mit-license.php
 */

/**
 * @file
 */

/**
 * @class dConnect
 * @classdesc Device Connect
 */
var dConnect = (function(parent, global) {
  'use strict';
  var XMLHttpRequest;

  if (global.self) {
    XMLHttpRequest = global.XMLHttpRequest;
  } else if (global.process) {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
  }

  /**
   * ���̃E�F�u�R���e���c��Device Device Connect Manager�Ƃ���肷��ׂɗp����g�[�N���B
   */
  var webAppAccessToken;
  /**
   * HTTP�����WebSocket�ʐM��SSL���g�p���邩�ǂ������w�肷��t���O.
   * @private
   * @type {Boolean}
   * @default false
   * @see setSSLEnabled
   */
  var sslEnabled = false;
  /**
   * Manager�N���pURI�X�L�[���̖��O.
   * @private
   * @type {String}
   * @default gotapi
   * @see setURISchemeName
   */
  var uriSchemeName = 'gotapi';
  /**
   * �z�X�g��.
   * @private
   * @type {String}
   * @default localhost
   * @see setHost
   */
  var host = 'localhost';
  /**
   * �|�[�g�ԍ�.
   * @private
   * @type {String}
   * @default 4035
   * @see setPort
   */
  var port = '4035';
  /**
   * �n�C�u���b�h�A�v���Ƃ��ẴI���W��.
   * @private
   * @type {String}
   * @see setExtendedOrigin
   */
  var extendedOrigin;
  /**
   * �C�x���g�ʒm�p�̃��X�i�[���i�[����I�u�W�F�N�g.
   * @type {Object}
   * @private
   * @see addEventListener
   * @see removeEventListener
   */
  var eventListener = {};

  /**
   * WebSocket�̃C���X�^���X.
   */
  var websocket;

  /**
   * WebSocket���J���Ă��邩�ǂ����������t���O.
   * 
   * ����: �J���Ă���ꍇ�ł��AisEstablishedWebSocket��false�̏ꍇ�́A
   * �C�x���g����M�ł��Ȃ�.
   */
  var isOpenedWebSocket = false;
  /**
   * WebSocket�ŃC�x���g����M�\�ȏ�Ԃł��邩�ǂ����������t���O.
   */
  var isEstablishedWebSocket = false;
  /**
   * WebSocket���Đڑ�����^�C�}�[.
   */
  var reconnectingTimerId;

  /**
   * HMAC�ɂ��T�[�o�F�؂��s�����ǂ����̃t���O.
   */
  var _isEnabledAntiSpoofing = false;

  /**
   * �A�v���P�[�V��������T�[�o�̋N���v���𑗐M�������ǂ����̃t���O.
   */
  var _isStartedManager = false;

  /**
   * Device Connect Manager�̋N���ʒm����M���郊�X�i�[.
   */
  var _launchListener = function() {
  };

  /**
   * ���ݐݒ肳��Ă���HMAC�����L�[.
   * �󕶎��̏ꍇ�̓��X�|���X��HMAC�����؂��Ȃ�.
   */
  var _currentHmacKey = '';

  /**
   * Device Connect Manager�֑��M���郊�N�G�X�g��nonce�̒���. �P�ʂ̓o�C�g.
   */
  var NONCE_BYTES = 16;

  /**
   * Device Connect Manager�֑��M����HMAC�����L�[�̒���. �P�ʂ̓o�C�g.
   */
  var HMAC_KEY_BYTES = 16;

  /**
   * �n�C�u���b�h�A�v���̃I���W�����w�肷�郊�N�G�X�g�w�b�_��.
   */
  var HEADER_EXTENDED_ORIGIN = "X-GotAPI-Origin";

  // ============================================
  //             Public
  // ============================================

  /**
   * Device Connect�ŗp������萔.
   * @memberOf dConnect
   * @namespace
   * @type {Object.<String, (Number|Object)>}
   */
  var constants = {
    /**
     * Device Connect����̏������ʂŐ�����\���萔.
     * @const
     * @type {Number}
     */
    RESULT_OK: 0,
    /**
     * Device Connect����̏������ʂŎ��s��\���萔.
     * @const
     * @type {Number}
     */
    RESULT_ERROR: 1,

    /**
     * �G���[�R�[�h���`����񋓌^.
     * @readonly
     * @enum {Number}
     */
    ErrorCode: {
      /** �G���[�R�[�h: Device Connect�ւ̃A�N�Z�X�Ɏ��s����. */
      ACCESS_FAILED: -1,
      /** �G���[�R�[�h: �s���ȃT�[�o����̃��X�|���X����M����. */
      INVALID_SERVER: -2,
      /** �G���[�R�[�h: �����s���̃G���[. */
      UNKNOWN: 1,
      /** �G���[�R�[�h: �T�|�[�g����Ă��Ȃ��v���t�@�C���ɃA�N�Z�X���ꂽ. */
      NOT_SUPPORT_PROFILE: 2,
      /** �G���[�R�[�h: �T�|�[�g����Ă��Ȃ��A�N�V�������w�肳�ꂽ. */
      NOT_SUPPORT_ACTION: 3,
      /** �G���[�R�[�h: �T�|�[�g����Ă��Ȃ������E�C���^�[�t�F�[�X���w�肳�ꂽ. */
      NOT_SUPPORT_ATTRIBUTE: 4,
      /** �G���[�R�[�h: serviceId���ݒ肳��Ă��Ȃ�. */
      EMPTY_SERVICE_ID: 5,
      /** �G���[�R�[�h: �T�[�r�X�������ł��Ȃ�����. */
      NOT_FOUND_SERVICE: 6,
      /** �G���[�R�[�h: �^�C���A�E�g����������. */
      TIMEOUT: 7,
      /** �G���[�R�[�h: ���m�̑����E�C���^�[�t�F�[�X�ɃA�N�Z�X���ꂽ. */
      UNKNOWN_ATTRIBUTE: 8,
      /** �G���[�R�[�h: �o�b�e���[�ቺ�ő���s�\. */
      LOW_BATTERY: 9,
      /** �G���[�R�[�h: �s���ȃp�����[�^����M����. */
      INVALID_REQUEST_PARAMETER: 10,
      /** �G���[�R�[�h: �F�؃G���[. */
      AUTHORIZATION: 11,
      /** �G���[�R�[�h: �A�N�Z�X�g�[�N���̗L�������؂�. */
      EXPIRED_ACCESS_TOKEN: 12,
      /** �G���[�R�[�h: �A�N�Z�X�g�[�N�����ݒ肳��Ă��Ȃ�. */
      EMPTY_ACCESS_TOKEN: 13,
      /** �G���[�R�[�h: �X�R�[�v�O�ɃA�N�Z�X�v�����Ȃ��ꂽ. */
      SCOPE: 14,
      /** �G���[�R�[�h: �F�؎���clientId�������ł��Ȃ�����. */
      NOT_FOUND_CLIENT_ID: 15,
      /** �G���[�R�[�h: �f�o�C�X�̏�Ԉُ�G���[. */
      ILLEGAL_DEVICE_STATE: 16,
      /** �G���[�R�[�h: �T�[�o�̏�Ԉُ�G���[. */
      ILLEGAL_SERVER_STATE: 17,
      /** �G���[�R�[�h: �s���I���W���G���[. */
      INVALID_ORIGIN: 18,
      /** �G���[�R�[�h: �s��URL�G���[. */
      INVALID_URL: 19,
      /** �G���[�R�[�h: �s��Profile�G���[. */
      INVALID_PROFILE: 20

    },

    /**
     * Device Connect�̊e��萔.
     * @namespace
     * @type {Object.<String, String>}
     */
    common: {
      /** ���ʃp�����[�^: action�B*/
      PARAM_ACTION: 'action',
      /** ���ʃp�����[�^: serviceId�B */
      PARAM_SERVICE_ID: 'serviceId',
      /** ���ʃp�����[�^: pluginId�B */
      PARAM_PLUGIN_ID: 'pluginId',
      /** ���ʃp�����[�^: profile�B */
      PARAM_PROFILE: 'profile',
      /** ���ʃp�����[�^: interface�B */
      PARAM_INTERFACE: 'interface',
      /** ���ʃp�����[�^: attribute�B */
      PARAM_ATTRIBUTE: 'attribute',
      /** ���ʃp�����[�^: sessionKey�B */
      PARAM_SESSION_KEY: 'sessionKey',
      /** ���ʃp�����[�^: accessToken�B */
      PARAM_ACCESS_TOKEN: 'accessToken',
      /** ���ʃp�����[�^: websocket�B */
      PARAM_WEB_SOCKET: 'websocket',
      /** ���ʃp�����[�^: result�B */
      PARAM_RESULT: 'result',
      /** ���ʃp�����[�^: errorCode�B */
      PARAM_ERROR_CODE: 'errorCode',
      /** ���ʃp�����[�^: errorMessage�B */
      PARAM_ERROR_MESSAGE: 'errorMessage'
    },

    /**
     * Authorization�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    authorization: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'authorization',

      // Atttribute
      /** �A�g���r���[�g: grant�B*/
      ATTR_GRANT: 'grant',
      /** �A�g���r���[�g: accesstoken�B */
      ATTR_ACCESS_TOKEN: 'accesstoken',

      // Parameter
      /** �p�����[�^: clientId�B */
      PARAM_CLIENT_ID: 'clientId',
      /** �p�����[�^: scope�B */
      PARAM_SCOPE: 'scope',
      /** �p�����[�^: scopes�B */
      PARAM_SCOPES: 'scopes',
      /** �p�����[�^: applicationName�B */
      PARAM_APPLICATION_NAME: 'applicationName',
      /** �p�����[�^: accessToken�B */
      PARAM_ACCESS_TOKEN: 'accessToken',
      /** �p�����[�^: expirePeriod�B */
      PARAM_EXPIRE_PERIOD: 'expirePeriod',
      /** �p�����[�^: expire�B */
      PARAM_EXPIRE: 'expire',
    },

    /**
     * Availability�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    availability: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'availability'
    },

    /**
     * Battery�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    battery: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'battery',

      // Atttribute
      /** �A�g���r���[�g: charging */
      ATTR_CHARGING: 'charging',
      /** �A�g���r���[�g: chargingTime */
      ATTR_CHARGING_TIME: 'chargingTime',
      /** �A�g���r���[�g: dischargingTime */
      ATTR_DISCHARGING_TIME: 'dischargingTime',
      /** �A�g���r���[�g: level */
      ATTR_LEVEL: 'level',
      /** �A�g���r���[�g: onchargingchange */
      ATTR_ON_CHARGING_CHANGE: 'onchargingchange',
      /** �A�g���r���[�g: onbatterychange */
      ATTR_ON_BATTERY_CHANGE: 'onbatterychange',

      // Parameter
      /** �p�����[�^: charging */
      PARAM_CHARGING: 'charging',
      /** �p�����[�^: chargingTime */
      PARAM_CHARGING_TIME: 'chargingTime',
      /** �p�����[�^: dischargingTime */
      PARAM_DISCHARGING_TIME: 'dischargingTime',
      /** �p�����[�^: level */
      PARAM_LEVEL: 'level',
      /** �p�����[�^: battery */
      PARAM_BATTERY: 'battery',
    },

    /**
     * Connection�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    connection: {
      // Profile Name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'connection',

      // Interface
      /** �C���^�[�t�F�[�X: bluetooth */
      INTERFACE_BLUETOOTH: 'bluetooth',

      // Attribute
      /** �A�g���r���[�g: wifi */
      ATTR_WIFI: 'wifi',
      /** �A�g���r���[�g: bluetooth */
      ATTR_BLUETOOTH: 'bluetooth',
      /** �A�g���r���[�g: discoverable */
      ATTR_DISCOVERABLE: 'discoverable',
      /** �A�g���r���[�g: ble */
      ATTR_BLE: 'ble',
      /** �A�g���r���[�g: nfc */
      ATTR_NFC: 'nfc',
      /** �A�g���r���[�g: onwifichange */
      ATTR_ON_WIFI_CHANGE: 'onwifichange',
      /** �A�g���r���[�g: onbluetoothchange */
      ATTR_ON_BLUETOOTH_CHANGE: 'onbluetoothchange',
      /** �A�g���r���[�g: onblechange */
      ATTR_ON_BLE_CHANGE: 'onblechange',
      /** �A�g���r���[�g: onnfcchange */
      ATTR_ON_NFC_CHANGE: 'onnfcchange',

      // Parameter
      /** �p�����[�^: enable */
      PARAM_ENABLE: 'enable',
      /** �p�����[�^: connectStatus */
      PARAM_CONNECT_STATUS: 'connectStatus'
    },

    /**
     * Device Orientation�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    device_orientation: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'deviceorientation',

      // Attribute
      /** �A�g���r���[�g: ondeviceorientation */
      ATTR_ON_DEVICE_ORIENTATION: 'ondeviceorientation',

      // Parameter
      /** �p�����[�^: orientation */
      PARAM_ORIENTATION: 'orientation',
      /** �p�����[�^: acceleration */
      PARAM_ACCELERATION: 'acceleration',
      /** �p�����[�^: x */
      PARAM_X: 'x',
      /** �p�����[�^: y */
      PARAM_Y: 'y',
      /** �p�����[�^: z */
      PARAM_Z: 'z',
      /** �p�����[�^: rotationRate */
      PARAM_ROTATION_RATE: 'rotationRate',
      /** �p�����[�^: alpha */
      PARAM_ALPHA: 'alpha',
      /** �p�����[�^: beta */
      PARAM_BETA: 'beta',
      /** �p�����[�^: gamma */
      PARAM_GAMMA: 'gamma',
      /** �p�����[�^: interval */
      PARAM_INTERVAL: 'interval',
      /** �p�����[�^: accelerationIncludingGravity */
      PARAM_ACCELERATION_INCLUDEING_GRAVITY: 'accelerationIncludingGravity'
    },


    /**
     * File�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    file: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'file',

      // Attribute
      /** �A�g���r���[�g: list */
      ATTR_LIST: 'list',
      /** �A�g���r���[�g: directory */
      ATTR_DIRECTORY: 'directory',

      // Parameter
      /** �p�����[�^: mimeType */
      PARAM_MIME_TYPE: 'mimeType',
      /** �p�����[�^: fileName */
      PARAM_FILE_NAME: 'fileName',
      /** �p�����[�^: fileSize */
      PARAM_FILE_SIZE: 'fileSize',
      /** �p�����[�^: media */
      PARAM_MEDIA: 'media',
      /** �p�����[�^: path */
      PARAM_PATH: 'path',
      /** �p�����[�^: fileType */
      PARAM_FILE_TYPE: 'fileType',
      /** �p�����[�^: order */
      PARAM_ORDER: 'order',
      /** �p�����[�^: offset */
      PARAM_OFFSET: 'offset',
      /** �p�����[�^: limit */
      PARAM_LIMIT: 'limit',
      /** �p�����[�^: count */
      PARAM_COUNT: 'count',
      /** �p�����[�^: updateDate */
      PARAM_UPDATE_DATE: 'updateDate',
      /** �p�����[�^: files */
      PARAM_FILES: 'files'
    },

    /**
     * Key Event�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    keyevent: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'keyevent',

      // Attribute
      /** �A�g���r���[�g: ondown */
      ATTR_ON_DOWN: 'ondown',
      /** �A�g���r���[�g: onup */
      ATTR_ON_UP: 'onup',
      /** �A�g���r���[�g: onkeychange */
      ATTR_ON_KEY_CHANGE: 'onkeychange',
      // Parameter
      /** �p�����[�^: keyevent */
      PARAM_KEY_EVENT: 'keyevent',
      /** �p�����[�^: id */
      PARAM_ID: 'id',
      /** �p�����[�^: config */
      PARAM_CONFIG: 'config',

      // Key Types
      /** �L�[�^�C�v: Standard Keyboard */
      KEYTYPE_STD_KEY: 0,
      /** �L�[�^�C�v: Media Control */
      KEYTYPE_MEDIA_CTRL: 512,
      /** �L�[�^�C�v:  Directional Pad / Button */
      KEYTYPE_DPAD_BUTTON: 1024,
      /** �L�[�^�C�v: User defined */
      KEYTYPE_USER: 32768
    },

    /**
     * Media Player�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    media_player: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'mediaplayer',

      // Attribute
      /** �A�g���r���[�g: media */
      ATTR_MEDIA: 'media',
      /** �A�g���r���[�g: medialist */
      ATTR_MEDIA_LIST: 'medialist',
      /** �A�g���r���[�g: playstatus */
      ATTR_PLAY_STATUS: 'playstatus',
      /** �A�g���r���[�g: play */
      ATTR_PLAY: 'play',
      /** �A�g���r���[�g: stop */
      ATTR_STOP: 'stop',
      /** �A�g���r���[�g: pause */
      ATTR_PAUSE: 'pause',
      /** �A�g���r���[�g: resume */
      ATTR_RESUME: 'resume',
      /** �A�g���r���[�g: seek */
      ATTR_SEEK: 'seek',
      /** �A�g���r���[�g: volume */
      ATTR_VOLUME: 'volume',
      /** �A�g���r���[�g: mute */
      ATTR_MUTE: 'mute',
      /** �A�g���r���[�g: onstatuschange */
      ATTR_ON_STATUS_CHANGE: 'onstatuschange',

      // Parameter
      /** �p�����[�^: media */
      PARAM_MEDIA: 'media',
      /** �p�����[�^: mediaId */
      PARAM_MEDIA_ID: 'mediaId',
      /** �p�����[�^: mediaPlayer */
      PARAM_MEDIA_PLAYER: 'mediaPlayer',
      /** �p�����[�^: mimeType */
      PARAM_MIME_TYPE: 'mimeType',
      /** �p�����[�^: title */
      PARAM_TITLE: 'title',
      /** �p�����[�^: type */
      PARAM_TYPE: 'type',
      /** �p�����[�^: language */
      PARAM_LANGUAGE: 'language',
      /** �p�����[�^: description */
      PARAM_DESCRIPTION: 'description',
      /** �p�����[�^: imageUri */
      PARAM_IMAGE_URI: 'imageUri',
      /** �p�����[�^: duration */
      PARAM_DURATION: 'duration',
      /** �p�����[�^: creators */
      PARAM_CREATORS: 'creators',
      /** �p�����[�^: creator */
      PARAM_CREATOR: 'creator',
      /** �p�����[�^: role */
      PARAM_ROLE: 'role',
      /** �p�����[�^: keywords */
      PARAM_KEYWORDS: 'keywords',
      /** �p�����[�^: genres */
      PARAM_GENRES: 'genres',
      /** �p�����[�^: query */
      PARAM_QUERY: 'query',
      /** �p�����[�^: order */
      PARAM_ORDER: 'order',
      /** �p�����[�^: offset */
      PARAM_OFFSET: 'offset',
      /** �p�����[�^: limit */
      PARAM_LIMIT: 'limit',
      /** �p�����[�^: count */
      PARAM_COUNT: 'count',
      /** �p�����[�^: status */
      PARAM_STATUS: 'status',
      /** �p�����[�^: pos */
      PARAM_POS: 'pos',
      /** �p�����[�^: volume */
      PARAM_VOLUME: 'volume',
      /** �p�����[�^: mute */
      PARAM_MUTE: 'mute',

      // ===== play_status�Ŏw�肷��X�e�[�^�X���` =====
      /** play_status�Ŏw�肷��X�e�[�^�X: Play */
      PLAY_STATUS_PLAY: 'play',
      /** play_status�Ŏw�肷��X�e�[�^�X: Stop */
      PLAY_STATUS_STOP: 'stop',
      /** play_status�Ŏw�肷��X�e�[�^�X: Pause */
      PLAY_STATUS_PAUSE: 'pause',

      // ===== onstatuschange�Ŏ󂯎��X�e�[�^�X =====
      /** onstatuschange�Ŏ󂯎��X�e�[�^�X: Play */
      ON_STATUS_CHANGE_PLAY: 'play',
      /** onstatuschange�Ŏ󂯎��X�e�[�^�X: Stop */
      ON_STATUS_CHANGE_STOP: 'stop',
      /** onstatuschange�Ŏ󂯎��X�e�[�^�X: Pause */
      ON_STATUS_CHANGE_PAUSE: 'pause',
      /** onstatuschange�Ŏ󂯎��X�e�[�^�X: Resume */
      ON_STATUS_CHANGE_RESUME: 'resume',
      /** onstatuschange�Ŏ󂯎��X�e�[�^�X: Mute */
      ON_STATUS_CHANGE_MUTE: 'mute',
      /** onstatuschange�Ŏ󂯎��X�e�[�^�X: Unmute */
      ON_STATUS_CHNAGE_UNMUTE: 'unmute',
      /** onstatuschange�Ŏ󂯎��X�e�[�^�X: Media */
      ON_STATUS_CHANGE_MEDIA: 'media',
      /** onstatuschange�Ŏ󂯎��X�e�[�^�X: Volume */
      ON_STATUS_CHANGE_VOLUME: 'volume',
      /** onstatuschange�Ŏ󂯎��X�e�[�^�X: complete */
      ON_STATUS_CHANGE_COMPLETE: 'complete',

      // ===== ���я� =====
      /** ���я�: ���� */
      ORDER_ASC: 'asc',
      /** ���я�: �~�� */
      ORDER_DSEC: 'desc'
    },

    /**
     * Media Stream Recording�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    media_stream_recording: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'mediastreamrecording',

      // Attribute
      /** �A�g���r���[�g: mediarecorder */
      ATTR_MEDIARECORDER: 'mediarecorder',
      /** �A�g���r���[�g: takephoto */
      ATTR_TAKE_PHOTO: 'takephoto',
      /** �A�g���r���[�g: record */
      ATTR_RECORD: 'record',
      /** �A�g���r���[�g: pause */
      ATTR_PAUSE: 'pause',
      /** �A�g���r���[�g: resume */
      ATTR_RESUME: 'resume',
      /** �A�g���r���[�g: stop */
      ATTR_STOP: 'stop',
      /** �A�g���r���[�g: mutetrack */
      ATTR_MUTETRACK: 'mutetrack',
      /** �A�g���r���[�g: unmutetrack */
      ATTR_UNMUTETRACK: 'unmutetrack',
      /** �A�g���r���[�g: options */
      ATTR_OPTIONS: 'options',
      /** �A�g���r���[�g: preview */
      ATTR_PREVIEW: 'preview',
      /** �A�g���r���[�g: onphoto */
      ATTR_ON_PHOTO: 'onphoto',
      /** �A�g���r���[�g: ondataavailable */
      ATTR_ON_DATA_AVAILABLE: 'ondataavailable',
      /** �A�g���r���[�g: onrecordingchange */
      ATTR_ON_RECORDING_CHANGE: 'onrecordingchange',

      /** �p�����[�^: target */
      PARAM_TARGET: 'target',
      /** �p�����[�^: recorders */
      PARAM_RECORDERS: 'recorders',
      /** �p�����[�^: id */
      PARAM_ID: 'id',
      /** �p�����[�^: name */
      PARAM_NAME: 'name',
      /** �p�����[�^: state */
      PARAM_STATE: 'state',
      /** �p�����[�^: imageWidth */
      PARAM_IMAGE_WIDTH: 'imageWidth',
      /** �p�����[�^: imageHeight */
      PARAM_IMAGE_HEIGHT: 'imageHeight',
      /** �p�����[�^: previewWidth */
      PARAM_PREVIEW_WIDTH: 'previewWidth',
      /** �p�����[�^: previewHeight */
      PARAM_PREVIEW_HEIGHT: 'previewHeight',
      /** �p�����[�^: previewMaxFrameRate */
      PARAM_PREVIEW_MAX_FRAME_RATE: 'previewMaxFrameRate',
      /** �p�����[�^: audio */
      PARAM_AUDIO: 'audio',
      /** �p�����[�^: channels */
      PARAM_CHANNELS: 'channels',
      /** �p�����[�^: sampleRate */
      PARAM_SAMPLE_RATE: 'sampleRate',
      /** �p�����[�^: sampleSize */
      PARAM_SAMPLE_SIZE: 'sampleSize',
      /** �p�����[�^: blockSize */
      PARAM_BLOCK_SIZE: 'blockSize',
      /** �p�����[�^: mimeType */
      PARAM_MIME_TYPE: 'mimeType',
      /** �p�����[�^: config */
      PARAM_CONFIG: 'config',
      /** �p�����[�^: imageSizes */
      PARAM_IMAGE_SIZES: 'imageSizes',
      /** �p�����[�^: previewSizes */
      PARAM_PREVIEW_SIZES: 'previewSizes',
      /** �p�����[�^: width */
      PARAM_WIDTH: 'width',
      /** �p�����[�^: height */
      PARAM_HEIGHT: 'height',
      /** �p�����[�^: timeslice */
      PARAM_TIME_SLICE: 'timeslice',
      /** �p�����[�^: settings */
      PARAM_SETTINGS: 'settings',
      /** �p�����[�^: photo */
      PARAM_PHOTO: 'photo',
      /** �p�����[�^: media */
      PARAM_MEDIA: 'media',
      /** �p�����[�^: status */
      PARAM_STATUS: 'status',
      /** �p�����[�^: errorMessage */
      PARAM_ERROR_MESSAGE: 'errorMessage',
      /** �p�����[�^: path */
      PARAM_PATH: 'path',
      /** �p�����[�^: min */
      PARAM_MIN: 'min',
      /** �p�����[�^: max */
      PARAM_MAX: 'max',

      // ===== �J�����̏�Ԓ萔 =====
      /** �����̏�Ԓ萔: ��~�� */
      RECORDER_STATE_INACTIVE: 'inactive',
      /** �����̏�Ԓ萔: ���R�[�f�B���O�� */
      RECORDER_STATE_RECORDING: 'recording',
      /** �����̏�Ԓ萔: �ꎞ��~�� */
      RECORDER_STATE_PAUSED: 'paused',

      // ===== ����B�e�A�����^���̏�Ԓ萔 =====
      /** ����B�e�A�����^���̏�Ԓ萔: �J�n */
      RECORDING_STATE_RECORDING: 'recording',
      /** ����B�e�A�����^���̏�Ԓ萔: �I�� */
      RECORDING_STATE_STOP: 'stop',
      /** ����B�e�A�����^���̏�Ԓ萔: �ꎞ��~ */
      RECORDING_STATE_PAUSE: 'pause',
      /** ����B�e�A�����^���̏�Ԓ萔: �ĊJ */
      RECORDING_STATE_RESUME: 'resume',
      /** ����B�e�A�����^���̏�Ԓ萔: �~���[�g */
      RECORDING_STATE_MUTETRACK: 'mutetrack',
      /** ����B�e�A�����^���̏�Ԓ萔: �~���[�g���� */
      RECORDING_STATE_UNMUTETRACK: 'unmutetrack',
      /** ����B�e�A�����^���̏�Ԓ萔: �G���[���� */
      RECORDING_STATE_ERROR: 'error',
      /** ����B�e�A�����^���̏�Ԓ萔: �x������ */
      RECORDING_STATE_WARNING: 'warning'
    },

    /**
     * Service Discovery�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    servicediscovery: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'servicediscovery',

      // Attribute
      /** �A�g���r���[�g: onservicechange */
      ATTR_ON_SERVICE_CHANGE: 'onservicechange',

      // Parameter
      /** �p�����[�^: networkService */
      PARAM_NETWORK_SERVICE: 'networkService',
      /** �p�����[�^: services */
      PARAM_SERVICES: 'services',
      /** �p�����[�^: state */
      PARAM_STATE: 'state',
      /** �p�����[�^: id */
      PARAM_ID: 'id',
      /** �p�����[�^: name */
      PARAM_NAME: 'name',
      /** �p�����[�^: type */
      PARAM_TYPE: 'type',
      /** �p�����[�^: online */
      PARAM_ONLINE: 'online',
      /** �p�����[�^: config */
      PARAM_CONFIG: 'config',
      /** �p�����[�^: scopes */
      PARAM_SCOPES: 'scopes',

      // ===== �l�b�g���[�N�^�C�v =====
      /** �l�b�g���[�N�^�C�v: WiFi */
      NETWORK_TYPE_WIFI: 'WiFi',
      /** �l�b�g���[�N�^�C�v: BLE */
      NETWORK_TYPE_BLE: 'BLE',
      /** �l�b�g���[�N�^�C�v: NFC */
      NETWORK_TYPE_NFC: 'NFC',
      /** �l�b�g���[�N�^�C�v: Bluetooth */
      NETWORK_TYPE_BLUETOOTH: 'Bluetooth'
    },

    /**
     * Service Information�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    serviceinformation: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'serviceinformation',

      // Parameter
      /** �p�����[�^: supports */
      PARAM_SUPPORTS: 'supports',
      /** �p�����[�^: connect */
      PARAM_CONNECT: 'connect',
      /** �p�����[�^: wifi */
      PARAM_WIFI: 'wifi',
      /** �p�����[�^: bluetooth */
      PARAM_BLUETOOTH: 'bluetooth',
      /** �p�����[�^: nfc */
      PARAM_NFC: 'nfc',
      /** �p�����[�^: ble */
      PARAM_BLE: 'ble'
    },

    /**
     * Notification�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, (String|Number)>}
     */
    notification: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'notification',

      // Attribute
      /** �A�g���r���[�g: notify */
      ATTR_NOTIFY: 'notify',
      /** �A�g���r���[�g: onclick */
      ATTR_ON_CLICK: 'onclick',
      /** �A�g���r���[�g: onclose */
      ATTR_ON_CLOSE: 'onclose',
      /** �A�g���r���[�g: onerror */
      ATTR_ON_ERROR: 'onerror',
      /** �A�g���r���[�g: onshow */
      ATTR_ON_SHOW: 'onshow',

      // Parameter
      /** �p�����[�^: body */
      PARAM_BODY: 'body',
      /** �p�����[�^: type */
      PARAM_TYPE: 'type',
      /** �p�����[�^: dir */
      PARAM_DIR: 'dir',
      /** �p�����[�^: lang */
      PARAM_LANG: 'lang',
      /** �p�����[�^: tag */
      PARAM_TAG: 'tag',
      /** �p�����[�^: icon */
      PARAM_ICON: 'icon',
      /** �p�����[�^: notificationId */
      PARAM_NOTIFICATION_ID: 'notificationId',

      // ===== �ʒm�^�C�v�萔 =====
      /** �ʒm�^�C�v: �����ʘb���M */
      NOTIFICATION_TYPE_PHONE: 0,
      /** �ʒm�^�C�v: ���[�����M */
      NOTIFICATION_TYPE_MAIL: 1,
      /** �ʒm�^�C�v: SMS���M */
      NOTIFICATION_TYPE_SMS: 2,
      /** �ʒm�^�C�v: �C�x���g */
      NOTIFICATION_TYPE_EVENT: 3,

      // ===== ���� =====
      /** ����: ���� */
      DIRECTION_AUTO: 'auto',
      /** ����: �E���獶 */
      DIRECTION_RIGHT_TO_LEFT: 'rtl',
      /** ����: ������E */
      DIRECTION_LEFT_TO_RIGHT: 'ltr'
    },

    /**
     * Phone�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, (String|Number)>}
     */
    phone: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'phone',

      // Attribute
      /** �A�g���r���[�g: call */
      ATTR_CALL: 'call',
      /** �A�g���r���[�g: set */
      ATTR_SET: 'set',
      /** �A�g���r���[�g: onconnect */
      ATTR_ON_CONNECT: 'onconnect',

      // Parameter
      /** �p�����[�^: phoneNumber */
      PARAM_PHONE_NUMBER: 'phoneNumber',
      /** �p�����[�^: mode */
      PARAM_MODE: 'mode',
      /** �p�����[�^: phoneStatus */
      PARAM_PHONE_STATUS: 'phoneStatus',
      /** �p�����[�^: state */
      PARAM_STATE: 'state',

      // ===== �d�b�̃��[�h�萔 =====
      /** �d�b�̃��[�h: �T�C�����g���[�h */
      PHONE_MODE_SILENT: 0,
      /** �d�b�̃��[�h: �}�i�[���[�h */
      PHONE_MODE_MANNER: 1,
      /** �d�b�̃��[�h: ������ */
      PHONE_MODE_SOUND: 2,

      // ===== �ʘb��Ԓ萔 =====
      /** �ʘb���: �ʘb�J�n */
      CALL_STATE_START: 0,
      /** �ʘb���: �ʘb���s */
      CALL_STATE_FAILED: 1,
      /** �ʘb���: �ʘb�I�� */
      CALL_STATE_FINISHED: 2
    },

    /**
     * Proximity�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    proximity: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'proximity',

      // Attribute
      /** �A�g���r���[�g: ondeviceproximity */
      ATTR_ON_DEVICE_PROXIMITY: 'ondeviceproximity',
      /** �A�g���r���[�g: onuserproximity */
      ATTR_ON_USER_PROXIMITY: 'onuserproximity',

      // Parameter
      /** �p�����[�^: value */
      PARAM_VALUE: 'value',
      /** �p�����[�^: min */
      PARAM_MIN: 'min',
      /** �p�����[�^: max */
      PARAM_MAX: 'max',
      /** �p�����[�^: threshold */
      PARAM_THRESHOLD: 'threshold',
      /** �p�����[�^: proximity */
      PARAM_PROXIMITY: 'proximity',
      /** �p�����[�^: near */
      PARAM_NEAR: 'near'
    },

    /**
     * Setting�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, (String|Number)>}
     */
    setting: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'setting',

      // Interface
      /** �C���^�[�t�F�[�X: sound */
      INTERFACE_SOUND: 'sound',
      /** �C���^�[�t�F�[�X: display */
      INTERFACE_DISPLAY: 'display',

      // Attribute
      /** �A�g���r���[�g: volume */
      ATTR_VOLUME: 'volume',
      /** �A�g���r���[�g: date */
      ATTR_DATE: 'date',
      /** �A�g���r���[�g: brightness */
      ATTR_BRIGHTNESS: 'brightness',
      /** �A�g���r���[�g: sleep */
      ATTR_SLEEP: 'sleep',

      // Parameter
      /** �p�����[�^: kind */
      PARAM_KIND: 'kind',
      /** �p�����[�^: level */
      PARAM_LEVEL: 'level',
      /** �p�����[�^: date */
      PARAM_DATE: 'date',
      /** �p�����[�^: time */
      PARAM_TIME: 'time',

      // ===== �ő�ŏ� =====
      /** �ő�Level */
      MAX_LEVEL: 1.0,
      /** �ŏ�Level */
      MIN_LEVEL: 0,

      // ===== ���ʂ̎�ʒ萔 =====
      /** ���ʂ̎�ʒ萔: �A���[�� */
      VOLUME_KIND_ALARM: 1,
      /** ���ʂ̎�ʒ萔: �ʘb�� */
      VOLUME_KIND_CALL: 2,
      /** ���ʂ̎�ʒ萔: ���M�� */
      VOLUME_KIND_RINGTONE: 3,
      /** ���ʂ̎�ʒ萔: ���[�����M�� */
      VOLUME_KIND_MAIL: 4,
      /** ���ʂ̎�ʒ萔: ���f�B�A�v���[���[�̉��� */
      VOLUME_KIND_MEDIA_PLAYER: 5,
      /** ���ʂ̎�ʒ萔: ���̑�SNS���̒��M�� */
      VOLUME_KIND_OTHER: 6
    },

    /**
     * System�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    system: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'system',

      // Interface
      /** �C���^�[�t�F�[�X: device */
      INTERFACE_DEVICE: 'device',

      // Attribute
      /** �A�g���r���[�g: events */
      ATTRI_EVENTS: 'events',
      /** �A�g���r���[�g: keyword */
      ATTRI_KEYWORD: 'keyword',
      /** �A�g���r���[�g: wakeup */
      ATTRI_WAKEUP: 'wakeup',

      // Parameter
      /** �p�����[�^: supports */
      PARAM_SUPPORTS: 'supports',
      /** �p�����[�^: version */
      PARAM_VERSION: 'version',
      /** �p�����[�^: id */
      PARAM_ID: 'id',
      /** �p�����[�^: name */
      PARAM_NAME: 'name',
      /** �p�����[�^: plugins */
      PARAM_PLUGINS: 'plugins',
      /** �p�����[�^: pluginId */
      PARAM_PLUGIN_ID: 'pluginId'
    },

    /**
     * Touch�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    touch: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'touch',

      // Attribute
      /** �A�g���r���[�g: ontouch */
      ATTR_ON_TOUCH: 'ontouch',
      /** �A�g���r���[�g: ontouchstart */
      ATTR_ON_TOUCH_START: 'ontouchstart',
      /** �A�g���r���[�g: ontouchend */
      ATTR_ON_TOUCH_END: 'ontouchend',
      /** �A�g���r���[�g: ontouchmove */
      ATTR_ON_TOUCH_MOVE: 'ontouchmove',
      /** �A�g���r���[�g: ontouchcancel */
      ATTR_ON_TOUCH_CANCEL: 'ontouchcancel',
      /** �A�g���r���[�g: ondoubletap */
      ATTR_ON_DOUBLE_TAP: 'ondoubletap',
      /** �A�g���r���[�g: ontouchchange */
      ATTR_ON_TOUCH_CHANGE: 'ontouchchange',

      // Parameter
      /** �p�����[�^: touch */
      PARAM_TOUCH: 'touch',
      /** �p�����[�^: touches */
      PARAM_TOUCHES: 'touches',
      /** �p�����[�^: id */
      PARAM_ID: 'id',
      /** �p�����[�^: x */
      PARAM_X: 'x',
      /** �p�����[�^: y */
      PARAM_Y: 'y'
    },

    /**
     * Vibration�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    vibration: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'vibration',

      // Attribute
      /** �A�g���r���[�g: vibrate */
      ATTR_VIBRATE: 'vibrate',

      // Parameter
      /** �p�����[�^: pattern�B */
      PARAM_PATTERN: 'pattern'
    },
    /**
     * Canvas�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    canvas: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'canvas',

      // Attribute
      /** �A�g���r���[�g: drawimage */
      ATTR_DRAWIMAGE: 'drawimage',

      // Parameter
      /** �p�����[�^: mimeType */
      PARAM_MIME_TYPE: 'mimeType',
      /** �p�����[�^: data */
      PARAM_DATA: 'data',
      /** �p�����[�^: x */
      PARAM_X: 'x',
      /** �p�����[�^: y */
      PARAM_Y: 'y',
      /** �p�����[�^: mode */
      PARAM_MODE: 'mode',

      /** ���[�h�t���O�F�X�P�[�����[�h */
      MODE_SCALES: 'scales',

      /** ���[�h�t���O�F�t�B�����[�h */
      MODE_FILLS: 'fills'
    },
    /**
     * Geolocation�v���t�@�C���̒萔
     * @namespace
     * @type {Object.<String, String>}
     */
    geolocation: {
      // Profile name
      /** �v���t�@�C�����B */
      PROFILE_NAME: 'geolocation',

      // Attribute
      /** �A�g���r���[�g: currentposition */
      ATTR_CURRENT_POSITION: 'currentposition',
      /** �A�g���r���[�g: onwatchposition */
      ATTR_ON_WATCH_POSITION: 'onwatchposition',

      // Parameter
      /** �p�����[�^: position */
      PARAM_POSITION: 'position',
      /** �p�����[�^: coordinates */
      PARAM_COORDINATES: 'coordinates',
      /** �p�����[�^: latitude */
      PARAM_LATITUDE: 'latitude',
      /** �p�����[�^: longitude */
      PARAM_LONGNITUDE: 'longitude',
      /** �p�����[�^: altitude */
      PARAM_ALTITUDE: 'altitude',
      /** �p�����[�^: accuracy */
      PARAM_ACCURACY: 'accuracy',
      /** �p�����[�^: altitudeAccuracy */
      PARAM_ALTITUDE_ACCURACY: 'altitudeAccuracy',
      /** �p�����[�^: heading */
      PARAM_HEADING: 'heading',
      /** �p�����[�^: speed */
      PARAM_SPEED: 'speed',
      /** �p�����[�^: timeStamp */
      PARAM_TIME_STAMP: 'timeStamp',
      /** �p�����[�^: timeStampString */
      PARAM_TIME_STAMP_STRING: 'timeStampString'
    }
  };
  parent.constants = constants;

  /**
   * HTTP�ʐM�������̃R�[���o�b�N�B
   * @callback dConnect.HTTPSuccessCallback
   * @param {!Number} status HTTP���X�|���X�̃X�e�[�^�X�R�[�h
   * @param {Object.<String, String>} headers HTTP���X�|���X�̃w�b�_�[
   * @param {String} responseText HTTP���X�|���X�̃e�L�X�g
   */

  /**
   * HTTP�ʐM���s���̃R�[���o�b�N�B
   * @callback dConnect.HTTPFailCallback
   * @param {!Number} readyState HTTP���N�G�X�g���M�ɗp����XMLHTTPRequest�́A���s����readyState
   * @param {?Number} status HTTP���X�|���X�̃X�e�[�^�X�R�[�h
   */

  /**
   * �����_����16�i������𐶐�����.
   * @private
   * @param {Number} byteSize �������镶����̒���
   * @return �����_����16�i������
   */
  var generateRandom = function(byteSize) {
    var min = 0;   // 0x00
    var max = 255; // 0xff
    var bytes = [];

    for (var i = 0; i < byteSize; i++) {
      var random = (Math.floor(Math.random() *
                    (max - min + 1)) + min).toString(16);
      if (random.length < 2) {
        random = '0' + random;
      }
      bytes[i] = random.toString(16);
    }
    return bytes.join('');
  };

  /**
   * Device Connect Manager�����M����HMAC�����؂���.
   * @private
   * @param {String} nonce �g���̂ė���
   * @param {String} hmac Device Connect Manager�����M����HMAC
   * @return �w�肳�ꂽHMAC������ł����true�A�����łȂ��ꍇ��false
   */
  var checkHmac = function(nonce, hmac) {
    var hmacKey = _currentHmacKey;
    if (hmacKey === '') {
      return true;
    }
    if (!hmac) {
      return false;
    }
    var shaObj = new jsSHA(nonce, 'HEX');
    var expectedHmac = shaObj.getHMAC(hmacKey, 'HEX', 'SHA-256', 'HEX');
    return hmac === expectedHmac;
  };

  /**
   * �T�[�o����̃��X�|���X��M���ɃT�[�o�̔F�؂��s�����ǂ�����ݒ肷��.
   * @memberOf dConnect
   * @param enable �T�[�o�̔F�؂��s���ꍇ��true�A�����łȂ��ꍇ��false
   */
  var setAntiSpoofing = function(enable) {
    _isEnabledAntiSpoofing = enable;
  };
  parent.setAntiSpoofing = setAntiSpoofing;

  /**
   * �T�[�o����̃��X�|���X��M���ɃT�[�o�̔F�؂��s�����ǂ����̃t���O���擾����.
   * @memberOf dConnect
   * @return �T�[�o�̔F�؂��s���ꍇ��true�A�����łȂ��ꍇ��false
   */
  var isEnabledAntiSpoofing = function() {
    return _isEnabledAntiSpoofing;
  };
  parent.isEnabledAntiSpoofing = isEnabledAntiSpoofing;

  /**
   * Device Connect Manager�̋N���ʒm����M���郊�X�i�[��ݒ肷��.
   * <p>
   * ����: Device Connect Manager�̋N���̓A�v���P�[�V�����̕\����Ԃ���\������\����
   * �J�ڂ����^�C�~���O�Ŋm�F�����.
   * </p>
   * @memberOf dConnect
   * @param listener ���X�i�[
   */
  var setLaunchListener = function(listener) {
    listener = listener || function() {
    };
    _launchListener = listener;
  }
  parent.setLaunchListener = setLaunchListener;

  /**
   * �u���E�U��Firefox���ǂ����𔻒肷��.
   * @private
   * @returns �u���E�U��Firefox�̏ꍇ��true�A�����łȂ��ꍇ��false
   */
  var isFirefox = function() {
    return (navigator.userAgent.indexOf("Firefox") != -1);
  }

  /**
  /**
   * Android�[�����Device Connect Manager���N������.
   * <p>
   * ����: �N���ɐ��������ꍇ�A�N���pIntent����M���邽�߂�Activity�N������.
   * �܂�A���̂Ƃ�Web�u���E�U���o�b�N�O���E���h�Ɉړ�����̂Œ���.
   * ����Activity�̏�����^�C�~���O(�����I�ɏ����邩�A�������̓��[�U�[����ŏ����̂�)��
   * Activity�̎����ˑ��Ƃ���.
   * </p>
   * @private
   * @param state �N����ʂ��o�����o���Ȃ���
   */
  var startManagerForAndroid = function(state) {
    _currentHmacKey = isEnabledAntiSpoofing() ?
                        generateRandom(HMAC_KEY_BYTES) : '';
    var urlScheme = new AndroidURISchemeBuilder();
    var url;
    var origin = encodeURIComponent(location.origin);
    if (state === undefined) {
        state = '';
    }
    if (isFirefox()) {
        url = uriSchemeName + '://start/' + state
                  + '?origin=' + origin
                  + '&key=' + _currentHmacKey;
    } else {
       urlScheme.setPath('start/' + state);
      urlScheme.addParameter('package', 'org.deviceconnect.android.manager');
      urlScheme.addParameter('S.origin', origin);
      urlScheme.addParameter('S.key', _currentHmacKey);
      url = urlScheme.build();
    }
    location.href = url;
  };

  /**
   * iOS�[�����Device Connect Manager���N������.
   * @private
   */
  var startManagerForIOS = function() {
    window.location.href = uriSchemeName + '://start?url=' +
                  encodeURIComponent(window.location.href);
  };

  /**
   * Device Connect Manager���N������.
   * @memberOf dConnect
   * @param state �N����ʂ��o�����o���Ȃ���
   */
  var startManager = function(state) {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('android') > -1) {
      startManagerForAndroid(state);
    } else if (userAgent.search(/iphone|ipad|ipod/) > -1) {
      startManagerForIOS();
    }
  };
  parent.startManager = startManager;

  /**
   * Android�[�����Device Connect Manager���~����.
   * <p>
   * ����: ��~�ɐ��������ꍇ�A��~�pIntent����M���邽�߂�Activity�N������.
   * �܂�A���̂Ƃ�Web�u���E�U���o�b�N�O���E���h�Ɉړ�����̂Œ���.
   * ����Activity�̏�����^�C�~���O(�����I�ɏ����邩�A�������̓��[�U�[����ŏ����̂�)��
   * Activity�̎����ˑ��Ƃ���.
   * </p>
   * @private
   * @param state �N����ʂ��o�����o���Ȃ���
   */
  var stopManagerForAndroid = function(state) {
    _currentHmacKey = isEnabledAntiSpoofing() ?
                        generateRandom(HMAC_KEY_BYTES) : '';
    var urlScheme = new AndroidURISchemeBuilder();
    var url;
    var origin = encodeURIComponent(location.origin);
    if (state === undefined) {
        state = '';
    }
    if (isFirefox()) {
        url = uriSchemeName + '://stop/' + state
              + '?origin=' + origin
              + '&key=' + _currentHmacKey;
    } else {
       urlScheme.setPath('stop/' + state);
      urlScheme.addParameter('package', 'org.deviceconnect.android.manager');
      urlScheme.addParameter('S.origin', origin);
      urlScheme.addParameter('S.key', _currentHmacKey);
      url = urlScheme.build();
    }
    location.href = url;
  };

  /**
   * iOS�[�����Device Connect Manager���~����.
   * @private
   */
  var stopManagerForIOS = function() {
    window.location.href = uriSchemeName + '://stop';
  };

  /**
   * Device Connect Manager���~����.
   * @memberOf dConnect
   * @param state ��~��ʂ��o�����o���Ȃ���
   */
  var stopManager = function(state) {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('android') > -1) {
      stopManagerForAndroid(state);
    } else if (userAgent.search(/iphone|ipad|ipod/) > -1) {
      stopManagerForIOS();
    }
  };
  parent.stopManager = stopManager;

  /**
   * �w�肳�ꂽURI�Ƀ��N�G�X�g�p�����[�^��ǉ�����.
   * @private
   * @param uri URI
   * @param key URI�ɒǉ�����p�����[�^�̃L�[
   * @param value URI�ɒǉ�����p�����[�^�̒l
   * @return ���N�G�X�g�p�����[�^��ǉ����ꂽURI������
   */
  var addRequestParameter = function(uri, key, value) {
    var array = uri.split('?');
    var sep = (array.length == 2) ? '&' : '?';
    uri += sep + key + '=' + value;
    return uri;
  };

  /**
   * Device Connect RESTful API�����s����.
   * <p>
   + ���X�|���X�̎�M�ɐ��������ꍇ�ł��A�T�[�o�̔F�؂Ɏ��s�����ꍇ�̓G���[�R�[���o�b�N�����s����.
   * </p>
   * @memberOf dConnect
   * @param {String} method ���\�b�h
   * @param {String} uri URI
   * @param {Object.<String, String>} header ���N�G�X�g�w�b�_�[�BKey-Value�}�b�v�œn���B
   * @param {} data �R���e���c�f�[�^
   * @param {Function} success �������R�[���o�b�N
   * @param {Function} error ���s���R�[���o�b�N
   */
  var sendRequest = function(method, uri, header, data, success, error) {
    success = success || function() {
    };
    error = error || function() {
    };

    var hmacKey = _currentHmacKey;
    var nonce = hmacKey !== '' ? generateRandom(NONCE_BYTES) : null;
    if (nonce !== null) {
      uri = addRequestParameter(uri, 'nonce', nonce);
    }
    var httpSuccess = function(status, headers, responseText) {
      var json = JSON.parse(responseText);
      // HMAC�̌���
      if (hmacKey !== '' && !checkHmac(nonce, json.hmac)) {
        if (typeof error === 'function') {
          error(parent.constants.ErrorCode.INVALID_SERVER,
            'The response was received from the invalid server.');
        }
        return;
      }
      if (json.result === parent.constants.RESULT_OK) {
        if (typeof success === 'function') {
          success(json);
        }
      } else {
        if (typeof error === 'function') {
          error(json.errorCode, json.errorMessage);
        }
      }
    };
    var httpError = function(readyState, status) {
      if (typeof error === 'function') {

        error(parent.constants.ErrorCode.ACCESS_FAILED,
          'Failed to access to the server.');
      }
    };

    parent.execute(method, uri, header, data, httpSuccess, httpError);
  }
  parent.sendRequest = sendRequest;

  /**
   * Device Connect RESTful API��GET���\�b�h�����s����.
   * <p>
   + ���X�|���X�̎�M�ɐ��������ꍇ�ł��A�T�[�o�̔F�؂Ɏ��s�����ꍇ�̓G���[�R�[���o�b�N�����s����.
   * </p>
   * @memberOf dConnect
   * @param {String} uri URI
   * @param {Object.<String, String>} headers ���N�G�X�g�w�b�_�[�BKey-Value�}�b�v�œn���B
   * @param {Function} success �������R�[���o�b�N
   * @param {Function} error ���s���R�[���o�b�N
   */
  parent.get = function(uri, header, success, error) {
    sendRequest('GET', uri, header, null, success, error);
  };

  /**
   * Device Connect RESTful API��PUT���\�b�h�����s����.
   * <p>
   + ���X�|���X�̎�M�ɐ��������ꍇ�ł��A�T�[�o�̔F�؂Ɏ��s�����ꍇ�̓G���[�R�[���o�b�N�����s����.
   * </p>
   * @memberOf dConnect
   * @param {String} uri URI
   * @param {Object.<String, String>} header ���N�G�X�g�w�b�_�[�BKey-Value�}�b�v�œn���B
   * @param {} data �R���e���c�f�[�^
   * @param {Function} success �������R�[���o�b�N
   * @param {Function} error ���s���R�[���o�b�N
   */
  parent.put = function(uri, header, data, success, error) {
    sendRequest('PUT', uri, header, data, success, error);
  };

  /**
   * Device Connect RESTful API��POST���\�b�h�����s����.
   * <p>
   + ���X�|���X�̎�M�ɐ��������ꍇ�ł��A�T�[�o�̔F�؂Ɏ��s�����ꍇ�̓G���[�R�[���o�b�N�����s����.
   * </p>
   * @memberOf dConnect
   * @param {String} uri URI
   * @param {Object.<String, String>} header ���N�G�X�g�w�b�_�[�BKey-Value�}�b�v�œn���B
   * @param {} data �R���e���c�f�[�^
   * @param {Function} success �������R�[���o�b�N
   * @param {Function} error ���s���R�[���o�b�N
   */
  parent.post = function(uri, header, data, success, error) {
    sendRequest('POST', uri, header, data, success, error);
  };

  /**
   * Device Connect RESTful API��DELETE���\�b�h�����s����.
   * <p>
   + ���X�|���X�̎�M�ɐ��������ꍇ�ł��A�T�[�o�̔F�؂Ɏ��s�����ꍇ�̓G���[�R�[���o�b�N�����s����.
   * </p>
   * @memberOf dConnect
   * @param {String} uri URI
   * @param {Object.<String, String>} header ���N�G�X�g�w�b�_�[�BKey-Value�}�b�v�œn���B
   * @param {Function} success �������R�[���o�b�N
   * @param {Function} error ���s���R�[���o�b�N
   */
  parent.delete = function(uri, header, success, error) {
    sendRequest('DELETE', uri, header, null, success, error);
  };

  /**
   * REST API�Ăяo��.
   * @see {@link sendRequest}
   * @memberOf dConnect
   * @param {String} method HTTP���\�b�h
   * @param {String} uri URI
   * @param {Object.<String, String>} header HTTP���N�G�X�g�w�b�_�[�BKey-Value�}�b�v�œn���B
   * @param {} data �R���e���c�f�[�^
   * @param {dConnect.HTTPSuccessCallback} successCallback �������R�[���o�b�N�B
   * @param {dConnect.HTTPFailCallback} errorCallback ���s���R�[���o�b�N�B
   */
  var execute = function(method, uri, header, data,
                         successCallback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      // OPENED: open()���Ăяo����āA�܂�send()���Ăяo����ĂȂ��B
      if (xhr.readyState === 1) {
        var isExistContentType = false;
        for (var key in header) {
          try {
            xhr.setRequestHeader(key.toLowerCase(), header[key]);
            if (key.toLowerCase() === 'content-type') {
              isExistContentType = true;
            }
          } catch (e) {
            if (typeof errorCallback === 'function') {
              errorCallback(xhr.readyState, xhr.status);
            }
            return;
          }
        }
        if (extendedOrigin !== undefined) {
          try {
            xhr.setRequestHeader(HEADER_EXTENDED_ORIGIN.toLowerCase(),
              extendedOrigin);
          } catch (e) {
            if (typeof errorCallback === 'function') {
              errorCallback(xhr.readyState, xhr.status);
            }
            return;
          }
        }

        // ����content-type�w�b�_�[�����݂���ꍇ�ɂ͒ǉ����Ȃ�
        if (!isExistContentType) {
          xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        }

        if (method.toUpperCase() === 'DELETE'
            && (data === undefined || data === null)) {
          data = '';
        }
        xhr.send(data);
      }
      // HEADERS_RECEIVED: send() ���Ăяo����A�w�b�_�[�ƃX�e�[�^�X���ʂ����B
      else if (xhr.readyState === 2) {
        // console.log('### 2');
      }
      // LOADING: �_�E�����[�h��
      else if (xhr.readyState === 3) {
        // console.log('### 3');
      }
      // DONE: ��A�̓��삪���������B
      else if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (typeof successCallback === 'function') {
            var headerMap = {};
            var headerArr = xhr.getAllResponseHeaders().split('\r\n');
            for (var key in headerArr) {
              var delimIdx = headerArr[key].indexOf(':');
              var hKey = headerArr[key].substr(0, delimIdx).toLowerCase();
              var hVal = headerArr[key].substr(delimIdx + 1).trim();
              if (hKey.length != 0) {
                headerMap[hKey] = hVal;
              }
            }
            successCallback(xhr.status, headerMap, xhr.responseText);
          }
        } else {
          if (typeof errorCallback === 'function') {
            errorCallback(xhr.readyState, xhr.status);
          }
        }
      }
    };
    xhr.onerror = function() {
      // console.log('### error');
    };
    xhr.timeout = 60000;
    try {
      xhr.open(method, uri, true);
    } catch (e) {
      if (typeof errorCallback === 'function') {
        errorCallback(-1, e.toString());
      }
    }
  };
  parent.execute = execute;

  /**
   * Service Discovery API�ւ̊ȈՃA�N�Z�X��񋟂���B
   * @memberOf dConnect
   * @param {String} accessToken �A�N�Z�X�g�[�N��
   * @param {Function} successCallback �������R�[���o�b�N�B
   * @param {Function} errorCallback ���s���R�[���o�b�N�B
   *
   * @example
   * // �f�o�C�X�̌���
   * dConnect.discoverDevices(accessToken,
   *     function(json) {
     *         var devices = json.services;
     *     },
   *     function(errorCode, errorMessage) {
     *     });
     */
    var discoverDevices = function(accessToken, success_cb, error_cb) {
        var builder = new parent.URIBuilder();
        builder.setProfile(parent.constants.servicediscovery.PROFILE_NAME);
        builder.setAccessToken(accessToken);
        parent.sendRequest('GET', builder.build(), null, null, success_cb, error_cb);
    };
    parent.discoverDevices = discoverDevices;
    /**
     * �v���t�@�C��������T�[�r�X�ꗗ���擾���邽�߂�API��񋟂���B
     * @memberOf dConnect
     * @param {String} profileName �v���t�@�C����
     * @param {String} accessToken �A�N�Z�X�g�[�N��
     * @param {Function} success_cb �������R�[���o�b�N�B
     * @param {Function} error_cb ���s���R�[���o�b�N�B
     *
     * @example
     * // �T�[�r�X�̌���
     * discoverDevicesFromProfile('battery', accessToken,
     *     function(json) {
     *         var services = json.services;
     *     },
     *     function(errorCode, errorMessage) {
     *     });
     */
    var discoverDevicesFromProfile = function(profileName, accessToken, success_cb, error_cb) {
        var result = {
            "result" : parent.constants.RESULT_OK,
            "services" : new Array()
        };
        parent.discoverDevices(accessToken, function(json) {
          var devices = json.services;
          var func = function(count) {
            if (count == devices.length) {
              success_cb(result);
            } else {
              dConnect.getSystemDeviceInfo(devices[count].id, accessToken,
                function(json) {
                  if (json.supports) {
                    for (var i = 0; i < json.supports.length; i++) {
                      if (json.supports[i] === profileName) {
                        result.services.push(devices[count]);
                        break;
                      }
                    }
                  }
                  func(count + 1);
                },
                function(errorCode, errorMessage) {
                  error_cb(errorCode, errorMessage);
                });
            }
          }
          func(0);
        }, error_cb);
    };
    parent.discoverDevicesFromProfile = discoverDevicesFromProfile;
    
    /**
     * Service Information API�ւ̊ȈՃA�N�Z�X��񋟂���B
     * @memberOf dConnect
     * @param {String} serviceId �T�[�r�XID
     * @param {String} accessToken �A�N�Z�X�g�[�N��
     * @param {dConnect.HTTPSuccessCallback} success_cb �������R�[���o�b�N�B
     * @param {dConnect.HTTPFailCallback} error_cb ���s���R�[���o�b�N�B
     */
    var getSystemDeviceInfo = function(serviceId, accessToken, success_cb, error_cb) {
        var builder = new parent.URIBuilder();
        builder.setProfile(parent.constants.serviceinformation.PROFILE_NAME);
        builder.setServiceId(serviceId);
        builder.setAccessToken(accessToken);
        parent.sendRequest('GET', builder.build(), null, null, success_cb, error_cb);
    };
    parent.getSystemDeviceInfo = getSystemDeviceInfo;

    /**
     * System API�ւ̊ȈՃA�N�Z�X��񋟂���B
     * @memberOf dConnect
     * @param {String} accessToken �A�N�Z�X�g�[�N��
     * @param {Function} success_cb �������R�[���o�b�N�B
     * @param {Function} error_cb ���s���R�[���o�b�N�B
     */
    var getSystemInfo = function(accessToken, success_cb, error_cb) {
        var builder = new parent.URIBuilder();
        builder.setProfile(parent.constants.system.PROFILE_NAME);
        builder.setAccessToken(accessToken);
        parent.sendRequest('GET', builder.build(), null, null, success_cb, error_cb);
    };
    parent.getSystemInfo = getSystemInfo;

    /**
     * Device Connect Manager���N�����Ă���`�F�b�N����B���������C���X�g�[������Ă��Ȃ���΁A�C���X�g�[��
     * ��ʂւƐi�܂���B
     * @memberOf dConnect
     * @param {Function} success_cb �������R�[���o�b�N�B
     * @param {Function} error_cb ���s���R�[���o�b�N�B
     */
    var checkDeviceConnect = function(success_cb, error_cb) {
        var builder = new parent.URIBuilder();
        builder.setProfile(parent.constants.availability.PROFILE_NAME);
        parent.sendRequest('GET', builder.build(), null, null, function(json) {
            // localhost:4035��GotAPI�����p�\
            success_cb(json.version);
        }, error_cb);
    };
    parent.checkDeviceConnect = checkDeviceConnect;

    /**
     * �w�肳�ꂽDevice Connect Event API�ɃC�x���g���X�i�[��o�^����B
     * @memberOf dConnect
     * @param {String} uri �����Device Connect Event API��\��URI�i�K�v�ȃp�����[�^��URL�p�����[�^�Ƃ��Ė��ߍ��܂�Ă���j
     * @param {Function} event_cb �o�^�������C�x���g��̗p�R�[���o�b�N�B
     * @param {Function] success_cb �C�x���g�o�^�����R�[���o�b�N
     * @param {Function] error_cb �C�x���g�o�^���s�R�[���o�b�N
     *
     * @example
     * var uri = "http://localhost:4035/gotapi/battery/onchargingchange?device=xxx&clientId=yyy&accessToken=zzz";
     * dConnect.addEventListener(uri, event_cb, success_cb, error_cb);
     */
    var addEventListener = function(uri, event_cb, success_cb, error_cb) {
        if (typeof event_cb != "function") {
            throw new TypeError("2nd argument must be a function for callback.");
        }
        parent.put(uri, null, null, function(json) {
            eventListener[uri.toLowerCase()] = event_cb;
            if (success_cb) {
                success_cb(json);
            }
        }, error_cb);
    };
    parent.addEventListener = addEventListener;

    /**
     * �w�肳�ꂽDevice Connect Event API����C�x���g���X�i�[���폜����B
     * @memberOf dConnect
     * @param {String} uri �����Device Connect Event API��\��URI�i�K�v�ȃp�����[�^��URL�p�����[�^�Ƃ��Ė��ߍ��܂�Ă���j
     * @param {Function] success_cb �C�x���g�o�^���������R�[���o�b�N
     * @param {Function] error_cb �C�x���g�o�^�������s�R�[���o�b�N
     *
     * @example
     * var uri = "http://localhost:4035/gotapi/battery/onchargingchange?device=xxx&clientId=yyy&accessToken=zzz";
     * dConnect.removeEventListener(uri, success_cb, error_cb);
     */
    var removeEventListener = function(uri, success_cb, error_cb) {
        parent.delete(uri, null, function(json) {
            delete eventListener[uri.toLowerCase()];
            if (success_cb) {
                success_cb(json);
            }
        }, error_cb);
    };
    parent.removeEventListener = removeEventListener;

    /**
     * dConnectManagner�ɔF�����߂�.
     * @memberOf dConnect
     * @param scopes �g�p����X�R�[�v�̔z��
     * @param applicationName �A�v����
     * @param success_cb �������̃R�[���o�b�N
     * @param error_cb ���s���̃R�[���o�b�N
     *
     * @example
     * // �A�N�Z�X����v���t�@�C���ꗗ���`
     * var scopes = Array('servicediscovery', 'sysytem', 'battery');
     * // �F�����s
     * dConnect.authorization(scopes, '�T���v��',
     *     function(clientId, clientSecret, accessToken) {
     *         // clientId, clientSecret, accessToken��ۑ����āA�v���t�@�C���ɃA�N�Z�X
     *     },
   *     function(errorCode, errorMessage) {
     *         alert('Failed to get accessToken.');
     *     });
   */
  var authorization = function(scopes, applicationName,
                               successCallback, errorCallback) {
    parent.createClient(function(clientId) {
      parent.requestAccessToken(clientId, scopes,
                        applicationName, function(accessToken) {
          if (typeof successCallback === 'function') {
          successCallback(clientId, accessToken);
        }
      }, errorCallback);
    }, errorCallback);
  };
  parent.authorization = authorization;

  /**
   * �N���C�A���g���쐬����.
   * @memberOf dConnect
   * @param successCallback �N���C�A���g�쐬�ɐ��������ꍇ�̃R�[���o�b�N
   * @param errorCallback �N���C�A���g�쐬�Ɏ��s�����ꍇ�̃R�[���o�b�N
   *
   * @example
   * dConnect.createClient(
   *     function(clientId) {
     *         // clientId��ۑ����āA�A�N�Z�X�g�[�N���̎擾�Ɏg�p����
     *     },
   *     function(errorCode, errorMessage) {
     *     }
   * );
   */
  var createClient = function(successCallback, errorCallback) {
    var builder = new parent.URIBuilder();
    builder.setProfile(parent.constants.authorization.PROFILE_NAME);
    builder.setAttribute(parent.constants.authorization.ATTR_GRANT);
    parent.sendRequest('GET', builder.build(), null, null, function(json) {
      if (typeof successCallback === 'function') {
        successCallback(json.clientId);
      }
    }, function(errorCode, errorMessage) {
      if (typeof errorCallback === 'function') {
        errorCallback(errorCode, 'Failed to create client.');
      }
    });
  };
  parent.createClient = createClient;

  /**
   * �A�N�Z�X�g�[�N����v������.
   * @memberOf dConnect
   * @param clientId �N���C�A���gID
   * @param scopes �X�R�[�v�ꗗ(�z��)
   * @param applicationName �A�v����
   * @param successCallback �A�N�Z�X�g�[�N���擾�ɐ��������ꍇ�̃R�[���o�b�N
   * @param errorCallback �A�N�Z�X�g�[�N���擾�Ɏ��s�����ꍇ�̃R�[���o�b�N
   *
   * @example
   * dConnect.requestAccessToken(clientId, scopes, '�A�v����',
   *     function(accessToken) {
     *         // �A�N�Z�X�g�[�N���̕ۑ����āA�v���t�@�C���̃A�N�Z�X���s��
     *     },
   *     function(errorCode, errorMessage) {
     *     }
   * );
   */
  var requestAccessToken = function(clientId, scopes, applicatonName,
                                    successCallback, errorCallback) {
    // uri�쐬
    var builder = new parent.URIBuilder();
    builder.setProfile(parent.constants.authorization.PROFILE_NAME);
    builder.setAttribute(parent.constants.authorization.ATTR_ACCESS_TOKEN);
    builder.addParameter(parent.constants.authorization.PARAM_CLIENT_ID,
                          clientId);
    builder.addParameter(parent.constants.authorization.PARAM_SCOPE,
                          parent.combineScope(scopes));
    builder.addParameter(parent.constants.authorization.PARAM_APPLICATION_NAME,
                          applicatonName);
    parent.sendRequest('GET', builder.build(), null, null, function(json) {
      webAppAccessToken = json.accessToken;
      if (typeof successCallback === 'function') {
        successCallback(webAppAccessToken);
      }
    }, function(errorCode, errorMessage) {
      if (typeof errorCallback === 'function') {
        errorCallback(errorCode, 'Failed to get access token.');
      }
    });
  };
  parent.requestAccessToken = requestAccessToken;

  /**
   * �X�R�[�v�̔z��𕶎���ɒu������.
   * @memberOf dConnect
   * @param {Array.<String>} scopes �X�R�[�v�ꗗ
   * @return <String> �A�����ꂽ�X�R�[�v�ꗗ
   */
  var combineScope = function(scopes) {
    var scope = '';
    if (Array.isArray(scopes)) {
      for (var i = 0; i < scopes.length; i++) {
        if (i > 0) {
          scope += ',';
        }
        scope += scopes[i];
      }
    }
    return scope;
  };
  parent.combineScope = combineScope;

  /**
   * HTTP�����WebSocket�ʐM��SSL���g�p���邩�ǂ�����ݒ肷��.
   * <p>
   * �f�t�H���g�ݒ�ł�SSL�͎g�p���Ȃ��B
   * </p>
   * @memberOf dConnect
   * @param {String} enabled SSL���g�p����ꍇ��true�A�g�p���Ȃ��ꍇ��false
   */
  var setSSLEnabled = function(enabled) {
    sslEnabled = enabled;
  }
  parent.setSSLEnabled = setSSLEnabled;

  /**
   * HTTP�����WebSocket�ʐM��SSL���g�p���邩�ǂ������擾����.
   * <p>
   * �f�t�H���g�ݒ�ł�SSL�͎g�p���Ȃ��B
   * </p>
   * @memberOf dConnect
   * @return SSL���g�p����ꍇ��true�A�g�p���Ȃ��ꍇ��false
   */
  var isSSLEnabled = function() {
    return sslEnabled;
  }
  parent.isSSLEnabled = isSSLEnabled;

  /**
   * Manager�N���pURI�X�L�[���̖��O��ݒ肷��.
   * @memberOf dConnect
   * @param {String} name Manager�N���pURI�X�L�[���̖��O
   */
  var setURISchemeName = function(name) {
    uriSchemeName = name;
  };

  /**
   * �z�X�g����ݒ肷��.
   * @memberOf dConnect
   * @param {String} h �z�X�g��
   */
  var setHost = function(h) {
    host = h;
  };
  parent.setHost = setHost;

  /**
   * �I���W����ݒ肷��.
   * �n�C�u���b�h�A�v���Ƃ��ē��삳����ꍇ�ɂ͖{���\�b�h�ŃI���W����ݒ肷��.
   * @memberOf dConnect
   * @param {String} o �I���W��
   */
  var setExtendedOrigin = function(o) {
    extendedOrigin = o;
  };
  parent.setExtendedOrigin = setExtendedOrigin;

  /**
   * �|�[�g�ԍ���ݒ肷��.
   * @memberOf dConnect
   * @param {Number} p �|�[�g�ԍ�
   */
  var setPort = function(p) {
    port = p;
  };
  parent.setPort = setPort;

  /**
   * �x�[�X�ƂȂ�h���C�������擾����.
   * @memberOf dConnect
   * @return {String} �h���C����
   */
  var getBaseDomain = function() {
    return 'http://' + host + ':' + port;
  };
  parent.getBaseDomain = getBaseDomain;

  /**
   * WebSocket���J��.
   * <p>
   * WebSocket�́A������ڑ����邱�Ƃ��ł��Ȃ��B
   * dConnect.isConnectedWebSocket()��p���āA�ڑ��m�F�͂ł���̂ŁA
   * �ڑ�����Ă���ꍇ�ɂ́A��x�AdConnect.disconnectWebSocket()��
   * �ؒf���Ă���A�ēx�ڑ��������s���ĉ������B
   * </p>
   * @memberOf dConnect
   * @param {!String} accessToken Device Connect�V�X�e������擾�����A�N�Z�X�g�[�N��
   * @param cb WebSocket�̊J�C�x���g���󂯎��R�[���o�b�N�֐�
   *
   * @example
   * // Websocket���J��
   * dConnect.connectWebSocket(accessToken, function(eventCode, message) {
   * });
   *
   */
  var connectWebSocket = function(accessToken, cb) {
    if (websocket) {
      return;
    }
    var scheme = sslEnabled ? 'wss' : 'ws';
    websocket = new WebSocket(scheme + '://' + host + ':' +
                              port + '/gotapi/websocket');
    websocket.onopen = function(e) {
      isOpenedWebSocket = true;

      // �{�A�v���̃C�x���g�pWebSocket��1��1�ŕR�Â����Z�b�V�����L�[��Device Connect Manager�ɓo�^���Ă��炤�B
      websocket.send('{"accessToken":"' + accessToken + '"}');
      if (cb) {
        cb(0, 'open');
      }
    };
    websocket.onmessage = function(msg) {
      var json = JSON.parse(msg.data);
      if (!isEstablishedWebSocket) {
        if (json.result === 0) {
          isEstablishedWebSocket = true;
          startMonitoringWebsocket(accessToken, cb);
          cb(-1, 'established');
        } else {
          cb(2 + json.errorCode, json.errorMessage);
        }
        return;
      }

      var uri = '/gotapi/';
      if (json.profile) {
        uri += json.profile;
      }
      if (json.interface) {
        uri += '/';
        uri += json.interface;
      }
      if (json.attribute) {
        uri += '/';
        uri += json.attribute;
      }
      uri = uri.toLowerCase();
      for (var key in eventListener) {
        if (key.lastIndexOf(uri) > 0) {
          if (eventListener[key] != null &&
                    typeof(eventListener[key]) == 'function') {
            eventListener[key](msg.data);
          }
        }
      }
    };
    websocket.onerror = function(error) {
      if (cb) {
        cb(2, 'error: ' + error);
      }
    }
    websocket.onclose = function(e) {
      isOpenedWebSocket = false;
      isEstablishedWebSocket = false;
      websocket = undefined;
      if (cb) {
        cb(1, 'close');
      }
    };
  };
  parent.connectWebSocket = connectWebSocket;

  var startMonitoringWebsocket = function(accessToken, cb) {
    if (reconnectingTimerId === undefined) {
      reconnectingTimerId = setInterval(function() {
        if (!isConnectedWebSocket()) {
          connectWebSocket(accessToken, cb);
        }
      }, 1000);
    }
  };

  var stopMonitoringWebsocket = function() {
    if (reconnectingTimerId !== undefined) {
      clearInterval(reconnectingTimerId);
      reconnectingTimerId = undefined;
    }
  };

  /**
   * WebSocket��ؒf����.
   * @memberOf dConnect
   */
  var disconnectWebSocket = function() {
    if (websocket) {
      stopMonitoringWebsocket();

      isOpenedWebSocket = false;
      isEstablishedWebSocket = false;
      websocket.close();
      websocket = undefined;
    }
  };
  parent.disconnectWebSocket = disconnectWebSocket;

  /**
   * Websocket���ڑ�����Ă��邩�`�F�b�N����.
   * @return �ڑ����Ă���ꍇ�ɂ�true�A����ȊO��false
   */
  var isConnectedWebSocket = function() {
    return websocket != undefined && isOpenedWebSocket;
  }
  parent.isConnectedWebSocket = isConnectedWebSocket;

  /**
   * Websocket�ŃC�x���g����M�\�ȏ�Ԃ��`�F�b�N����.
   * @return �\�ȏꍇ�ɂ�true�A����ȊO��false
   */
  var isWebSocketReady = function() {
    return isConnectedWebSocket() && isEstablishedWebSocket;
  }
  parent.isWebSocketReady = isWebSocketReady;

  /**
   * �J�X�^��URI�X�L�[�����쐬���邽�߂̒��ۓI�ȃ��[�e�B���e�B�N���X.
   * @private
   * @class
   */
  var AndroidURISchemeBuilder = function() {
    this.scheme = uriSchemeName;
    this.path = '';
    this.params = {};
  };

  /**
   * URI�X�L�[���̃X�L�[������ݒ肷��.
   * @private
   * @return {URISchemeBuilder} �������g�̃C���X�^���X
   */
  AndroidURISchemeBuilder.prototype.setScheme = function(scheme) {
    this.scheme = scheme;
    return this;
  };

  /**
   * URI�X�L�[���̃p�X��ݒ肷��.
   * @private
   * @return {URISchemeBuilder} �������g�̃C���X�^���X
   */
  AndroidURISchemeBuilder.prototype.setPath = function(path) {
    this.path = path;
    return this;
  };

  /**
   * URI�X�L�[���Ƀp�����[�^��ǉ�����.
   * @private
   * @param key �p�����[�^�L�[
   * @param value �p�����[�^�l
   * @return {URISchemeBuilder} �������g�̃C���X�^���X
   */
  AndroidURISchemeBuilder.prototype.addParameter = function(key, value) {
    this.params[key] = value;
    return this;
  };

  /**
   * URI�X�L�[�����쐬����.
   * @private
   * @return {String} URI�X�L�[���̕�����\��
   */
  AndroidURISchemeBuilder.prototype.build = function() {
    var urlScheme = 'intent://' + this.path + '#Intent;scheme=' +
                            this.scheme + ';';
    for (var key in this.params) {
      urlScheme += key + '=' + this.params[key] + ';';
    }
    urlScheme += 'end';
    return urlScheme;
  };

  /**
   * URI���쐬���邽�߂̃��[�e�B���e�B�N���X�B
   * <p>
   * �z�X�g����|�[�g�ԍ��́A�ȗ����ꂽ�ꍇ�ɂ�dConnect.setHost()�A
   * dConnect.setPort()�Ŏw�肳�ꂽ�l���ݒ肳���B
   * </p>
   * @memberOf dConnect
   * @class
   * @example
   * var builder = new dConnect.URIBuilder();
   * builder.setProfile('battery');
   * builder.setAttribute('level');
   * builder.setServiceId(serviceId);
   * builder.setAccessToken(accessToken);
   * builder.addParameter('key', 'value');
   *
   * var uri = builder.build();
   *
   * uri��'http://localhost:4035/gotapi/battery/level?serviceId=serviceId&accessToken=accessToken&key=value'�ɕϊ������B
   */
  var URIBuilder = function() {
    this.scheme = sslEnabled ? 'https' : 'http';
    this.host = host;
    this.port = port;
    this.api = 'gotapi';
    this.profile = null;
    this.inter = null;
    this.attribute = null;
    this.params = {};
  };
  parent.URIBuilder = URIBuilder;

  /**
   * �X�L�[������ݒ肷��B
   * <p>
   * �f�t�H���g�ł́AdConnect.isSSLEnabled()���^�̏ꍇ��https�A�����łȂ��ꍇ�ɂ�http���ݒ肳��Ă���B<br/>
   * </p>
   * @memberOf dConnect.URIBuilder
   * @param {String} scheme �X�L�[����
   * @return {URIBuilder} �������g�̃C���X�^���X
   */
  URIBuilder.prototype.setScheme = function(scheme) {
    this.scheme = scheme;
    return this;
  };
  /**
   * �X�L�[�}�����擾����B
   * @memberOf dConnect.URIBuilder
   * @return {String} �X�L�[�}��
   */
  URIBuilder.prototype.getScheme = function() {
    return this.scheme;
  };

  /**
   * API���擾����B
   * �f�t�H���g�ł�gotapi���w�肳���B
   * @memberOf dConnect.URIBuilder
   * @return {String} API
   */
  URIBuilder.prototype.getApi = function() {
    return this.api;
  };

  /**
   * API��ݒ肷��B
   * <p>
   * �f�t�H���g�ł�gotapi���w�肳���B
   * </p>
   * @memberOf dConnect.URIBuilder
   * @param {String} api API
   * @return {URIBuilder} �������g�̃C���X�^���X
   */
  URIBuilder.prototype.setApi = function(api) {
    this.api = api;
    return this;
  }
  /**
   * �z�X�g����ݒ肷��B
   * <p>
   * �f�t�H���g�ł́AdConnect.setHost()�Őݒ肳�ꂽ�l���ݒ肳���B<br/>
   * �����ݒ肵�Ă��Ȃ��ꍇ�ɂ�localhost���ݒ肳���B
   * </p>
   * @memberOf dConnect.URIBuilder
   * @param {String} host �z�X�g��
   * @return {URIBuilder} �������g�̃C���X�^���X
   */
  URIBuilder.prototype.setHost = function(host) {
    this.host = host;
    return this;
  };
  /**
   * �z�X�g�����擾����B
   * @memberOf dConnect.URIBuilder
   * @return {String} �z�X�g��
   */
  URIBuilder.prototype.getHost = function() {
    return this.host;
  };

  /**
   * �|�[�g�ԍ���ݒ肷��B
   * <p>
   * �f�t�H���g�ł́AdConnect.setPort()�Őݒ肳�ꂽ�l���ݒ肳���B<br/>
   * �����ݒ肵�Ă��Ȃ��ꍇ�ɂ�4035���ݒ肳���B
   * </p>
   * @memberOf dConnect.URIBuilder
   * @param {Number} port �|�[�g�ԍ�
   * @return {URIBuilder} �������g�̃C���X�^���X
   */
  URIBuilder.prototype.setPort = function(port) {
    this.port = port;
    return this;
  };

  /**
   * �|�[�g�ԍ����擾����B
   * @memberOf dConnect.URIBuilder
   * @return {Number} �|�[�g�ԍ�
   */
  URIBuilder.prototype.getPort = function() {
    return this.port;
  };

  /**
   * �v���t�@�C������ݒ肷��B
   * <p>
   * Device Connect�Œ�`���Ă���v���t�@�C�������w�肷�邱�ƁB<br/>
   * <ul>
   * <li>servicediscovery</li>
   * <li>system</li>
   * <li>battery</li>
   * <li>mediastreamrecording</li>
   * </ul>
   * �ȂǂȂǁB
   * </p>
   * @memberOf dConnect.URIBuilder
   * @param {String} profile �v���t�@�C����
   * @return {URIBuilder} �������g�̃C���X�^���X
   */
  URIBuilder.prototype.setProfile = function(profile) {
    this.profile = profile;
    return this;
  };

  /**
   * �v���t�@�C�������擾����B
   * @memberOf dConnect.URIBuilder
   * @return {String} �v���t�@�C����
   */
  URIBuilder.prototype.getProfile = function() {
    return this.profile;
  };

  /**
   * �C���^�[�t�F�[�X����ݒ肷��B
   *
   * @param {String} inter �C���^�[�t�F�[�X��
   * @return {URIBuilder} �������g�̃C���X�^���X
   */
  URIBuilder.prototype.setInterface = function(inter) {
    this.inter = inter;
    return this;
  };

  /**
   * �C���^�[�t�F�[�X�����擾����B
   * @memberOf dConnect.URIBuilder
   * @return {String} �C���^�[�t�F�[�X��
   */
  URIBuilder.prototype.getInterface = function() {
    return this.inter;
  };

  /**
   * �A�g���r���[�g����ݒ肷��B
   * @memberOf dConnect.URIBuilder
   * @param {String} attribute �A�g���r���[�g��
   * @return {URIBuilder} �������g�̃C���X�^���X
   */
  URIBuilder.prototype.setAttribute = function(attribute) {
    this.attribute = attribute;
    return this;
  };

  /**
   * �A�g���r���[�g�����擾����B
   * @memberOf dConnect.URIBuilder
   * @return {String} �A�g���r���[�g��
   */
  URIBuilder.prototype.getAttribute = function() {
    return this.attribute;
  };

  /**
   * �T�[�r�XID��ݒ肷��B
   * @memberOf dConnect.URIBuilder
   * @param {String} serviceId �T�[�r�XID
   * @return {URIBuilder} �������g�̃C���X�^���X
   */
  URIBuilder.prototype.setServiceId = function(serviceId) {
    this.params['serviceId'] = serviceId;
    return this;
  };

  /**
   * �A�N�Z�X�g�[�N����ݒ肷��B
   * @memberOf dConnect.URIBuilder
   * @param {String} accessToken �A�N�Z�X�g�[�N��
   * @return {URIBuilder} �������g�̃C���X�^���X
   */
  URIBuilder.prototype.setAccessToken = function(accessToken) {
    this.params['accessToken'] = accessToken;
    return this;
  };

  /**
   * �Z�b�V�����L�[��ݒ肷��B
   * @memberOf dConnect.URIBuilder
   * @param {String} sessionKey �Z�b�V�����L�[
   * @return {URIBuilder} �������g�̃C���X�^���X
   * @deprecated
   */
  URIBuilder.prototype.setSessionKey = function(sessionKey) {
    this.params['sessionKey'] = sessionKey;
    return this;
  };

  /**
   * �p�����[�^��ǉ�����B
   * @memberOf dConnect.URIBuilder
   * @param {String} key �L�[
   * @param {Object.<String, String>} value �o�����[
   * @return {URIBuilder} �������g�̃C���X�^���X
   */
  URIBuilder.prototype.addParameter = function(key, value) {
    this.params[key] = value;
    return this;
  };

  /**
   * URI�ɕϊ�����B
   * @memberOf dConnect.URIBuilder
   * @return {String} uri
   */
  URIBuilder.prototype.build = function() {
    var uri = this.scheme + '://' + this.host + ':' + this.port;
    if (this.api) {
      uri += '/' + encodeURIComponent(this.api);
    }
    if (this.profile) {
      uri += '/' + encodeURIComponent(this.profile);
    }
    if (this.inter) {
      uri += '/' + encodeURIComponent(this.inter);
    }
    if (this.attribute) {
      uri += '/' + encodeURIComponent(this.attribute);
    }
    if (this.params) {
      var p = '';
      var param;
      for (var key in this.params) {
          param = this.params[key]
          if (param !== null && param !== undefined) {
            p += (p.length == 0) ? '?' : '&';
            p += encodeURIComponent(key) + '=' + encodeURIComponent(param);
          }
      }
      uri += p;
    }
    return uri;
  };

  if (global.process) {
    exports.dConnect = dConnect;
  }
  // global.dConnect = dConnect;

  document.addEventListener('DOMContentLoaded', function(event) {
    // parent.checkDConnect();
  });

  document.addEventListener('visibilitychange', function(event) {
    if (!document.hidden) {
      if (!_isStartedManager) {
        parent.checkDeviceConnect(function(version) {
          _isStartedManager = true;
          _launchListener(version);
        }, function(errorCode, errorMessage) {
          _isStartedManager = false;
        });
      }
    }
  });

  return parent;
})(dConnect || {}, this.self || global);

/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-2 as well as the corresponding HMAC implementation
 as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2013
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
 */
(function(T) {
  function z(a, c, b) {
    var g = 0, f = [0], h = '', l = null, h = b || 'UTF8';
    if ('UTF8' !== h && 'UTF16' !== h)
      throw 'encoding must be UTF8 or UTF16';
    if ('HEX' === c) {
      if (0 !== a.length % 2)
        throw 'srcString of HEX type must be in byte increments';
      l = B(a);
      g = l.binLen;
      f = l.value
    } else if ('ASCII' === c || 'TEXT' === c)
      l = J(a, h), g = l.binLen, f = l.value;
    else if ('B64' === c)
      l = K(a), g = l.binLen, f = l.value;
    else
      throw 'inputFormat must be HEX, TEXT, ASCII, or B64';
    this.getHash = function(a, c, b, h) {
      var l = null, d = f.slice(), n = g, p;
      3 === arguments.length ? 'number' !== typeof b && ( h = b, b = 1) : 2 === arguments.length && ( b = 1);
      if (b !== parseInt(b, 10) || 1 > b)
        throw 'numRounds must a integer >= 1';
      switch (c) {
        case 'HEX':
          l = L;
          break;
        case 'B64':
          l = M;
          break;
        default:
          throw 'format must be HEX or B64';
      }
      if ('SHA-1' === a)
        for (p = 0; p < b; p++)
          d = y(d, n), n = 160;
      else if ('SHA-224' === a)
        for (p = 0; p < b; p++)
          d = v(d, n, a), n = 224;
      else if ('SHA-256' === a)
        for (p = 0; p < b; p++)
          d = v(d, n, a), n = 256;
      else if ('SHA-384' === a)
        for (p = 0; p < b; p++)
          d = v(d, n, a), n = 384;
      else if ('SHA-512' === a)
        for (p = 0; p < b; p++)
          d = v(d, n, a), n = 512;
      else
        throw 'Chosen SHA variant is not supported';
      return l(d, N(h))
    };
    this.getHMAC = function(a, b, c, l, s) {
      var d, n, p, m, w = [], x = [];
      d = null;
      switch (l) {
        case 'HEX':
          l = L;
          break;
        case 'B64':
          l = M;
          break;
        default:
          throw 'outputFormat must be HEX or B64';
      }
      if ('SHA-1' === c)
        n = 64, m = 160;
      else if ('SHA-224' === c)
        n = 64, m = 224;
      else if ('SHA-256' === c)
        n = 64, m = 256;
      else if ('SHA-384' === c)
        n = 128, m = 384;
      else if ('SHA-512' === c)
        n = 128, m = 512;
      else
        throw 'Chosen SHA variant is not supported';
      if ('HEX' === b)
        d = B(a), p = d.binLen, d = d.value;
      else if ('ASCII' === b || 'TEXT' === b)
        d = J(a, h), p = d.binLen, d = d.value;
      else if ('B64' === b)
        d = K(a), p = d.binLen, d = d.value;
      else
        throw 'inputFormat must be HEX, TEXT, ASCII, or B64';
      a = 8 * n;
      b = n / 4 - 1;
      n < p / 8 ? ( d = 'SHA-1' === c ? y(d, p) : v(d, p, c), d[b] &= 4294967040) : n > p / 8 && (d[b] &= 4294967040);
      for (n = 0; n <= b; n += 1)
        w[n] = d[n] ^ 909522486, x[n] = d[n] ^ 1549556828;
      c = 'SHA-1' === c ? y(x.concat(y(w.concat(f), a + g)), a + m) : v(x.concat(v(w.concat(f), a + g, c)), a + m, c);
      return l(c, N(s))
    }
  }

  function s(a, c) {
    this.a = a;
    this.b = c
  }

  function J(a, c) {
    var b = [], g, f = [], h = 0, l;
    if ('UTF8' === c)
      for (l = 0; l < a.length; l += 1)
        for (g = a.charCodeAt(l), f = [], 2048 < g ? (f[0] = 224 | (g & 61440) >>> 12, f[1] = 128 | (g & 4032) >>> 6, f[2] = 128 | g & 63) : 128 < g ? (f[0] = 192 | (g & 1984) >>> 6, f[1] = 128 | g & 63) : f[0] = g, g = 0; g < f.length; g += 1)
          b[h >>> 2] |= f[g] << 24 - h % 4 * 8, h += 1;
    else if ('UTF16' === c)
      for (l = 0; l < a.length; l += 1)
        b[h >>> 2] |= a.charCodeAt(l) << 16 - h % 4 * 8, h += 2;
    return {
      value: b,
      binLen: 8 * h
    }
  }

  function B(a) {
    var c = [], b = a.length, g, f;
    if (0 !== b % 2)
      throw 'String of HEX type must be in byte increments';
    for (g = 0; g < b; g += 2) {
      f = parseInt(a.substr(g, 2), 16);
      if (isNaN(f))
        throw 'String of HEX type contains invalid characters';
      c[g >>> 3] |= f << 24 - g % 8 * 4
    }
    return {
      value: c,
      binLen: 4 * b
    }
  }

  function K(a) {
    var c = [], b = 0, g, f, h, l, r;
    if (-1 === a.search(/^[a-zA-Z0-9=+\/]+$/))
      throw 'Invalid character in base-64 string';
    g = a.indexOf('=');
    a = a.replace(/\=/g, '');
    if (-1 !== g && g < a.length)
      throw 'Invalid \'=\' found in base-64 string';
    for (f = 0; f < a.length; f += 4) {
      r = a.substr(f, 4);
      for (h = l = 0; h < r.length; h += 1)
        g = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(r[h]), l |= g << 18 - 6 * h;
      for (h = 0; h < r.length - 1; h += 1)
        c[b >> 2] |= (l >>> 16 - 8 * h & 255) << 24 - b % 4 * 8, b += 1
    }
    return {
      value: c,
      binLen: 8 * b
    }
  }

  function L(a, c) {
    var b = '', g = 4 * a.length, f, h;
    for (f = 0; f < g; f += 1)
      h = a[f >>> 2] >>> 8 * (3 - f % 4), b += '0123456789abcdef'.charAt(h >>> 4 & 15) + '0123456789abcdef'.charAt(h & 15);
    return c.outputUpper ? b.toUpperCase() : b
  }

  function M(a, c) {
    var b = '', g = 4 * a.length, f, h, l;
    for (f = 0; f < g; f += 3)
      for (l = (a[f >>> 2] >>> 8 * (3 - f % 4) & 255) << 16 | (a[f + 1 >>> 2] >>> 8 * (3 - (f + 1) % 4) & 255) << 8 | a[f + 2 >>> 2] >>> 8 * (3 - (f + 2) % 4) & 255, h = 0; 4 > h; h += 1)
        b = 8 * f + 6 * h <= 32 * a.length ? b + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.charAt(l >>> 6 * (3 - h) & 63) : b + c.b64Pad;
    return b
  }

  function N(a) {
    var c = {
      outputUpper: !1,
      b64Pad: '='
    };
    try {
      a.hasOwnProperty('outputUpper') && (c.outputUpper = a.outputUpper), a.hasOwnProperty('b64Pad') && (c.b64Pad = a.b64Pad)
    } catch (b) {
    }
    if ('boolean' !== typeof c.outputUpper)
      throw 'Invalid outputUpper formatting option';
    if ('string' !== typeof c.b64Pad)
      throw 'Invalid b64Pad formatting option';
    return c
  }

  function U(a, c) {
    return a << c | a >>> 32 - c
  }

  function u(a, c) {
    return a >>> c | a << 32 - c
  }

  function t(a, c) {
    var b = null, b = new s(a.a, a.b);
    return b = 32 >= c ? new s(b.a >>> c | b.b << 32 - c & 4294967295, b.b >>> c | b.a << 32 - c & 4294967295) : new s(b.b >>> c - 32 | b.a << 64 - c & 4294967295, b.a >>> c - 32 | b.b << 64 - c & 4294967295)
  }

  function O(a, c) {
    var b = null;
    return b = 32 >= c ? new s(a.a >>> c, a.b >>> c | a.a << 32 - c & 4294967295) : new s(0, a.a >>> c - 32)
  }

  function V(a, c, b) {
    return a ^ c ^ b
  }

  function P(a, c, b) {
    return a & c ^ ~a & b
  }

  function W(a, c, b) {
    return new s(a.a & c.a ^ ~a.a & b.a, a.b & c.b ^ ~a.b & b.b)
  }

  function Q(a, c, b) {
    return a & c ^ a & b ^ c & b
  }

  function X(a, c, b) {
    return new s(a.a & c.a ^ a.a & b.a ^ c.a & b.a, a.b & c.b ^ a.b & b.b ^ c.b & b.b)
  }

  function Y(a) {
    return u(a, 2) ^ u(a, 13) ^ u(a, 22)
  }

  function Z(a) {
    var c = t(a, 28), b = t(a, 34);
    a = t(a, 39);
    return new s(c.a ^ b.a ^ a.a, c.b ^ b.b ^ a.b)
  }

  function $(a) {
    return u(a, 6) ^ u(a, 11) ^ u(a, 25)
  }

  function aa(a) {
    var c = t(a, 14), b = t(a, 18);
    a = t(a, 41);
    return new s(c.a ^ b.a ^ a.a, c.b ^ b.b ^ a.b)
  }

  function ba(a) {
    return u(a, 7) ^ u(a, 18) ^ a >>> 3
  }

  function ca(a) {
    var c = t(a, 1), b = t(a, 8);
    a = O(a, 7);
    return new s(c.a ^ b.a ^ a.a, c.b ^ b.b ^ a.b)
  }

  function da(a) {
    return u(a, 17) ^ u(a, 19) ^ a >>> 10
  }

  function ea(a) {
    var c = t(a, 19), b = t(a, 61);
    a = O(a, 6);
    return new s(c.a ^ b.a ^ a.a, c.b ^ b.b ^ a.b)
  }

  function R(a, c) {
    var b = (a & 65535) + (c & 65535);
    return ((a >>> 16) + (c >>> 16) + (b >>> 16) & 65535) << 16 | b & 65535
  }

  function fa(a, c, b, g) {
    var f = (a & 65535) + (c & 65535) + (b & 65535) + (g & 65535);
    return ((a >>> 16) + (c >>> 16) + (b >>> 16) + (g >>> 16) + (f >>> 16) & 65535) << 16 | f & 65535
  }

  function S(a, c, b, g, f) {
    var h = (a & 65535) + (c & 65535) + (b & 65535) + (g & 65535) + (f & 65535);
    return ((a >>> 16) + (c >>> 16) + (b >>> 16) + (g >>> 16) + (f >>> 16) + (h >>> 16) & 65535) << 16 | h & 65535
  }

  function ga(a, c) {
    var b, g, f;
    b = (a.b & 65535) + (c.b & 65535);
    g = (a.b >>> 16) + (c.b >>> 16) + (b >>> 16);
    f = (g & 65535) << 16 | b & 65535;
    b = (a.a & 65535) + (c.a & 65535) + (g >>> 16);
    g = (a.a >>> 16) + (c.a >>> 16) + (b >>> 16);
    return new s((g & 65535) << 16 | b & 65535, f)
  }

  function ha(a, c, b, g) {
    var f, h, l;
    f = (a.b & 65535) + (c.b & 65535) + (b.b & 65535) + (g.b & 65535);
    h = (a.b >>> 16) + (c.b >>> 16) + (b.b >>> 16) + (g.b >>> 16) + (f >>> 16);
    l = (h & 65535) << 16 | f & 65535;
    f = (a.a & 65535) + (c.a & 65535) + (b.a & 65535) + (g.a & 65535) + (h >>> 16);
    h = (a.a >>> 16) + (c.a >>> 16) + (b.a >>> 16) + (g.a >>> 16) + (f >>> 16);
    return new s((h & 65535) << 16 | f & 65535, l)
  }

  function ia(a, c, b, g, f) {
    var h, l, r;
    h = (a.b & 65535) + (c.b & 65535) + (b.b & 65535) + (g.b & 65535) + (f.b & 65535);
    l = (a.b >>> 16) + (c.b >>> 16) + (b.b >>> 16) + (g.b >>> 16) + (f.b >>> 16) + (h >>> 16);
    r = (l & 65535) << 16 | h & 65535;
    h = (a.a & 65535) + (c.a & 65535) + (b.a & 65535) + (g.a & 65535) + (f.a & 65535) + (l >>> 16);
    l = (a.a >>> 16) + (c.a >>> 16) + (b.a >>> 16) + (g.a >>> 16) + (f.a >>> 16) + (h >>> 16);
    return new s((l & 65535) << 16 | h & 65535, r)
  }

  function y(a, c) {
    var b = [], g, f, h, l, r, s, u = P, t = V, v = Q, d = U, n = R, p, m, w = S, x, q = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    a[c >>> 5] |= 128 << 24 - c % 32;
    a[(c + 65 >>> 9 << 4) + 15] = c;
    x = a.length;
    for (p = 0; p < x; p += 16) {
      g = q[0];
      f = q[1];
      h = q[2];
      l = q[3];
      r = q[4];
      for (m = 0; 80 > m; m += 1)
        b[m] = 16 > m ? a[m + p] : d(b[m - 3] ^ b[m - 8] ^ b[m - 14] ^ b[m - 16], 1), s = 20 > m ? w(d(g, 5), u(f, h, l), r, 1518500249, b[m]) : 40 > m ? w(d(g, 5), t(f, h, l), r, 1859775393, b[m]) : 60 > m ? w(d(g, 5), v(f, h, l), r, 2400959708, b[m]) : w(d(g, 5), t(f, h, l), r, 3395469782, b[m]), r = l, l = h, h = d(f, 30), f = g, g = s;
      q[0] = n(g, q[0]);
      q[1] = n(f, q[1]);
      q[2] = n(h, q[2]);
      q[3] = n(l, q[3]);
      q[4] = n(r, q[4])
    }
    return q
  }

  function v(a, c, b) {
    var g, f, h, l, r, t, u, v, z, d, n, p, m, w, x, q, y, C, D, E, F, G, H, I, e, A = [], B, k = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
    d = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428];
    f = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
    if ('SHA-224' === b || 'SHA-256' === b)
      n = 64, g = (c + 65 >>> 9 << 4) + 15, w = 16, x = 1, e = Number, q = R, y = fa, C = S, D = ba, E = da, F = Y, G = $, I = Q, H = P, d = 'SHA-224' === b ? d : f;
    else if ('SHA-384' === b || 'SHA-512' === b)
      n = 80, g = (c + 128 >>> 10 << 5) + 31, w = 32, x = 2, e = s, q = ga, y = ha, C = ia, D = ca, E = ea, F = Z, G = aa, I = X, H = W, k = [new e(k[0], 3609767458), new e(k[1], 602891725), new e(k[2], 3964484399), new e(k[3], 2173295548), new e(k[4], 4081628472), new e(k[5], 3053834265), new e(k[6], 2937671579), new e(k[7], 3664609560), new e(k[8], 2734883394), new e(k[9], 1164996542), new e(k[10], 1323610764), new e(k[11], 3590304994), new e(k[12], 4068182383), new e(k[13], 991336113), new e(k[14], 633803317), new e(k[15], 3479774868), new e(k[16], 2666613458), new e(k[17], 944711139), new e(k[18], 2341262773), new e(k[19], 2007800933), new e(k[20], 1495990901), new e(k[21], 1856431235), new e(k[22], 3175218132), new e(k[23], 2198950837), new e(k[24], 3999719339), new e(k[25], 766784016), new e(k[26], 2566594879), new e(k[27], 3203337956), new e(k[28], 1034457026), new e(k[29], 2466948901), new e(k[30], 3758326383), new e(k[31], 168717936), new e(k[32], 1188179964), new e(k[33], 1546045734), new e(k[34], 1522805485), new e(k[35], 2643833823), new e(k[36], 2343527390), new e(k[37], 1014477480), new e(k[38], 1206759142), new e(k[39], 344077627), new e(k[40], 1290863460), new e(k[41], 3158454273), new e(k[42], 3505952657), new e(k[43], 106217008), new e(k[44], 3606008344), new e(k[45], 1432725776), new e(k[46], 1467031594), new e(k[47], 851169720), new e(k[48], 3100823752), new e(k[49], 1363258195), new e(k[50], 3750685593), new e(k[51], 3785050280), new e(k[52], 3318307427), new e(k[53], 3812723403), new e(k[54], 2003034995), new e(k[55], 3602036899), new e(k[56], 1575990012), new e(k[57], 1125592928), new e(k[58], 2716904306), new e(k[59], 442776044), new e(k[60], 593698344), new e(k[61], 3733110249), new e(k[62], 2999351573), new e(k[63], 3815920427), new e(3391569614, 3928383900), new e(3515267271, 566280711), new e(3940187606, 3454069534), new e(4118630271, 4000239992), new e(116418474, 1914138554), new e(174292421, 2731055270), new e(289380356, 3203993006), new e(460393269, 320620315), new e(685471733, 587496836), new e(852142971, 1086792851), new e(1017036298, 365543100), new e(1126000580, 2618297676), new e(1288033470, 3409855158), new e(1501505948, 4234509866), new e(1607167915, 987167468), new e(1816402316, 1246189591)], d = 'SHA-384' === b ? [new e(3418070365, d[0]), new e(1654270250, d[1]), new e(2438529370, d[2]), new e(355462360, d[3]), new e(1731405415, d[4]), new e(41048885895, d[5]), new e(3675008525, d[6]), new e(1203062813, d[7])] : [new e(f[0], 4089235720), new e(f[1], 2227873595), new e(f[2], 4271175723), new e(f[3], 1595750129), new e(f[4], 2917565137), new e(f[5], 725511199), new e(f[6], 4215389547), new e(f[7], 327033209)];
    else
      throw 'Unexpected error in SHA-2 implementation';
    a[c >>> 5] |= 128 << 24 - c % 32;
    a[g] = c;
    B = a.length;
    for (p = 0; p < B; p += w) {
      c = d[0];
      g = d[1];
      f = d[2];
      h = d[3];
      l = d[4];
      r = d[5];
      t = d[6];
      u = d[7];
      for (m = 0; m < n; m += 1)
        A[m] = 16 > m ? new e(a[m * x + p], a[m * x + p + 1]) : y(E(A[m - 2]), A[m - 7], D(A[m - 15]), A[m - 16]), v = C(u, G(l), H(l, r, t), k[m], A[m]), z = q(F(c), I(c, g, f)), u = t, t = r, r = l, l = q(h, v), h = f, f = g, g = c, c = q(v, z);
      d[0] = q(c, d[0]);
      d[1] = q(g, d[1]);
      d[2] = q(f, d[2]);
      d[3] = q(h, d[3]);
      d[4] = q(l, d[4]);
      d[5] = q(r, d[5]);
      d[6] = q(t, d[6]);
      d[7] = q(u, d[7])
    }
    if ('SHA-224' === b)
      a = [d[0], d[1], d[2], d[3], d[4], d[5], d[6]];
    else if ('SHA-256' === b)
      a = d;
    else if ('SHA-384' === b)
      a = [d[0].a, d[0].b, d[1].a, d[1].b, d[2].a, d[2].b, d[3].a, d[3].b, d[4].a, d[4].b, d[5].a, d[5].b];
    else if ('SHA-512' === b)
      a = [d[0].a, d[0].b, d[1].a, d[1].b, d[2].a, d[2].b, d[3].a, d[3].b, d[4].a, d[4].b, d[5].a, d[5].b, d[6].a, d[6].b, d[7].a, d[7].b];
    else
      throw 'Unexpected error in SHA-2 implementation';
    return a
  }


  'function' === typeof define && typeof define.amd ? define(function() {
    return z
  }) : 'undefined' !== typeof exports ? 'undefined' !== typeof module && module.exports ? module.exports = exports = z : exports = z : T.jsSHA = z
})(this);
