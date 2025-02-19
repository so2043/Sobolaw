# pip install fastapi
# pip install "uvicorn[standard]"

from app.models.model import Situation, Precedent, BaseEntity, RecommendPrecedents
from contextlib import asynccontextmanager
from py_eureka_client import eureka_client
from fastapi import FastAPI, APIRouter
from app.utils.recommend_service import getKeywords, recommend_precedent

router = APIRouter()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await eureka_client.init_async(eureka_server="http://172.17.0.1:8761/eureka",
                        app_name="recommend-service",
                        instance_port=8004)
    yield

app = FastAPI(
    title="Recommend-Service",
    description="판례 추천, 판례의 주요 키워드 관련 서버",
    version="0.0.1",
    lifespan=lifespan,
    docs_url="/api/recommend-service/swagger-ui.html",
    openapi_url="/api/recommend-service/openapi.json"
)

# -------------------------------------------------------------------------------------------------------------------------------------------


@router.post("/precedents", summary="유사 판례 추천", description="사용자 상황을 받아서 추천판례와 승소율을 반환하는 api")
async def recommend(situation: Situation):
    recommendPrecedents = await recommend_precedent(situation)
    return BaseEntity(status=200, message="Success", data=recommendPrecedents)



@router.post("/precedents/members", summary="맞춤 판례 추천", description="member_keyword테이블에 저장된 키워드들을 받아 유사 판례를 보내주는 기능")
async def recommendMember(situation: Situation):
    recommendPrecedents = await recommend_precedent(situation)
    return BaseEntity(status=200, message="Success", data=recommendPrecedents)



@router.get("/precedents/{precedentsId}/keywords", summary="판례 키워드 반환", description="판례id를 받아서 키워드들을 반환하는 api")
async def getKeyword(precedentsId: int):
    keywords = getKeywords(precedentsId)
    return BaseEntity(status=200, message="Success", data=keywords)

# -------------------------------------------------------------------------------------------------------------------------------------------


app.include_router(router, prefix="/api/recommend-service")

# uvicorn main:app --reload --host localhost --port 8004

