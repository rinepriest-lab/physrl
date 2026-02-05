"""StateDiscretizer 클래스 테스트 모듈."""

import numpy as np
import pytest

from src.discretizer import StateDiscretizer


class TestStateDiscretizerInit:
    """StateDiscretizer 초기화 테스트."""

    def test_init_default_bins(self):
        """기본 n_bins 값(20)으로 초기화되는지 확인."""
        discretizer = StateDiscretizer()
        assert discretizer.n_bins == 20

    def test_init_custom_bins(self):
        """사용자 지정 n_bins 값으로 초기화되는지 확인."""
        discretizer = StateDiscretizer(n_bins=10)
        assert discretizer.n_bins == 10

    def test_init_bins_array_length(self):
        """각 차원의 bin 경계값 배열 길이가 n_bins-1인지 확인."""
        n_bins = 15
        discretizer = StateDiscretizer(n_bins=n_bins)
        for bin_edges in discretizer.bins:
            assert len(bin_edges) == n_bins - 1

    def test_init_bounds_shape(self):
        """bounds 배열이 (4, 2) 형태인지 확인."""
        discretizer = StateDiscretizer()
        assert discretizer.bounds.shape == (4, 2)


class TestDiscretize:
    """discretize 메서드 테스트."""

    def test_discretize_center_values(self):
        """중앙값(0)이 중간 인덱스로 변환되는지 확인."""
        discretizer = StateDiscretizer(n_bins=10)
        state = np.array([0.0, 0.0, 0.0, 0.0])
        result = discretizer.discretize(state)
        # 중앙값은 대략 중간 인덱스(5)에 위치해야 함
        assert all(4 <= idx <= 5 for idx in result)

    def test_discretize_returns_tuple(self):
        """반환 타입이 튜플인지 확인."""
        discretizer = StateDiscretizer(n_bins=10)
        state = np.array([0.0, 0.0, 0.0, 0.0])
        result = discretizer.discretize(state)
        assert isinstance(result, tuple)
        assert len(result) == 4

    def test_discretize_returns_integers(self):
        """반환된 튜플의 모든 요소가 정수인지 확인."""
        discretizer = StateDiscretizer(n_bins=10)
        state = np.array([0.1, -0.2, 0.05, 0.3])
        result = discretizer.discretize(state)
        assert all(isinstance(idx, int) for idx in result)

    def test_discretize_min_boundary(self):
        """최솟값 경계에서 인덱스 0이 반환되는지 확인."""
        discretizer = StateDiscretizer(n_bins=10)
        state = np.array([-4.8, -3.0, -0.418, -3.0])
        result = discretizer.discretize(state)
        assert all(idx == 0 for idx in result)

    def test_discretize_max_boundary(self):
        """최댓값 경계에서 마지막 인덱스가 반환되는지 확인."""
        discretizer = StateDiscretizer(n_bins=10)
        state = np.array([4.8, 3.0, 0.418, 3.0])
        result = discretizer.discretize(state)
        assert all(idx == 9 for idx in result)

    def test_discretize_out_of_range_low(self):
        """범위 아래 값이 0으로 클리핑되는지 확인."""
        discretizer = StateDiscretizer(n_bins=10)
        state = np.array([-10.0, -10.0, -1.0, -10.0])
        result = discretizer.discretize(state)
        assert all(idx == 0 for idx in result)

    def test_discretize_out_of_range_high(self):
        """범위 위 값이 n_bins-1로 클리핑되는지 확인."""
        discretizer = StateDiscretizer(n_bins=10)
        state = np.array([10.0, 10.0, 1.0, 10.0])
        result = discretizer.discretize(state)
        assert all(idx == 9 for idx in result)

    def test_discretize_index_range(self):
        """모든 결과 인덱스가 유효 범위 내에 있는지 확인."""
        discretizer = StateDiscretizer(n_bins=10)
        # 랜덤 상태 테스트
        for _ in range(100):
            state = np.random.uniform(-10, 10, size=4)
            result = discretizer.discretize(state)
            assert all(0 <= idx < 10 for idx in result)


class TestStateShape:
    """state_shape 프로퍼티 테스트."""

    def test_state_shape_default(self):
        """기본 n_bins로 state_shape가 (20, 20, 20, 20)인지 확인."""
        discretizer = StateDiscretizer()
        assert discretizer.state_shape == (20, 20, 20, 20)

    def test_state_shape_custom(self):
        """사용자 지정 n_bins로 state_shape가 올바른지 확인."""
        discretizer = StateDiscretizer(n_bins=15)
        assert discretizer.state_shape == (15, 15, 15, 15)

    def test_state_shape_for_q_table(self):
        """state_shape를 사용해 Q-테이블을 생성할 수 있는지 확인."""
        discretizer = StateDiscretizer(n_bins=5)
        n_actions = 2
        q_table_shape = discretizer.state_shape + (n_actions,)
        q_table = np.zeros(q_table_shape)
        assert q_table.shape == (5, 5, 5, 5, 2)
