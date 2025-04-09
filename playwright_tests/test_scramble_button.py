from playwright.sync_api import sync_playwright

# Test: Scramble button triggers both initial and final messages in sequence
def test_scramble_button_and_messages():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Click the "Scramble" button
        page.locator("button.scramble").click()

        # Wait for the initial scramble message to appear
        initial_msg = page.wait_for_selector(".scramble-cube-message", timeout=3000)
        assert "this might take a moment" in initial_msg.inner_text().lower()

        # Wait for the initial message to disappear before checking the final one
        page.wait_for_selector(".scramble-cube-message", state="detached", timeout=10000)

        # Wait for the final "Scrambling Complete" message to appear
        final_msg = page.wait_for_selector(".scramble-cube-message", timeout=15000)
        assert "scrambling complete" in final_msg.inner_text().lower()

        browser.close()
