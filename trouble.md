# トラブルシューティング

## I2Cの3軸加速度センサーから値が戻ってこない

![](/img/trouble001.png)

`#601 Motor Sheild`を使用する場合、DCジャックでの電源供給がないと、I2Cへの電源供給が行われません。`#601 Motor Sheild`を使用する場合は、DCジャックにモバイルバッテリーを接続の上、モバイルバッテリーの電源をOnにして、FaBo Device Pluginからアクセスするようにしてください。

![](/img/trouble002.png)

