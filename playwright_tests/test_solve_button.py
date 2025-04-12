from playwright.sync_api import sync_playwright

# Test: Solving an already solved cube should return a "solved" message
def test_solve_already_solved_cube():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://galvaknin10.github.io/pocket-cube-solver/")


        # Inject solved cube state
        solved_state = "BBBBGGGGOOOORRRRWWWWYYYY"
        page.evaluate(f"window.setCubeStateFromTest('{solved_state}')")

        # Click Solve
        page.locator("button.find-solution").click()

        # Expect "already solved" message
        already_msg = page.wait_for_selector(".already-solved-message", timeout=10000)
        assert "already in its solved state" in already_msg.inner_text().lower()

        browser.close()


