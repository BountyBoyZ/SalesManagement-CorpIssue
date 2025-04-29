from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import time
import os

"""
python e:\Projects\Django\Local\SalesManagement\CorpIssue\selenium\sales_manager_ud.py

"""

def test_sales_manager_download_upload():
    service = ChromeService(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    wait = WebDriverWait(driver, 20)
    driver.get("http://127.0.0.1:8000/SalesManagement/CorpIssue/sales_manager/3/")

    try:
        # 1. Click the دانلود button in the table
        download_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".download-btn:not([disabled])")))
        download_btn.click()
        time.sleep(2)  # Wait for download to start (adjust if needed)

        # 2. Click مرحله بعد button
        next_stage_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".next-stage-btn")))
        next_stage_btn.click()

        # 3. Wait for modal and press تایید
        confirm_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "#next-stage-modal .confirm-btn")))
        confirm_btn.click()

        # 4. Wait for page to refresh and show new fields (upload section)
        # Wait for the انتخاب فایل button to appear
        select_file_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".select-file-btn")))
        select_file_btn.click()

        # 5. Upload the file using the hidden input
        file_input = wait.until(EC.presence_of_element_located((By.ID, "main_upload_file")))
        file_path = r"E:\Projects\Django\Local\SalesManagement\static\CorpIssue\Excel_Selenium\invoice_ASI_9.03.xlsx"
        assert os.path.exists(file_path), f"File not found: {file_path}"
        file_input.send_keys(file_path)
        time.sleep(1)

        # 6. Click آپلود button in the table
        upload_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".upload-btn")))
        upload_btn.click()

        # 7. Wait for modal and press تایید
        confirm_btn2 = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "#next-stage-modal .confirm-btn")))
        confirm_btn2.click()

        print("Test passed: Downloaded, uploaded, and confirmed as sales manager.")
        time.sleep(2)

    finally:
        driver.quit()

if __name__ == "__main__":
    test_sales_manager_download_upload()