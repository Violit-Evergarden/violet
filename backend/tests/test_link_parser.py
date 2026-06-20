import re
import unittest

from app.services.link_parser import LinkParserError, extract_url


class LinkParserTests(unittest.TestCase):
    def test_extract_url_from_share_text(self):
        share_text = (
            "9.20 :4pm 09/28 cnq:/ I@V.lC 路飞首次连麦jack全程 2⭐️精华 "
            "https://v.douyin.com/OBrtQhfNGFU/ 复制此链接，打开Dou音搜索，直接观看视频！"
        )
        url = extract_url(share_text)
        self.assertTrue(url.startswith("https://v.douyin.com/"))

    def test_extract_url_from_plain_url(self):
        url = extract_url("https://v.douyin.com/OBrtQhfNGFU/")
        self.assertEqual(url, "https://v.douyin.com/OBrtQhfNGFU/")

    def test_extract_url_missing(self):
        with self.assertRaises(LinkParserError):
            extract_url("没有链接的文本")


if __name__ == "__main__":
    unittest.main()
