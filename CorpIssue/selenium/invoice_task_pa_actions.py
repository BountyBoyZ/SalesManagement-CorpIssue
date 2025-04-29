from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import random
import time
""" python e:\Projects\Django\Local\SalesManagement\CorpIssue\selenium\invoice_task_pa_actions.py"""
def test_invoice_task_pa_actions():
    service = ChromeService(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    wait = WebDriverWait(driver, 15)
    driver.get("http://127.0.0.1:8000/SalesManagement/CorpIssue/invoicetasks/3/")

    try:
        # Wait for the table to load
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table tbody tr")))

        rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
        if len(rows) < 2:
            print("Not enough tasks to test.")
            return

        # 1. Approve the first task
        first_row = rows[0]
        approve_btn = first_row.find_element(By.CSS_SELECTOR, ".approve-btn")
        approve_btn.click()
        time.sleep(1)  # Wait for reload

        # 2. Reject the second task
        rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")  # Re-find after reload
        second_row = rows[1]
        reject_btn = second_row.find_element(By.CSS_SELECTOR, ".reject-btn")
        reject_btn.click()

        # Wait for modal
        wait.until(EC.visibility_of_element_located((By.ID, "rejection-modal")))

        # Select a random reason
        reason_select = Select(driver.find_element(By.ID, "rejection-reason"))
        options = [o for o in reason_select.options if o.get_attribute("value")]
        random_reason = random.choice(options)
        reason_select.select_by_value(random_reason.get_attribute("value"))

        # Type explanation
        explanation = driver.find_element(By.ID, "rejection-explanation")
        explanation.clear()
        explanation.send_keys("این یک تست هست")

        # Submit rejection
        submit_btn = driver.find_element(By.CSS_SELECTOR, "#rejection-modal .submit-btn")
        submit_btn.click()
        time.sleep(2)  # Wait for reload

        # 3. Click "تایید تمامی تسک ها" button
        approve_all_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".approve-all-btn")))
        approve_all_btn.click()

        # Wait for modal and confirm
        modal_confirm_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "#send-to-sales-manager-modal .confirm-btn")))
        modal_confirm_btn.click()

        print("Test passed: Approved first, rejected second, approved all.")

        time.sleep(2)

    finally:
        driver.quit()

if __name__ == "__main__":
    test_invoice_task_pa_actions()