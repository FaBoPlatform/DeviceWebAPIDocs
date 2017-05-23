# ServiceIdの取得

## SeviceIdの取得

DeviceWebAPI Managerでは、対象とするプラグインにアクセスするために、ServiceIdを用います。

ServiceDiscoveryで対象プラグインのServiceIdを取得します。

![](/img/service001.png)


```javascript
http://192.168.2.105:4035/gotapi/serviceDiscovery
```

> {"online":true,"scopes":["driveController","gpio","serviceInformation"],"id":"gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org","name":"FaBo Device","type":"Unknown"}

の箇所に記載されているServiceIdをコピーします。ServiceIdは、"id":の項目になります。

> "id":"gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org"

これ以後のFaBo Device Pluginの操作は、上記IDを用います。