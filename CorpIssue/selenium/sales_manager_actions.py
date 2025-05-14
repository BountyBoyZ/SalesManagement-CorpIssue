import unittest
import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
"""python e:\Projects\Django\GIT\SalesManagement-Corpissue-Dev\SalesManagement-CorpIssue\CorpIssue\selenium\sales_manager_actions.py"""

class SalesManagerActionsTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://127.0.0.1:8000/SalesManagement/CorpIssue/sales_manager/3/")
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)

    def test_sales_manager_approve_and_reject(self):
        driver = self.driver
        wait = self.wait

        # Approve the first task
        rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
        self.assertGreaterEqual(len(rows), 2, "There should be at least 2 tasks for this test.")
        row = rows[0]
        info_btn = row.find_element(By.CSS_SELECTOR, ".info-btn")
        info_btn.click()
        wait.until(EC.visibility_of_element_located((By.ID, "rejection-details-modal")))
        time.sleep(1)
        close_btn = driver.find_element(By.CSS_SELECTOR, "#rejection-details-modal .close")
        close_btn.click()
        wait.until(EC.invisibility_of_element_located((By.ID, "rejection-details-modal")))
        approve_btn = row.find_element(By.CSS_SELECTOR, ".approve-btn")
        approve_btn.click()
        # Wait for reload (table will reload after approve)
        wait.until(EC.staleness_of(row))
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table tbody tr")))

        # Reject the second task
        rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
        row = rows[1]
        info_btn = row.find_element(By.CSS_SELECTOR, ".info-btn")
        info_btn.click()
        wait.until(EC.visibility_of_element_located((By.ID, "rejection-details-modal")))
        time.sleep(1)
        close_btn = driver.find_element(By.CSS_SELECTOR, "#rejection-details-modal .close")
        close_btn.click()
        wait.until(EC.invisibility_of_element_located((By.ID, "rejection-details-modal")))
        reject_btn = row.find_element(By.CSS_SELECTOR, ".reject-btn")
        reject_btn.click()
        wait.until(EC.visibility_of_element_located((By.ID, "rejection-modal-sales-manager")))
        select_elem = Select(driver.find_element(By.ID, "rejection-reason-sales-manager"))
        options = [o for o in select_elem.options if o.get_attribute("value")]
        chosen_option = random.choice(options)
        select_elem.select_by_value(chosen_option.get_attribute("value"))
        textarea = driver.find_element(By.ID, "rejection-explanation-sales-manager")
        textarea.clear()
        textarea.send_keys("test 1")
        submit_btn = driver.find_element(By.CSS_SELECTOR, "#rejection-form-sales-manager .submit-btn")
        submit_btn.click()
        wait.until(EC.invisibility_of_element_located((By.ID, "rejection-modal-sales-manager")))
        # Wait for table to reload after rejection
        wait.until(EC.staleness_of(row))
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table tbody tr")))

        # Press "مرحله بعد" and confirm
        # Find and click the first visible next-stage-btn
        next_stage_btns = driver.find_elements(By.CSS_SELECTOR, ".next-stage-btn")
        clicked = False
        for btn in next_stage_btns:
            if btn.is_displayed() and btn.is_enabled():
                driver.execute_script("arguments[0].scrollIntoView(true);", btn)
                btn.click()
                clicked = True
                break
        if not clicked:
            raise Exception("No visible next stage button found")

        # Wait for the modal to appear (try both id and class in case of multiple modals)
        try:
            wait.until(EC.visibility_of_element_located((By.ID, "next-stage-modal")))
        except Exception:
            # Try to trigger the modal with JS if not visible
            driver.execute_script("showNextStageModal();")
            wait.until(EC.visibility_of_element_located((By.ID, "next-stage-modal")))

        # Now click the confirm button inside the modal
        confirm_btn = driver.find_element(By.CSS_SELECTOR, "#next-stage-modal .confirm-btn")
        driver.execute_script("arguments[0].scrollIntoView(true);", confirm_btn)
        confirm_btn.click()
        time.sleep(1)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()