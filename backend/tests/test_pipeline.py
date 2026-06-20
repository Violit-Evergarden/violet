import unittest
from unittest.mock import patch

from app.domains.video_transcript.pipeline import PipelineError, extract_transcript


class PipelineTests(unittest.TestCase):
    @patch("app.domains.video_transcript.pipeline.settings")
    def test_missing_api_key(self, mock_settings):
        mock_settings.api_key_configured = False
        with self.assertRaises(PipelineError) as ctx:
            extract_transcript("https://v.douyin.com/OBrtQhfNGFU/")
        self.assertEqual(ctx.exception.status_code, 503)
        self.assertIn("SILICONFLOW_API_KEY", str(ctx.exception))

    @patch("app.domains.video_transcript.pipeline.settings")
    def test_invalid_share_text(self, mock_settings):
        mock_settings.api_key_configured = True
        mock_settings.temp_dir.mkdir.return_value = None
        with self.assertRaises(PipelineError) as ctx:
            extract_transcript("没有链接")
        self.assertEqual(ctx.exception.status_code, 400)


if __name__ == "__main__":
    unittest.main()
