# 4.1 Robot Carへの接続

## DeviceWebAPI Managerの起動

DeviceWebAPI Managerを起動します。

![](../img/robotsetting001.png)

FaBo Device, Robo...ouse)のアイコンが非アクティブ状態で表示されているのを確認します。

![](../img/robotsetting002.png)

## Robot Carへの接続

Robot Carから出ているUSBケーブルをスマートフォンに差し込みます。

![](../img/robotsetting003.png)

USBケーブルを差し込むと下記画面が表示されるので、赤丸の箇所をチェックし、OKを押します。

![](../img/robotsetting004.png)

画面が切り替わり、認識と接続が始まります。(2-3秒程度)

![](../img/robotsetting005.png)

FaBo Device, Robo...ouse)のアイコンがアクティブ状態で表示されれば認識成功です!

![](../img/robotsetting006.png)

## スマートフォンをRobotCarにマウント

スマートフォンをRobot Carにマウントします。

![](../img/robotsetting007.png)


## 動作確認

Robo...ouse)のアイコンを選択します。

![](../img/robotsetting008.png)

driveControllerのアイコンを選択します。

![](../img/robotsetting009.png)

ロボットカーを動作させるには、POST /gotapi/driveController/move の項目を選択し、speedを0.50以上にし、Send Requestを押します。

![](../img/robotsetting010.png)

![](../img/robotsetting011.png)

ロボットカーを停止させるには、DELETE /gotapi/driveController/stop の項目を選択し、Send Requestを押します。

![](../img/robotsetting012.png)
