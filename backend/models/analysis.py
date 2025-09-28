from pydantic import BaseModel, Field
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema
from typing import Optional, Any
from datetime import datetime
from bson import ObjectId

# Custom Pydantic v2 compatible ObjectId type for MongoDB integration
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        """
        Defines how Pydantic should validate and serialize this custom type.
        """
        def validate(v: Any) -> ObjectId:
            if not ObjectId.is_valid(v):
                raise ValueError("Invalid ObjectId")
            return ObjectId(v)

        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.with_info_plain_validator_function(validate),
            serialization=core_schema.to_string_ser_schema(),
        )

    @classmethod
    def __get_pydantic_json_schema__(
        cls, core_schema: core_schema.CoreSchema, handler: Any
    ) -> JsonSchemaValue:
        """
        Defines how this type should be represented in the OpenAPI JSON schema.
        """
        return handler(core_schema.str_schema())

# Analysis request model for tracking document processing
class AnalysisRequest(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    filename: str
    file_path: str
    query: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    result: Optional[str] = None

    class Config:
        # Enable field aliasing for MongoDB compatibility
        populate_by_name = True
        # Allow custom types like PyObjectId
        arbitrary_types_allowed = True