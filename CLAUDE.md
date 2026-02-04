# PhysRL - 강화학습 기본 모형

## 프로젝트 목적

Q-Learning 알고리즘을 사용하여 Gymnasium의 CartPole 환경에서 막대 균형 유지를 학습하는 강화학습 기본 모형입니다.

## 기술 스택

- Python 3.11+
- NumPy: 수치 계산 및 Q-테이블 관리
- Gymnasium: 강화학습 환경 제공
- Matplotlib: 학습 결과 시각화

## 프로젝트 구조

```
physrl/
├── CLAUDE.md              # 프로젝트 문서
├── requirements.txt       # 의존성 패키지 목록
├── .gitignore            # Git 추적 제외 파일 목록
├── src/                  # 소스 코드 디렉토리
│   ├── agent.py          # Q-Learning 에이전트 구현
│   ├── trainer.py        # 학습 루프 및 훈련 로직
│   ├── analyzer.py       # 학습 결과 분석 및 시각화
│   └── discretizer.py    # 연속 상태 공간 이산화
├── run.py                # 프로젝트 실행 엔트리 포인트
├── results/              # 학습 결과 및 Q-테이블 저장 디렉토리
└── tests/                # 테스트 코드
    └── test_agent.py     # 에이전트 유닛 테스트
```

## 실행 방법

```bash
# 의존성 설치
pip install -r requirements.txt

# 프로젝트 실행
python run.py
```

## 개발 가이드

- Q-테이블 및 학습 결과는 `results/` 디렉토리에 저장됩니다
- 테스트 실행: `pytest tests/`
