from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import time

"""

python e:\Projects\Django\Local\SalesManagement\CorpIssue\selenium\invoice_task_productmanager_I.py

"""

def test_invoice_task_productmanager():
    service = ChromeService(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    wait = WebDriverWait(driver, 15)
    driver.get("http://127.0.0.1:8000/SalesManagement/CorpIssue/invoicetasks/3/")

    try:
        # Wait for the table to load
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table tbody tr")))

        # Find the first row with an exclamation mark (info-btn) in the دلیل عدم تایید column
        info_btn = driver.find_element(By.CSS_SELECTOR, "button.info-btn")
        info_btn.click()

        # Wait for the modal to appear
        wait.until(EC.visibility_of_element_located((By.ID, "rejection-details-modal")))
        time.sleep(3)  # Stay on the modal for 3 seconds

        # Close the modal by clicking the cross button (top right)
        close_btn = driver.find_element(By.CSS_SELECTOR, "#rejection-details-modal .close")
        close_btn.click()
        time.sleep(1)

        # Approve the task by clicking the tick button in عملیات column of the same row
        # Find the first row again (should be the same task)
        first_row = driver.find_element(By.CSS_SELECTOR, "table tbody tr")
        approve_btn = first_row.find_element(By.CSS_SELECTOR, ".approve-btn")
        approve_btn.click()
        time.sleep(2)

        print("Test passed: Viewed rejection reason and approved the task.")

    finally:
        driver.quit()

if __name__ == "__main__":
    test_invoice_task_productmanager()