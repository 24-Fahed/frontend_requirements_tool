import yaml
import json
import os
from typing import Optional
from datetime import datetime, timezone

from models.result import ResultModel


class YamlWriter:
    """写入YAML和JSON格式的需求结果文件"""

    def write_yaml(self, data: ResultModel, file_path: str) -> None:
        export = {
            "project": data.project,
            "submittedAt": data.submittedAt,
            "answers": [],
        }
        for ans in data.answers:
            entry = {
                "categoryId": ans.categoryId,
                "questionId": ans.questionId,
                "type": ans.type,
                "answer": ans.value,
            }
            if ans.customValue:
                entry["customAnswer"] = ans.customValue
            if ans.type == "interactive":
                entry["note"] = "结果详情见 result.json"
            export["answers"].append(entry)

        with open(file_path, "w", encoding="utf-8") as f:
            yaml.dump(export, f, allow_unicode=True, default_flow_style=False, sort_keys=False)

    def write_json(self, data: ResultModel, file_path: str) -> None:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data.model_dump(), f, ensure_ascii=False, indent=2)


class ResultStorage:
    """需求结果存储服务"""

    def __init__(self, output_dir: str):
        self.output_dir = output_dir
        self.yaml_writer = YamlWriter()
        os.makedirs(output_dir, exist_ok=True)

    def save(self, result: ResultModel) -> None:
        result.submittedAt = datetime.now(timezone.utc).isoformat()
        yaml_path = os.path.join(self.output_dir, "result.yaml")
        json_path = os.path.join(self.output_dir, "result.json")
        self.yaml_writer.write_yaml(result, yaml_path)
        self.yaml_writer.write_json(result, json_path)

    def load(self) -> Optional[dict]:
        json_path = os.path.join(self.output_dir, "result.json")
        if not os.path.exists(json_path):
            return None
        with open(json_path, "r", encoding="utf-8") as f:
            return json.load(f)
