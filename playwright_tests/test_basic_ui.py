from playwright.sync_api import sync_playwright

# Basic smoke test to ensure the frontend loads and the title is correct
def test_frontend_homepage():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local frontend app
        page.goto("http://localhost:3000")

        # Assert the page title contains the expected text
        assert "Pocket Cube Simulator" in page.title()

        browser.close()
