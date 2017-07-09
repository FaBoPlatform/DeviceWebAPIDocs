# 2.5 setting.jsの設定

## 設定する項目

[http://www.fabo.io/deviceconnect/js/sample.zip](sample.zip)をダウンロードし、解凍します。

![](/img/samplezip001.png)

sample/lib/setting.jsをSublime textで開き、設定値を自分の環境に書き直します。

```javascript
var ip = "192.168.0.46";
var port = "4035";
var gpioId = "gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
var hostId = "Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";
var mouseId = "mouse_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
```

|Web名|URL|
|:--|:--|
|ip| DeviceWebAPI Managerが起動しているデバイスのIPアドレス(`IPとPortの確認`の項目で取得方法は解説)|
|port|DeviceWebAPI Managerのport番号(`IPとPortの確認`の項目で取得方法は解説)|
|gpioId| Gpio Device PluginのServiceId(`SeviceIdの取得`の項目で取得方法は解説) |
|hostId| Host Device PluginのServiceId(`SeviceIdの取得`の項目で取得方法は解説) |
|mouseId| Robot Mouse Device Plugin ServiceId(`SeviceIdの取得`の項目で取得方法は解説) |

の5つになります。

## IPとPortの確認

![](./img/setting001.png)

![](./img/setting005.png)

[全プラグインを再起動する]項目の下に表示されているのが、IPアドレスとPort番号になります。
これをメモしておきます。

## SeviceIdの取得

DeviceWebAPIでは、各機能にアクセスするためにServiceIdが必要となります。
ServiceIdの一覧は、/gotapi/serviceDiscoveryで取得する事が可能です。

各機能のServiceIdは、Checkツールを用いておこないます。

http://www.fabo.io/tool/

`gpioId`, `hostId`, `mouseId`をコピーし、/lib/setting.jsに反映し、保存します。
