# 5.2 LEDの操作(アドレスバー)

## LEDの操作

|操作|Endpoint|メソッド|
|:--|:--|:--|
|LEDの状態の変更|http://IP:4035/gotapi/gpio/digital/D2?serviceId=#####|POST|
|LEDの点灯|http://IP:4035/gotapi/gpio/digital/D2?serviceId=#####|PUT|
|LEDの消灯|http://IP:4035/gotapi/gpio/digital/D2?serviceId=#####|DELETE|
|LEDの状態の取得|http://IP:4035/gotapi/gpio/digital/D2?serviceId=#####|GET|

## URLによる擬似的なRESTFUL

|操作|Endpoint|
|:--|:--|
|LEDの状態の変更|http://IP:4035/gotapi/post/gpio/digital/D2?serviceId=#####&value=1|
|LEDの点灯|http://IP:4035/gotapi/put/gpio/digital/D2?serviceId=#####|
|LEDの消灯|http://IP:4035/gotapi/delete/gpio/digital/D2?serviceId=#####|
|LEDの状態の取得|http://IP:4035/gotapi/gpio/digital/D2?serviceId=#####|
※この時serviceIdにはFaBo PluginのIDを指定します

## LEDを点灯する(PUT)

D2にFaBo LED Brickを接続します。

メモしていたIPアドレスをここから使用します。IPアドレスを自分の環境になおして呼び出しをおこないます。

ブラウザーのアドレスバーに、下記Endpointを入力します。

> http://192.168.0.10:4035/gotapi/put/gpio/digital/D2?serviceId=#########

## LEDを消灯する(DELETE)

ブラウザーのアドレスバーに、下記Endpointを入力します。

> http://192.168.0.10:4035/gotapi/delete/gpio/digital/D2?serviceId=#########

## LEDの状態を変える(POST)

ブラウザーのアドレスバーに、下記Endpointを入力します。

点灯
> http://192.168.0.10:4035/gotapi/post/gpio/digital/D2?serviceId=#########&value=1

消灯
> http://192.168.0.10:4035/gotapi/post/gpio/digital/D2?serviceId=#########&value=0

## LEDの状態を取得する(GET)

> http://192.168.0.10:4035/gotapi/gpio/digital/D2?serviceId=#########
