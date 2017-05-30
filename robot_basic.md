# RobotCarの操作(アドレスバー)

## URLによる擬似的なRESTFUL

|操作|Endpoint|メソッド|
|:--|:--|:--|
|前進(speed=1)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=1&angle=0|POST|
|更新(speed=-1)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=-1&angle=0|POST|
|停止(speed=0)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=0&angle=0|POST|
|回転(angle=360)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=1&angle=360|POST|
|回転(angle=-360)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=1&angle=-360|POST|


## 引数

|変数名|範囲|
|:--|:--|
|speed|-1〜1|
|angle|-360〜360|


