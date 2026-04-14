from pydantic import BaseModel
from typing import Optional


class ProjectModel(BaseModel):
    id: str
    name: str
    description: Optional[str] = None


class InteractiveConfig(BaseModel):
    defaultLayout: Optional[str] = None


class QuestionModel(BaseModel):
    id: str
    text: str
    purpose: str
    type: str  # text | option | interactive
    options: Optional[list[str]] = None
    allowCustom: Optional[bool] = False
    interactiveConfig: Optional[InteractiveConfig] = None
    note: Optional[str] = None


class CategoryModel(BaseModel):
    id: str
    name: str
    order: int = 0
    questions: list[QuestionModel]


class RequirementDataModel(BaseModel):
    project: ProjectModel
    categories: list[CategoryModel]
