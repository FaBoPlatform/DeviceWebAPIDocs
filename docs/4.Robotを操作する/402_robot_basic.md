# 4.2 RobotCarの操作(アドレスバー)

## Robotの操作

|操作|Endpoint|メソッド|
|:--|:--|:--|
|前進(speed=1)|http://IP:4035/gotapi/driveController/move?serviceId=####&speed=1&angle=0|POST|
|後進(speed=-1)|http://IP:4035/gotapi/driveController/move?serviceId=####&speed=-1&angle=0|POST|
|停止(speed=0)|http://IP:4035/gotapi/driveController/move?serviceId=####&speed=0&angle=0|POST|
|回転(angle=360)|http://IP:4035/gotapi/driveController/move?serviceId=####&speed=1&angle=360|POST|
|回転(angle=-360)|http://IP:4035/gotapi/driveController/move?serviceId=####&speed=1&angle=-360|POST|


## URLによる擬似的なRESTFUL

|操作|Endpoint|
|:--|:--|
|前進(speed=1)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=1&angle=0|
|後進(speed=-1)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=-1&angle=0|
|停止(speed=0)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=0&angle=0|
|回転(angle=360)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=1&angle=360|
|回転(angle=-360)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=1&angle=-360|
※この時serviceIdにはFaBo PluginのIDを指定します

## 引数

|変数名|範囲|
|:--|:--|
|speed|-1〜1|
|angle|-360〜360|


