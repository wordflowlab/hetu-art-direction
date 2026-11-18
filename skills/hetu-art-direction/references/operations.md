# 操作地图

由正式清单生成，执行前发现当前安装版Schema。

| 动作 | 用途 | 必填参数 | 效果 |
| --- | --- | --- | --- |
| list_projects | 查找专业工程 |  | read |
| get_project | 读取固定专业工程 | object_id | read |
| save_project | 保存专业工程 | expected_revision, expected_sha256, operation_key, content | managed_write |
| put_reference | 维护图像参考 | object_id, expected_revision, expected_sha256, operation_key, reference | managed_write |
| remove_reference | 移除图像参考 | object_id, expected_revision, expected_sha256, operation_key, reference_id | managed_write |
| put_board | 维护参考板 | object_id, expected_revision, expected_sha256, operation_key, board | managed_write |
| remove_board | 移除参考板 | object_id, expected_revision, expected_sha256, operation_key, board_id | managed_write |
| put_palette | 维护色板 | object_id, expected_revision, expected_sha256, operation_key, palette | managed_write |
| remove_palette | 移除色板 | object_id, expected_revision, expected_sha256, operation_key, palette_id | managed_write |
| put_design | 维护设计方案 | object_id, expected_revision, expected_sha256, operation_key, design | managed_write |
| remove_design | 移除设计方案 | object_id, expected_revision, expected_sha256, operation_key, design_id | managed_write |
| put_note | 维护区域意见 | object_id, expected_revision, expected_sha256, operation_key, note | managed_write |
| remove_note | 移除区域意见 | object_id, expected_revision, expected_sha256, operation_key, note_id | managed_write |
| check_designs | 检查素材与设计关联 | object_id | read |
| palette_contrast | 计算色板对比度 | object_id, palette_id | read |
| render_board | 读取实际参考板 | object_id, board_id | read |
| export_board | 导出离线参考板 | object_id, board_id | read |
| compare_designs | 比较两份造型方案 | object_id, from_design_id, to_design_id | read |
| locate_reference | 定位固定参考与区域意见 | object_id, reference_id | read |
| get_source | 读取固定来源 | object_id, source_index | read |
| get_basis | 读取固定专业依据 | object_id, basis_index | read |
| compare_versions | 比较固定修订 | object_id, from_revision, to_revision | read |
| export_project | 导出固定专业报告 | object_id, format | read |
| build_context | 准备有界创作上下文 | object_id, goal, max_chars | read |
| create_handoff | 准备精确AI交接 | object_id, goal | read |
| get_operation | 回读原操作 | operation_key | read |
