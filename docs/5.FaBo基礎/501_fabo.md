# 5.1 FaBo Pluginの設定

## 動作確認

FaBoのLED Brickを以下の写真のようにD2に接続します。
初期状態ではLEDは消えています。

![](./img/usb006.png)

![](./img/usb007.png)

![](./img/usb004.png)

![](./img/usb005.png)

PUT /gotapi/gpio/digital/D2を選択し、Send Requestをタップします。

![](./img/usb008.png)

すると以下の写真のようにLEDが点灯します。

![](./img/usb009.jpg)

次にDELETE /gotapi/gpio/digital/D2を選択し、Send Requestをタップします。

![](./img/usb010.png)

すると今度は以下の写真のようにLEDが消灯します。

![](./img/usb011.png)
