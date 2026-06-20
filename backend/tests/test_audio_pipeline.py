import unittest
from unittest.mock import patch

from app.domains.audio_transcript.pipeline import AudioPipelineError, transcribe_uploaded_audio


class AudioPipelineTests(unittest.TestCase):
    @patch("app.domains.audio_transcript.pipeline.settings")
    def test_missing_api_key(self, mock_settings):
        mock_settings.api_key_configured = False
        with self.assertRaises(AudioPipelineError) as ctx:
            transcribe_uploaded_audio(b"data", "test.mp3")
        self.assertEqual(ctx.exception.status_code, 503)

    @patch("app.domains.audio_transcript.pipeline.settings")
    def test_unsupported_format(self, mock_settings):
        mock_settings.api_key_configured = True
        with self.assertRaises(AudioPipelineError) as ctx:
            transcribe_uploaded_audio(b"data", "test.txt")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("不支持", str(ctx.exception))

    @patch("app.domains.audio_transcript.pipeline.settings")
    def test_empty_file(self, mock_settings):
        mock_settings.api_key_configured = True
        with self.assertRaises(AudioPipelineError) as ctx:
            transcribe_uploaded_audio(b"", "test.mp3")
        self.assertEqual(ctx.exception.status_code, 400)


if __name__ == "__main__":
    unittest.main()
