import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { saveToken, loadInfo } from "../redux/reducers/user/userSlice";
import { getUserInfo } from "../api/members";
import { requestPermission } from "../utils/notifications";
import { postTokens } from "../api/notification";
import { memberPrecedents } from "../types/DataTypes";
import style from "../styles/common/Login.module.css";
import backImg from "/images/loginBg.jpg";
import LoginBtnKaKao from "/images/KAKAO_LOGIN.png";
import LoginBtnNaver from "/images/NAVER_LOGIN.png";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const tokenURL = `https://j10a604.p.ssafy.io/api/user-service/oauth2/authorization`;

  useEffect(() => {
    const aT = new URL(window.location.href).searchParams.get("accessToken");
    const rT = new URL(window.location.href).searchParams.get("refreshToken");

    if (aT) {
      // 세션에 accessToken을 저장해주자
      dispatch(saveToken({ accessToken: aT, refreshToken: rT }));
    }
    if (accessToken) {
      getUserInfo(accessToken)
        .then((res) => {
          const precedentIds = res.memberPrecedents.map(
            (precedent: memberPrecedents) => precedent?.precedentId
          );
          dispatch(
            loadInfo({
              userId: res.memberId,
              nickname: res.name,
              precedents: precedentIds,
              auth: res.role,
            })
          );
          // requestPermission 함수가 Promise를 반환하므로, then 함수를 사용하여 결과를 받아와야 합니다.
          requestPermission()
            .then((fcmToken) => {
              // console.log(fcmToken);
              // 토큰을 저장하는 함수 호출
              postTokens(res.memberId, fcmToken)
                .then(() => {
                  console.log("redis에 token이랑 memberId 저장");
                })
                .catch((err) => console.error("토큰 저장 중 에러 발생:", err));
            })
            .catch((err) =>
              console.error("푸시 토큰을 가져오는 중 에러 발생:", err)
            );
        })
        .catch((err) => {
          console.log(err);
        });
      navigate("/");
    }
  }, [accessToken]);
  // const data = { memberId: res.memberId, token: fcmToken };
  // postTokens(data);
  // 로그인버튼을 누르면 각 로그인 창으로 간다
  const kakaoLogin = function () {
    window.location.href = `${tokenURL}/kakao`;
  };
  const naverLogin = function () {
    window.location.href = `${tokenURL}/naver`;
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${backImg})`,
        backgroundSize: "cover", // 이미지를 화면에 최대한 맞추기
        backgroundPosition: "center", // 이미지를 가운데 정렬
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white", // 텍스트 색상을 흰색으로 지정
        fontSize: "3rem",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <p>소송 준비의 첫걸음</p>
        <p>소보로와 함께</p>
      </div>
      <img
        src={LoginBtnKaKao}
        className={style["login-btn-kakao"]}
        onClick={kakaoLogin}
        style={{ cursor: "pointer" }}
      />
      <img
        src={LoginBtnNaver}
        className={style["login-btn-naver"]}
        onClick={naverLogin}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}

export default LoginPage;
