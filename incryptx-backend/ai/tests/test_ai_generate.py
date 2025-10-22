import os
import pytest


def test_imports():
    import ai_generate  # noqa: F401
    assert True


@pytest.mark.skip(reason="Heavy model download; run manually if needed")
def test_gen_from_prompt_smoke():
    from ai_generate import gen_from_prompt, AIGenerateConfig
    data = gen_from_prompt("Create a memecoin idea")
    assert "name" in data and "ticker" in data


