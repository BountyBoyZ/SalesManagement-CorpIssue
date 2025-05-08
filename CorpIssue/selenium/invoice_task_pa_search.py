from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import time

"""

python e:\Projects\Django\Local\SalesManagement\CorpIssue\selenium\invoice_task_pa_search.py

"""

def test_product_assistant_filters():
    service = ChromeService(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    wait = WebDriverWait(driver, 15)
    driver.get("http://127.0.0.1:8000/SalesManagement/CorpIssue/invoicetasks/3/")

    try:
        # Open filter panel
        time.sleep(1)
        filter_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".filter-toggle")))
        filter_btn.click()
        time.sleep(1)

        # کارکرد اعلام شده (نفر ساعت) - برابر است با
        invoice_work_hours_type = Select(driver.find_element(By.CSS_SELECTOR, "#invoice-work-hours-filter select.work-hours-type"))
        time.sleep(1)
        invoice_work_hours_type.select_by_value("eq")
        time.sleep(1)
        invoice_work_hours_input = wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "#invoice-work-hours-filter .work-hours-inputs-wrapper"))
        )
        invoice_work_hours_input.find_element(By.NAME, "invoice_work_hours_min").send_keys("6600")
        time.sleep(1)

        # کارکرد واقعی (نفر ساعت) - بزرگتر است از
        real_work_hours_type = Select(driver.find_element(By.CSS_SELECTOR, "#real-work-hours-filter select.work-hours-type"))
        time.sleep(1)
        real_work_hours_type.select_by_value("gt")
        time.sleep(1)
        real_work_hours_input = wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "#real-work-hours-filter .work-hours-inputs-wrapper"))
        )
        real_work_hours_input.find_element(By.NAME, "real_work_hours_min").send_keys("100")
        time.sleep(1)

        # نسبت کارکرد اعلام شده به کارکرد واقعی - بزرگتر است از, type 10
        ratio_type_select = Select(driver.find_element(By.CSS_SELECTOR, "#work-hours-ratio-filter select.ratio-type"))
        time.sleep(1)
        ratio_type_select.select_by_value("gt")
        time.sleep(1)
        ratio_input_wrapper = wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "#work-hours-ratio-filter .work-hours-inputs-wrapper"))
        )
        ratio_input = ratio_input_wrapper.find_element(By.NAME, "work_hours_ratio_value")
        ratio_input.clear()
        time.sleep(1)
        ratio_input.send_keys("10")
        time.sleep(1)
        driver.find_element(By.CSS_SELECTOR, ".filter-panel").click()
        time.sleep(2)

        # شناسه تسک
        task_id_input = wait.until(EC.visibility_of_element_located((By.ID, "task_id")))
        task_id_input.clear()
        time.sleep(1)
        task_id_input.send_keys("475631")
        time.sleep(1)

        # نسبت پیاده سازی به تست و رفع اشکال - بزرگتر است از, type 50
        impl_ratio_type_select = Select(driver.find_element(By.CSS_SELECTOR, "#implementation-ratio-filter select.ratio-type"))
        time.sleep(1)
        impl_ratio_type_select.select_by_value("gt")
        time.sleep(1)
        impl_ratio_input_wrapper = wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "#implementation-ratio-filter .work-hours-inputs-wrapper"))
        )
        impl_ratio_input = impl_ratio_input_wrapper.find_element(By.NAME, "implementation_ratio_value")
        impl_ratio_input.clear()
        time.sleep(1)
        impl_ratio_input.send_keys("50")
        time.sleep(1)
        driver.find_element(By.CSS_SELECTOR, ".filter-panel").click()
        time.sleep(2)

        # عنوان تسک
        task_title_input = driver.find_element(By.ID, "task_title")
        time.sleep(1)
        task_title_input.clear()
        time.sleep(1)
        task_title_input.send_keys("امکان")
        time.sleep(1)

        # نوع تسک - نياز جديد
        task_kind_select = Select(driver.find_element(By.ID, "task_kind"))
        time.sleep(1)
        for option in task_kind_select.options:
            if option.text.strip() in ["نیاز جدید", "نياز جديد"]:
                task_kind_select.select_by_visible_text(option.text)
                break
        time.sleep(1)

        # وضعیت تسک - select "تایید شده توسط معاون محصول"
        status_icons = driver.find_elements(By.CSS_SELECTOR, '.status-icon-label')
        for label in status_icons:
            if "تایید شده توسط معاون محصول" in label.text:
                checkbox = label.find_element(By.CSS_SELECTOR, 'input[type="checkbox"]')
                if not checkbox.is_selected():
                    label.click()
                break
        time.sleep(1)

        # تیم: select مشترکات (click the label to trigger JS)
        team_items = driver.find_elements(By.CSS_SELECTOR, ".team-column .multi-select-item")
        for item in team_items:
            label = item.find_element(By.CLASS_NAME, "team-name").text.strip()
            if label == "مشترکات":
                driver.execute_script("arguments[0].scrollIntoView(true);", item)
                item.click()
                break
        time.sleep(1)  # Wait for projects to refresh

        # پروژه: select both مشترکات projects (click the label to trigger JS)
        project_items = driver.find_elements(By.CSS_SELECTOR, ".project-column .multi-select-item")
        selected_count = 0
        for item in project_items:
            label = item.find_element(By.CLASS_NAME, "project-name").text.strip()
            if label == "مشترکات":
                checkbox = item.find_element(By.CSS_SELECTOR, "input[type='checkbox']")
                if not checkbox.is_selected():
                    driver.execute_script("arguments[0].scrollIntoView(true);", item)
                    item.click()
                    selected_count += 1
                if selected_count == 2:
                    break
        time.sleep(2)
        driver.find_element(By.CSS_SELECTOR, ".filter-panel").click()
        time.sleep(2)

        # Click جست و جو button
        search_btn = driver.find_element(By.CSS_SELECTOR, ".search-button.wide")
        time.sleep(1)
        search_btn.click()
        time.sleep(2)

        # Press حذف تمامی فیلتر ها button and search again
        clear_filters_btn = driver.find_element(By.ID, "clearFiltersBtn")
        clear_filters_btn.click()
        time.sleep(1)
        search_btn = driver.find_element(By.CSS_SELECTOR, ".search-button.wide")
        search_btn.click()
        time.sleep(3)

        print("Test passed: All filters applied, cleared, and search submitted twice.")

    finally:
        driver.quit()

if __name__ == "__main__":
    test_product_assistant_filters()