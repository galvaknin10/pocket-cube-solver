from playwright.sync_api import sync_playwright

# E2E test for the "Gemini Insight" button — ensures a fun fact is shown after API call
def test_gemini_insight_button_success():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Open the frontend app
        page.goto("https://galvaknin10.github.io/pocket-cube-solver/")


        # Trigger the Gemini fun fact request
        page.locator("button.fun-fact").click()

        # Wait for the fun fact message to appear in the DOM
        msg = page.wait_for_selector(".fun-fact-message", timeout=5000)

        # Assert the message contains expected keywords
        assert "cube" in msg.inner_text().lower() or "rubik" in msg.inner_text().lower()

        browser.close()
