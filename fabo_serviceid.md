# ServiceIdの取得



## SeviceIdの取得

DeviceWebAPIでは、各プラグインにアクセスするためにServiceIdが必要となります。
ServiceIdの一覧は、/gotapi/serviceDiscoveryで取得する事が可能です。

![](./img/service001.png)

> http://192.168.10.0:4035/gotapi/serviceDiscovery

今回、FaBo PluginとHost PluginのServiceIdを取得します。
FaBo Pluginは、gpio_service_id.######で始まるIDです。Host Pluginは、Host.####で始まるIDになります。

> {"online":true,"scopes":["vibration","settings","phone","canvas","serviceInformation","keyEvent","mediaPlayer","connect","geolocation","light","notification","touch","file","proximity","deviceOrientation","fileDescriptor","mediaStreamRecording","battery"],"id":"Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org","name":"Host"}

> {"online":true,"scopes":["driveController","gpio","serviceInformation"],"id":"gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org","name":"FaBo Device","type":"Unknown"}

## seetting.jsへの反映

setting.jsをSublime textで開き、sample/lib/setting.jsの設定値を自分の環境に書き直します。

```javascript
var faboId = "gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
var hostId = "Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";
var ip = "192.168.0.68";
var port = "4035";
```
