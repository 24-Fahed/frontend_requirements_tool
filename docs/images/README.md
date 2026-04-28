# 文档图维护约定

`docs/images` 目录中的 PlantUML 源文件与生成图片采用同名约定：

- `图名.puml` 是源文件
- `图名.png` 是生成产物

例如：

- `逻辑架构图.puml`
- `逻辑架构图.png`

这样可以保证维护文档图片时，按照图片文件名就能直接找到对应的源文件。

推荐生成命令：

```powershell
java -jar .\plantuml.jar .\docs\images\*.puml
```

如果新增图，请直接按最终文档展示名创建 `.puml`，不要再使用另一套英文源文件名。
