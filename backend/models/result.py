from pydantic import BaseModel
from typing import Optional, Any


class AnswerModel(BaseModel):
    categoryId: str
    questionId: str
    type: str
    value: Any = None
    customValue: Optional[str] = None


class ResultModel(BaseModel):
    project: dict
    submittedAt: str
    answers: list[AnswerModel]
