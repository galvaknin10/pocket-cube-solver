from playwright.sync_api import sync_playwright

# Test: Toggle the manual color pick mode (2D unfolded cube view)
def test_manual_color_pick_toggle():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Click the "Manual Color Pick" button to enable 2D mode
        manual_btn = page.locator("button.manual-color")
        manual_btn.click()

        # Expect the 2D unfolded cube view to be visible
        manual_view = page.wait_for_selector(".unfolded-cube", timeout=3000)
        assert manual_view.is_visible()

        # Click the button again to return to 3D mode
        manual_btn.click()

        # Ensure the 2D view is no longer visible
        assert not page.locator(".unfolded-cube").is_visible()

        browser.close()
