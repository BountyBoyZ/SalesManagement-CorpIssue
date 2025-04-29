from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import time

"""
python e:\Projects\Django\Local\SalesManagement\CorpIssue\selenium\invoice_task_productmanager_II.py

"""

def test_project_manager_review_all():
    service = ChromeService(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    wait = WebDriverWait(driver, 15)
    driver.get("http://127.0.0.1:8000/SalesManagement/CorpIssue/invoicetasks/3/")

    try:
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table tbody tr")))

        while True:
            rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
            found = False
            for row in rows:
                # Only process rows with an exclamation mark (info-btn) in the دلیل عدم تایید column
                info_btns = row.find_elements(By.CSS_SELECTOR, "button.info-btn")
                if info_btns:
                    found = True
                    info_btn = info_btns[0]
                    driver.execute_script("arguments[0].scrollIntoView(true);", info_btn)
                    info_btn.click()
                    # Wait for modal
                    wait.until(EC.visibility_of_element_located((By.ID, "rejection-details-modal")))
                    time.sleep(3)
                    # Close modal (cross button)
                    close_btn = driver.find_element(By.CSS_SELECTOR, "#rejection-details-modal .close")
                    close_btn.click()
                    time.sleep(0.5)
                    # Approve the task by clicking the tick icon in عملیات
                    approve_btns = row.find_elements(By.CSS_SELECTOR, ".approve-btn")
                    if approve_btns:
                        approve_btn = approve_btns[0]
                        driver.execute_script("arguments[0].scrollIntoView(true);", approve_btn)
                        approve_btn.click()
                        # Wait for the پاسخ modal to appear
                        wait.until(EC.visibility_of_element_located((By.ID, "response-modal")))
                        # Type in the پاسخ field
                        response_input = driver.find_element(By.ID, "response-text")
                        response_input.clear()
                        response_input.send_keys("این یک تست است")
                        # Click the ثبت پاسخ button
                        submit_btn = driver.find_element(By.CSS_SELECTOR, "#response-modal .submit-btn")
                        submit_btn.click()
                        # Wait for modal to close and page to reload/update
                        wait.until(EC.invisibility_of_element_located((By.ID, "response-modal")))
                        time.sleep(1.5)
                    break  # After action, break to refresh rows
            if not found:
                break  # No more records with info-btn, exit loop

        print("Test passed: All records reviewed, response submitted, and approved.")

    finally:
        driver.quit()

if __name__ == "__main__":
    test_project_manager_review_all()