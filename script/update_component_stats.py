from __future__ import annotations

import argparse
import copy
import json
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path


CONFIG_PATH = Path(__file__).resolve().with_name("component_stats_fields.json")


def load_field_config(config_path: Path) -> dict[str, object]:
    with config_path.open("r", encoding="utf-8") as file:
        config = json.load(file)

    required_fields = config.get("required_fields", [])
    optional_fields = config.get("optional_fields", [])
    if "组件名" not in required_fields:
        raise ValueError("配置错误：required_fields 必须包含 组件名")

    drawio_file = config.get("drawio_file")
    if not drawio_file:
        raise ValueError("配置错误：缺少 drawio_file")

    return {
        "drawio_file": str((config_path.parent / drawio_file).resolve()),
        "component_diagram_name": config.get("component_diagram_name", "组件统计"),
        "table_diagram_name": config.get("table_diagram_name", "组件统计表"),
        "table_title": config.get("table_title", "组件统计表"),
        "required_fields": required_fields,
        "optional_fields": optional_fields,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="从组件统计界面更新组件统计表")
    parser.add_argument(
        "file",
        nargs="?",
        default=None,
        help="drawio 文件路径，默认从配置文件读取",
    )
    return parser.parse_args()


def find_diagram(root: ET.Element, name: str) -> ET.Element:
    for diagram in root.findall("diagram"):
        if diagram.get("name") == name:
            return diagram
    raise ValueError(f"未找到图层：{name}")


def get_graph_root(diagram: ET.Element) -> ET.Element:
    model = diagram.find("mxGraphModel")
    if model is None:
        raise ValueError(f"图层缺少 mxGraphModel：{diagram.get('name')}")
    graph_root = model.find("root")
    if graph_root is None:
        raise ValueError(f"图层缺少 root：{diagram.get('name')}")
    return graph_root


def get_cell(element: ET.Element) -> ET.Element | None:
    if element.tag == "mxCell":
        return element
    return element.find("mxCell")


def get_parent_id(element: ET.Element) -> str | None:
    cell = get_cell(element)
    return cell.get("parent") if cell is not None else None


def get_geometry(element: ET.Element) -> tuple[float, float]:
    cell = get_cell(element)
    if cell is None:
        return (0.0, 0.0)

    geometry = cell.find("mxGeometry")
    if geometry is None:
        return (0.0, 0.0)

    x = float(geometry.get("x", "0") or "0")
    y = float(geometry.get("y", "0") or "0")
    return (y, x)


def normalize_text(value: str | None) -> str:
    return (value or "").strip()


def extract_components(
    graph_root: ET.Element,
    required_fields: list[str],
    optional_fields: list[str],
) -> tuple[list[dict[str, str]], list[str]]:
    direct_components = [
        element
        for element in graph_root
        if element.tag == "object"
        and normalize_text(element.get("组件名"))
        and get_parent_id(element) == "1"
    ]
    direct_components.sort(key=get_geometry)

    grouped: dict[str, list[ET.Element]] = defaultdict(list)
    for component in direct_components:
        grouped[normalize_text(component.get("组件名"))].append(component)

    conflicts: list[str] = []
    extracted: list[dict[str, str]] = []

    for component_name, items in grouped.items():
        if len(items) > 1:
            conflicts.append(component_name)
            continue

        component = items[0]
        component_info: dict[str, str] = {}
        for field in required_fields + optional_fields:
            component_info[field] = normalize_text(component.get(field))
        extracted.append(component_info)

    extracted.sort(key=lambda item: item["组件名"])
    return extracted, conflicts


def get_table_and_header(
    table_root: ET.Element,
    table_title: str,
    header_component_name: str,
) -> tuple[ET.Element, ET.Element]:
    table = None
    for element in table_root.findall("mxCell"):
        if element.get("value") == table_title:
            table = element
            break

    if table is None:
        raise ValueError("未找到组件统计表主体")

    table_id = table.get("id")
    header_row = None
    for element in table_root.findall("mxCell"):
        if get_parent_id(element) != table_id:
            continue
        if any(
            child.get("value") == header_component_name and get_parent_id(child) == element.get("id")
            for child in table_root.findall("mxCell")
        ):
            header_row = element
            break

    if header_row is None:
        raise ValueError("未找到组件统计表表头")

    return table, header_row


def get_table_columns(table_root: ET.Element, row: ET.Element) -> list[ET.Element]:
    columns = [
        element
        for element in table_root.findall("mxCell")
        if get_parent_id(element) == row.get("id")
    ]
    columns.sort(key=lambda element: get_geometry(element)[1])
    return columns


def build_remark_map(table_root: ET.Element, table: ET.Element, header_row: ET.Element) -> dict[str, str]:
    table_id = table.get("id")
    remark_map: dict[str, str] = {}
    for row in table_root.findall("mxCell"):
        if get_parent_id(row) != table_id or row.get("id") == header_row.get("id"):
            continue

        columns = get_table_columns(table_root, row)
        if len(columns) < 5:
            continue

        component_name = normalize_text(columns[0].get("value"))
        remark = normalize_text(columns[4].get("value"))
        if component_name:
            remark_map[component_name] = remark

    return remark_map


def remove_existing_body_rows(table_root: ET.Element, table: ET.Element, header_row: ET.Element) -> None:
    table_id = table.get("id")
    removable_ids = {
        element.get("id")
        for element in table_root.findall("mxCell")
        if get_parent_id(element) == table_id and element.get("id") != header_row.get("id")
    }

    removable_ids.update(
        element.get("id")
        for element in table_root.findall("mxCell")
        if get_parent_id(element) in removable_ids
    )

    for element in list(table_root):
        element_id = element.get("id")
        if element_id in removable_ids:
            table_root.remove(element)
def update_table(
    table_root: ET.Element,
    components: list[dict[str, str]],
    fields: list[str],
    table_title: str,
) -> None:
    table, header_row = get_table_and_header(table_root, table_title, fields[0])
    remark_map = build_remark_map(table_root, table, header_row)

    body_rows = [
        row
        for row in table_root.findall("mxCell")
        if get_parent_id(row) == table.get("id") and row.get("id") != header_row.get("id")
    ]
    if not body_rows:
        raise ValueError("组件统计表缺少可复用的内容行模板")

    body_rows.sort(key=lambda element: get_geometry(element)[0])
    row_template = body_rows[0]
    column_templates = get_table_columns(table_root, row_template)
    if len(column_templates) != len(fields) + 1:
        raise ValueError(f"组件统计表列模板异常，期望 {len(fields) + 1} 列")

    header_geometry = header_row.find("mxGeometry")
    row_geometry = row_template.find("mxGeometry")
    table_geometry = table.find("mxGeometry")
    if header_geometry is None or row_geometry is None or table_geometry is None:
        raise ValueError("组件统计表缺少几何信息")

    header_height = float(header_geometry.get("height", "50") or "50")
    row_height = float(row_geometry.get("height", "190") or "190")
    title_height = float(table.get("style", "").split("startSize=")[1].split(";")[0]) if "startSize=" in table.get("style", "") else 30.0

    remove_existing_body_rows(table_root, table, header_row)

    for index, component in enumerate(components):
        row = copy.deepcopy(row_template)
        row_id = f"component-stat-row-{index}"
        row.set("id", row_id)
        row.set("parent", table.get("id"))
        row_geom = row.find("mxGeometry")
        if row_geom is not None:
            row_geom.set("y", str(title_height + header_height + index * row_height))
            row_geom.set("height", str(int(row_height)))
        table_root.append(row)

        values = [component.get(field, "") for field in fields]
        values.append(remark_map.get(component["组件名"], ""))

        for col_index, template in enumerate(column_templates):
            column = copy.deepcopy(template)
            column.set("id", f"{row_id}-col-{col_index}")
            column.set("parent", row_id)
            column.set("value", values[col_index])
            table_root.append(column)

    total_height = title_height + header_height + len(components) * row_height
    table_geometry.set("height", str(int(total_height)))


def main() -> int:
    args = parse_args()
    config_path = CONFIG_PATH
    if not config_path.exists():
        raise FileNotFoundError(f"未找到必要配置文件：{config_path}")
    field_config = load_field_config(config_path)
    file_path = Path(args.file).resolve() if args.file else Path(str(field_config["drawio_file"]))

    try:
        tree = ET.parse(file_path)
    except FileNotFoundError as exc:
        raise FileNotFoundError(f"未找到 drawio 文件：{file_path}") from exc

    mxfile = tree.getroot()

    component_diagram = find_diagram(mxfile, str(field_config["component_diagram_name"]))
    table_diagram = find_diagram(mxfile, str(field_config["table_diagram_name"]))

    component_root = get_graph_root(component_diagram)
    table_root = get_graph_root(table_diagram)
    required_fields = field_config["required_fields"]
    optional_fields = field_config["optional_fields"]
    fields = required_fields + optional_fields

    components, conflicts = extract_components(component_root, required_fields, optional_fields)
    update_table(table_root, components, fields, str(field_config["table_title"]))

    try:
        tree.write(str(file_path), encoding="utf-8", xml_declaration=False)
    except PermissionError as exc:
        raise PermissionError(
            f"无法写入 drawio 文件：{file_path}。请确认该文件未被 drawio/编辑器占用，并且当前用户有写权限。"
        ) from exc

    print(f"已写入组件统计表，共 {len(components)} 个组件。")
    if conflicts:
        print("检测到组件名冲突，以下组件已跳过：", file=sys.stderr)
        for name in conflicts:
            print(f"- {name}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
