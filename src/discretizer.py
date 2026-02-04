"""연속 상태 공간을 이산 상태 공간으로 변환하는 모듈."""

from typing import Tuple
import numpy as np
import numpy.typing as npt


class StateDiscretizer:
    """CartPole 환경의 연속 상태 공간을 이산 상태 공간으로 변환하는 클래스.

    CartPole-v1 환경은 4차원 연속 상태 공간을 가지며, 각 차원을 지정된 개수의
    구간(bins)으로 나누어 이산화합니다.
    """

    def __init__(self, n_bins: int = 20) -> None:
        """StateDiscretizer 초기화.

        Args:
            n_bins: 각 상태 차원을 나눌 구간의 개수 (기본값: 20)
        """
        self.n_bins = n_bins

        # 각 상태 차원의 범위 정의
        # [카트 위치, 카트 속도, 막대 각도, 막대 각속도]
        self.bounds = np.array([
            [-4.8, 4.8],    # 카트 위치
            [-3.0, 3.0],    # 카트 속도
            [-0.418, 0.418],  # 막대 각도 (약 ±24도)
            [-3.0, 3.0]     # 막대 각속도
        ])

        # 각 차원에 대한 bin 경계값 생성
        # n_bins개의 구간을 만들기 위해 내부 경계값만 사용 (n_bins-1개)
        self.bins = [
            np.linspace(low, high, n_bins + 1)[1:-1]
            for low, high in self.bounds
        ]

    def discretize(self, state: npt.NDArray[np.floating]) -> Tuple[int, int, int, int]:
        """연속 상태를 이산 상태로 변환.

        각 상태 차원을 해당하는 구간 인덱스로 변환합니다.
        범위를 벗어난 값은 자동으로 클리핑됩니다.

        Args:
            state: 4차원 연속 상태 벡터 [위치, 속도, 각도, 각속도]

        Returns:
            4개의 정수로 이루어진 튜플 (각 차원의 구간 인덱스)
            각 인덱스는 0 ~ n_bins-1 범위

        Examples:
            >>> discretizer = StateDiscretizer(n_bins=10)
            >>> state = np.array([0.0, 0.5, 0.0, -0.5])
            >>> discretizer.discretize(state)
            (5, 5, 5, 4)
        """
        # 각 차원을 이산화
        discretized = []
        for i, (value, bin_edges) in enumerate(zip(state, self.bins)):
            # np.digitize를 사용하여 bin 인덱스 계산
            index = np.digitize(value, bin_edges)
            # 0 ~ n_bins-1 범위로 클리핑
            index = np.clip(index, 0, self.n_bins - 1)
            discretized.append(int(index))

        return tuple(discretized)

    @property
    def state_shape(self) -> Tuple[int, int, int, int]:
        """이산화된 상태 공간의 형태.

        Returns:
            각 차원의 구간 개수로 이루어진 튜플
            Q-테이블 생성 시 사용됨
        """
        return (self.n_bins, self.n_bins, self.n_bins, self.n_bins)
