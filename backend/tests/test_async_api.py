import time
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.models import ExtractResponse


class AsyncExtractTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    @patch("app.core.tasks.extract_transcript")
    def test_async_extract_flow(self, mock_extract):
        mock_extract.return_value = ExtractResponse(
            video_id="123",
            title="测试标题",
            transcript="测试文案",
            duration_seconds=10.0,
        )

        create_resp = self.client.post(
            "/api/tools/video-transcript/extract/async",
            json={"share_text": "https://v.douyin.com/test/"},
        )
        self.assertEqual(create_resp.status_code, 200)
        task_id = create_resp.json()["task_id"]
        self.assertTrue(task_id)

        result = None
        for _ in range(30):
            status_resp = self.client.get(f"/api/tools/video-transcript/tasks/{task_id}")
            self.assertEqual(status_resp.status_code, 200)
            payload = status_resp.json()
            if payload["status"] == "done":
                result = payload["result"]
                break
            time.sleep(0.1)

        self.assertIsNotNone(result)
        self.assertEqual(result["transcript"], "测试文案")

    def test_task_not_found(self):
        resp = self.client.get("/api/tasks/not-exists")
        self.assertEqual(resp.status_code, 404)


if __name__ == "__main__":
    unittest.main()
