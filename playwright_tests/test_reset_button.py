from playwright.sync_api import sync_playwright

# Test: Clicking the Reset button should reset cube state, clear steps, and remove arrows
def test_reset_button_resets_state():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Simulate a scrambled cube and active solution steps
        page.evaluate("""
            window.setCubeStateFromTest("YYBBWWGGOOOORRRRBWBWYGYG");
            window.setSolutionStepsFromTest(["U", "F"]);
        """)

        # Manually add a rotation arrow (simulating mid-guide state)
        page.evaluate("""
            document.querySelectorAll('.cubie-face[data-face="U"]').forEach(face => {
                const arrow = document.createElement("div");
                arrow.className = "rotation-arrow";
                face.appendChild(arrow);
            });
        """)

        # Wait briefly for the DOM to update
        page.wait_for_timeout(300)

        # Click the Reset button
        page.locator("button.reset").click()

        # Assert that the restart message appears
        msg = page.wait_for_selector(".restart-cube-message", timeout=3000)
        assert "restart cube state" in msg.inner_text().lower()

        # Confirm all arrows have been removed
        assert not page.locator(".rotation-arrow").is_visible()

        browser.close()
