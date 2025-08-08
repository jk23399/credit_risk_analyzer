# repack_models.py
import joblib

SRC_APPROVAL = "models/low_cohort_approval_model.joblib"
SRC_RATE     = "models/interest_rate_model.joblib"

DST_APPROVAL = "models/low_cohort_approval_model.v171.joblib"
DST_RATE     = "models/interest_rate_model.v171.joblib"

def main():
    # 기존 모델 로드 (경고는 뜰 수 있음)
    approval = joblib.load(SRC_APPROVAL)
    rate = joblib.load(SRC_RATE)

    # 간단한 점검(있으면 출력)
    for name, mdl in [("approval", approval), ("interest", rate)]:
        try:
            print(f"[{name}] type:", type(mdl))
            if hasattr(mdl, "feature_names_in_"):
                print(f"[{name}] feature_names_in_:", list(mdl.feature_names_in_))
        except Exception as e:
            print(f"[{name}] inspect error:", e)

    # 현재 환경( sklearn 1.7.1 )으로 다시 저장
    joblib.dump(approval, DST_APPROVAL)
    joblib.dump(rate, DST_RATE)
    print("Saved:")
    print(" -", DST_APPROVAL)
    print(" -", DST_RATE)

if __name__ == "__main__":
    main()
