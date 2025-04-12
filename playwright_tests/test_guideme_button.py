from playwright.sync_api import sync_playwright

# Test: Clicking "Guide Me" with no solution steps should show an error message
def test_guide_me_without_solution():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://galvaknin10.github.io/pocket-cube-solver/")


        # Ensure solutionSteps is empty
        page.evaluate("window.setSolutionStepsFromTest([])")

        # Click "Guide Me"
        page.locator("button.guide-me").click()

        # Assert the no-solution message is shown
        msg = page.wait_for_selector(".no-solution-message", timeout=3000)
        assert "no solution steps" in msg.inner_text().lower()

        browser.close()


# Test: Clicking "Guide Me" with valid steps should show arrows and guidance message
def test_guide_me_with_solution_steps():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://galvaknin10.github.io/pocket-cube-solver/")


        # Inject a valid solution path
        page.evaluate("""
            window.setSolutionStepsFromTest(["U", "D", "B"])
        """)

        # Click "Guide Me"
        page.locator("button.guide-me").click()

        # Wait for the guiding message
        msg = page.wait_for_selector(".guiding-arrows-message", timeout=3000)
        assert "guiding arrows" in msg.inner_text().lower()

        # Check that a rotation arrow appears
        page.wait_for_selector(".rotation-arrow", timeout=3000)

        browser.close()


# Test: Complete the full guide process and confirm final success message
def test_guide_me_with_finish_process():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://galvaknin10.github.io/pocket-cube-solver/")
        

        # Inject cube state and a solution that ends with "Congratulations!"
        page.evaluate("window.setCubeStateFromTest('WWBBYYGGOOOORRRRGWGWYBYB')")
        page.evaluate("""
            window.setSolutionStepsFromTest([
                "D",
                "B",
                "Congratulations!"
            ])
        """)

        # Start the guide process
        page.locator("button.guide-me").click()

        # Step through all moves
        page.evaluate("window.handleUserRotationDone()")
        page.wait_for_timeout(300)
        page.evaluate("window.handleUserRotationDone()")
        page.wait_for_timeout(300)
        page.evaluate("window.handleUserRotationDone()")

        # Expect success message at the end
        success_msg = page.wait_for_selector(".success-message", timeout=3000)
        assert "cube solved" in success_msg.inner_text().lower()

        browser.close()
