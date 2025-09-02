# wol-server

简易 WOL 服务端

需求 Node >= 18

复制 `config.template.yml` 到 `config.yml` 并自行配置，要去掉不用的配置项

## API

### GET `/<id>`

唤醒指定设备，并按照配置进行 tcping 及发送通知

### GET `/<id>/ping`

对指定设备进行一次 tcping，返回结果 `true` 或 `false`

若 `checks` 设置了多个目标，则结果会用英文逗号 `,` 分隔
