from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    siliconflow_api_key: str = ""
    temp_dir: Path = Path("/tmp/violet")
    siliconflow_api_base_url: str = "https://api.siliconflow.cn/v1/audio/transcriptions"
    asr_model: str = "FunAudioLLM/SenseVoiceSmall"

    @property
    def api_key_configured(self) -> bool:
        return bool(self.siliconflow_api_key and self.siliconflow_api_key != "sk-xxx")


settings = Settings()
