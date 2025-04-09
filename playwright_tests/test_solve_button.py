from playwright.sync_api import sync_playwright

# Test: Solving an already solved cube should return a "solved" message
def test_solve_already_solved_cube():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Inject solved cube state
        solved_state = "BBBBGGGGOOOORRRRWWWWYYYY"
        page.evaluate(f"window.setCubeStateFromTest('{solved_state}')")

        # Click Solve
        page.locator("button.find-solution").click()

        # Expect "already solved" message
        already_msg = page.wait_for_selector(".already-solved-message", timeout=10000)
        assert "already in its solved state" in already_msg.inner_text().lower()

        browser.close()


# Test: Providing an invalid cube state should return an error message
def test_invalid_cube_state():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Inject invalid cube state
        state = "BBYBGGGGOOOORRRRWWWWYYYY"
        page.evaluate(f"window.setCubeStateFromTest('{state}')")

        # Click Solve
        page.locator("button.find-solution").click()

        # Expect error message
        msg = page.wait_for_selector(".error-message", timeout=10000)
        assert "invalid pocket cube" in msg.inner_text().lower()

        browser.close()


# Test: A symmetric state should trigger a reorientation notice
def test_symmetric_cube_state():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Inject a cube state with a known symmetric match
        state = "YYBBWWGGOOOORRRRBWBWYGYG"
        page.evaluate(f"window.setCubeStateFromTest('{state}')")

        # Click Solve
        page.locator("button.find-solution").click()

        # Expect symmetric reorientation notice
        msg = page.wait_for_selector(".notice-message", timeout=10000)
        assert "solution found" in msg.inner_text().lower()
        assert "symmetric state" in msg.inner_text().lower()

        browser.close()


# Test: A valid cube should return a successful solution message
def test_valid_cube_solution():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Inject a valid cube state
        state = "WWBBYYGGOOOORRRRGWGWYBYB"
        page.evaluate(f"window.setCubeStateFromTest('{state}')")

        # Click Solve
        page.locator("button.find-solution").click()

        # Expect success solution message
        msg = page.wait_for_selector(".solution-message", timeout=10000)
        assert "solution found" in msg.inner_text().lower()

        browser.close()
