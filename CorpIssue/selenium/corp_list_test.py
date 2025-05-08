from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import random
import time
"""python e:\Projects\Django\Local\SalesManagement\CorpIssue\selenium\corp_list.py"""

def test_select_corp_and_version():
    # Automatically download and manage ChromeDriver
    service = ChromeService(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)

    try:
        driver.get("http://127.0.0.1:8000/SalesManagement/CorpIssue/corps")
        wait = WebDriverWait(driver, 10)

        corps = driver.find_elements(By.CSS_SELECTOR, ".corp-item")
        for corp in corps:
            corp.click()
            time.sleep(1)  # Wait for the page to update

            # Try to find the version select and the submit button
            try:
                version_select = wait.until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "select[name='selected_version'], #version-select"))
                )
                create_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit'], #create-version-btn")
                if create_btn.is_enabled():
                    options = version_select.find_elements(By.TAG_NAME, "option")
                    valid_options = [o for o in options if o.get_attribute("value")]
                    if valid_options:
                        random_option = random.choice(valid_options)
                        Select(version_select).select_by_value(random_option.get_attribute("value"))
                        create_btn.click()
                        print("Test passed: Submitted new version for corp.")
                        break
            except Exception:
                continue  # Try next corp

    finally:
        driver.quit()

if __name__ == "__main__":
    test_select_corp_and_version()