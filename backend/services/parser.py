import yaml
import json
import os
from typing import Optional

from models.requirement import RequirementDataModel


class YamlParser:
    """解析开发者提供的YAML需求配置文件"""

    def parse_requirements(self, file_path: str) -> RequirementDataModel:
        with open(file_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        return RequirementDataModel(**data)


class JsonParser:
    """解析开发者提供的JSON组件描述和布局定义文件"""

    def parse_components(self, file_path: str) -> dict:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def parse_layouts(self, file_path: str) -> dict:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def parse_default_layout(self, file_path: str, layout_id: Optional[str] = None) -> dict:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        layouts = data.get("layouts", [])
        if layout_id:
            for layout in layouts:
                if layout.get("id") == layout_id:
                    return layout
            return {}
        return data
