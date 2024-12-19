from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import time
import logging
import os

# Define a custom log level for success messages
SUCCESS = 25
logging.addLevelName(SUCCESS, "SUCCESS")


def success(self, message, *args, **kws):
    if self.isEnabledFor(SUCCESS):
        self._log(SUCCESS, message, args, **kws)


logging.Logger.success = success

# Corrected path using a raw string
PATH = r"C:\Program Files (x86)\chromedriver.exe"

# Setting up the ChromeDriver service and browser
service = Service(PATH)
options = webdriver.ChromeOptions()

# Creating a new instance of Chrome
driver = webdriver.Chrome(service=service, options=options)

# Configure logging
log_file_path = 'selenium_test.log'
logging.basicConfig(filename=log_file_path, level=logging.INFO,  # Ensure INFO level to capture all logs
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Add a stream handler to log to console
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)  # Ensure INFO level to capture all logs
console_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logging.getLogger().addHandler(console_handler)

# Confirm logging configuration
if os.path.exists(log_file_path):
    print(f"Logging to {log_file_path}")
else:
    print("Log file not created")

# Initialize counters for success and error tracking
total_operations = 0
successful_operations = 0
error_count = 0

# Navigate to the local project
driver.get("http://localhost:5173/")
print(driver.title)

# Explicit wait to ensure everything is loaded
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "root"))
)

# Add a 1-second wait
time.sleep(1)

def check_card_preview(card, expected_title, expected_scale, expected_date):
    try:
        title_element = card.find_element(By.CLASS_NAME, "document-card-title")
        title = title_element.text.split(" - ")[1]  # Extract the title after the hyphen
        scale = card.find_element(By.XPATH, ".//p[contains(text(), 'Scale:')]").text.split(": ")[1]
        issuance_date = card.find_element(By.XPATH, ".//p[contains(text(), 'Issuance Date:')]").text.split(": ")[1]

        assert title == expected_title, f"Title mismatch: {title} != {expected_title}"
        assert scale == expected_scale, f"Scale mismatch: {scale} != {expected_scale}"
        assert issuance_date == expected_date, f"Issuance Date mismatch: {issuance_date} != {expected_date}"

        logging.getLogger().success("Card preview matches expected values")
        return True
    except Exception as e:
        logging.error(f"Card preview check failed at line {e.__traceback__.tb_lineno}: {e}")
        return False

try:
    # Find and click the Documents link
    documents_link = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//a[@href='/documents' and contains(@class, 'nav-link')]"))
    )
    documents_link.click()
    logging.getLogger().success("Navigated to Documents page at line 45")
    total_operations += 1
    successful_operations += 1

    # Add a 1-second wait after opening the documents page
    time.sleep(1)

    # Wait for the documents page to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "document-card"))
    )

    # Find and click the "Add new card" button
    add_new_card_button = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//div[@class='col-auto']/button[@type='button' and contains(@class, 'btn-primary')]"))
    )
    add_new_card_button.click()
    logging.getLogger().success("Clicked Add new card button at line 61")
    total_operations += 1
    successful_operations += 1

    # Wait for the modal to appear
    modal = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "modal-content"))
    )
    logging.getLogger().success("Modal found for new card at line 68")
    total_operations += 1
    successful_operations += 1

    # Modify form values for the new card
    try:
        title_input = driver.find_element(By.ID, "formDocumentTitle")
        title_input.clear()
        title_input.send_keys("New Card Title")
        logging.getLogger().success("Updated title for new card at line 75")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not update title for new card at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    # Add new stakeholders for the new card
    try:
        new_stakeholders = ["Residents", "Kiruna Municipality"]
        for stakeholder in new_stakeholders:
            add_stakeholder_button = driver.find_element(By.XPATH, "//button[@title='Add new stakeholder']")
            add_stakeholder_button.click()
            time.sleep(0.5)  # Wait for the input field to appear
            stakeholder_input = driver.find_elements(By.ID, "formDocumentStakeholders")[-1]
            stakeholder_input.clear()
            stakeholder_input.send_keys(stakeholder)
        logging.getLogger().success("Added new stakeholders for new card at line 89")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not add stakeholders for new card at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    # Click all stakeholder checkboxes
    try:
        checkboxes = driver.find_elements(By.XPATH, "//input[@id='formDocumentStakeholders' and @type='checkbox']")
        for checkbox in checkboxes:
            if not checkbox.is_selected():
                checkbox.click()
        logging.getLogger().success("Clicked all stakeholder checkboxes at line 101")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not click all stakeholder checkboxes at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    try:
        scale_select = driver.find_element(By.ID, "formDocumentScale")
        for option in scale_select.find_elements(By.TAG_NAME, 'option'):
            if option.text.strip().lower() == "blueprints/material effects":
                option.click()
                break
        logging.getLogger().success("Selected scale for new card at line 113")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not select scale for new card at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    try:
        issuance_date_input = driver.find_element(By.ID, "formDocumentIssuanceDate")
        issuance_date_input.clear()
        issuance_date_input.send_keys("10012022")
        logging.getLogger().success("Updated issuance date for new card at line 123")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not update issuance date for new card at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    try:
        document_type_select = driver.find_element(By.ID, "formDocumentType")
        document_type_select.send_keys("Technical document")
        logging.getLogger().success("Updated document type for new card at line 133")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not update document type for new card at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    try:
        language_input = driver.find_element(By.ID, "formDocumentLanguage")
        language_input.clear()
        language_input.send_keys("Swedish")
        logging.getLogger().success("Updated language for new card at line 143")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not update language for new card at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    try:
        language_select = driver.find_element(By.ID, "formDocumentLanguage")
        for option in language_select.find_elements(By.TAG_NAME, 'option'):
            if option.text.strip().lower() == "swedish":  # Change "swedish" to the desired language
                option.click()
                break
        logging.getLogger().success("Selected language for new card at line 153")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not select language for new card at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    try:
        nr_pages_input = driver.find_element(By.ID, "formDocumentNrPages")
        nr_pages_input.clear()
        nr_pages_input.send_keys("100")
        logging.getLogger().success("Updated number of pages for new card at line 163")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not update number of pages for new card at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    try:
        latitude_input = driver.find_element(By.XPATH, "//small[text()='Latitude']/following-sibling::input[@id='formDocumentGeolocation']")
        longitude_input = driver.find_element(By.XPATH, "//small[text()='Longitude']/following-sibling::input[@id='formDocumentGeolocation']")
        
        # Uncheck the "Entire municipality" checkbox if it is checked
        entire_municipality_checkbox = driver.find_element(By.XPATH, "//input[@type='checkbox' and @class='form-check-input']")
        if entire_municipality_checkbox.is_selected():
            entire_municipality_checkbox.click()
            logging.getLogger().success("Unchecked 'Entire municipality' checkbox at line 175")

        latitude_input.clear()
        latitude_input.send_keys("60.1695")
        logging.getLogger().success("Updated latitude for new card at line 179")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not update latitude for new card at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    try:
        longitude_input.clear()
        longitude_input.send_keys("24.9354")
        logging.getLogger().success("Updated longitude for new card at line 183")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not update longitude for new card at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    # Update the description text box interaction for the new card
    try:
        description_textarea = driver.find_element(By.ID, "formDocumentDescription")
        description_textarea.clear()
        description_textarea.send_keys("Testing description for new card")
        logging.getLogger().success("Inserted description for new card at line 193")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not update description for new card at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    try:
        # Click the upload button to open the file explorer
        upload_button = driver.find_element(By.XPATH, "//button[contains(@class, 'btn-primary') and contains(@class, 'bi-upload')]")
        upload_button.click()
        logging.getLogger().success("Clicked upload button at line 203")
        total_operations += 1
        successful_operations += 1

        # Wait for the file input to be present
        file_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@type='file']"))
        )

        # Get the absolute paths of the files to upload
        file1 = os.path.abspath(os.path.join("D:/KirunaExplorer/e2e/Resources", "file1.txt"))
        file2 = os.path.abspath(os.path.join("D:/KirunaExplorer/e2e/Resources", "file2.txt"))

        # Set the file paths to the file input element
        file_input.send_keys(f"{file1}\n{file2}")
        logging.getLogger().success("Selected files for upload at line 215")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not upload files at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

    # Click the Save Changes button if it exists for the new card
    try:
        save_button = WebDriverWait(modal, 10).until(
            EC.element_to_be_clickable((By.XPATH, ".//button[@type='button' and @title='submit']"))
        )
        save_button.click()
        logging.getLogger().success("Clicked Save Changes button for new card at line 225")
        total_operations += 1
        successful_operations += 1

        # Check if the Save button is still present after clicking
        WebDriverWait(driver, 10).until(
            EC.staleness_of(save_button)
        )
        logging.getLogger().success("Save button not present after clicking, indicating success for new card at line 231")
        total_operations += 1
        successful_operations += 1
    except Exception as e:
        logging.error(f"Could not click Save Changes button for new card at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

        # Click the Close button
        try:
            close_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, ".//button[@type='button' and @class='btn-close' and @aria-label='Close']"))
            )
            close_button.click()
            logging.getLogger().success("Clicked Close button for new card at line 241")
            total_operations += 1
            successful_operations += 1
        except Exception as e:
            logging.error(f"Could not click Close button at line {e.__traceback__.tb_lineno}: {e}")
            total_operations += 1
            error_count += 1

    # Find the document cards again after adding the new card
    cards = driver.find_elements(By.CLASS_NAME, "document-card")
    new_card = cards[0]  # Assuming the new card is the first one

    if not check_card_preview(new_card, "New Card Title", "Blueprints/Material effects", "10/01/2022"):
        logging.error("New card preview information does not match expected values at line 252")
    else:
        new_card.click()

    # Iterate over each card and click it
    for card in cards:
        try:
            # Scroll the card into view
            driver.execute_script("arguments[0].scrollIntoView(true);", card)
            time.sleep(0.5)  # Add a short wait to ensure the card is in view

            card.click()
            logging.getLogger().success(f"Clicked card: {card.text} at line 262")
            total_operations += 1
            successful_operations += 1

            # Wait for the modal to appear
            modal = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "modal-content"))
            )
            logging.getLogger().success("Modal found at line 269")
            total_operations += 1
            successful_operations += 1

            # Click the Edit button if it exists
            try:
                edit_button = modal.find_elements(By.XPATH, ".//button[contains(@class, 'btn-primary') and contains(@class, 'bi-pencil-square')]")
                if edit_button:
                    edit_button[0].click()
                    logging.getLogger().success("Clicked Edit button at line 276")
                    total_operations += 1
                    successful_operations += 1
                else:
                    raise Exception("Edit button not found")
            except Exception as e:
                logging.error(f"Could not click Edit button at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

                # Click the Close button
                try:
                    close_button = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.XPATH, ".//button[@type='button' and @class='btn-close' and @aria-label='Close']"))
                    )
                    close_button.click()
                    logging.getLogger().success("Clicked Close button at line 287")
                    total_operations += 1
                    successful_operations += 1
                except Exception as e:
                    logging.error(f"Could not click Close button at line {e.__traceback__.tb_lineno}: {e}")
                    total_operations += 1
                    error_count += 1

            # Modify form values
            try:
                title_input = driver.find_element(By.ID, "formDocumentTitle")
                title_input.clear()
                title_input.send_keys("Updated Title")
                logging.getLogger().success("Updated title at line 298")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not update title at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

            # Delete all existing stakeholders
            try:
                delete_buttons = driver.find_elements(By.XPATH, "//button[contains(@class, 'btn-danger')]")
                for button in delete_buttons:
                    button.click()
                    #time.sleep(0.5)  # Wait for the deletion to process
                logging.getLogger().success("Deleted all existing stakeholders at line 309")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not delete stakeholders at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

            # Add new stakeholders
            try:
                add_stakeholder_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Add Stakeholder')]")
                new_stakeholders = ["Residents", "Kiruna Municipality"]
                for stakeholder in new_stakeholders:
                    add_stakeholder_button.click()
                    #time.sleep(0.5)  # Wait for the input field to appear
                    stakeholder_input = driver.find_elements(By.ID, "formDocumentStakeholders")[-1]
                    stakeholder_input.clear()
                    stakeholder_input.send_keys(stakeholder)
                logging.getLogger().success("Added new stakeholders at line 322")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not add stakeholders at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

            try:
                scale_select = driver.find_element(By.ID, "formDocumentScale")
                for option in scale_select.find_elements(By.TAG_NAME, 'option'):
                    if option.text == "Blueprint/Material effects":
                        option.click()
                        break
                logging.getLogger().success("Updated scale at line 333")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not update scale at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

            try:
                issuance_date_input = driver.find_element(By.ID, "formDocumentIssuanceDate")
                issuance_date_input.clear()
                issuance_date_input.send_keys("10012022")
                logging.getLogger().success("Updated issuance date at line 343")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not update issuance date at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

            try:
                document_type_select = driver.find_element(By.ID, "formDocumentType")
                document_type_select.send_keys("Technical document")
                logging.getLogger().success("Updated document type at line 353")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not update document type at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

            try:
                language_input = driver.find_element(By.ID, "formDocumentLanguage")
                language_input.clear()
                language_input.send_keys("Swedish")
                logging.getLogger().success("Updated language at line 363")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not update language at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

            try:
                nr_pages_input = driver.find_element(By.ID, "formDocumentNrPages")
                nr_pages_input.clear()
                nr_pages_input.send_keys("100")
                logging.getLogger().success("Updated number of pages at line 373")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not update number of pages at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

            try:
                latitude_input = driver.find_element(By.XPATH, "//small[text()='Latitude']/following-sibling::input[@id='formDocumentGeolocation']")
                longitude_input = driver.find_element(By.XPATH, "//small[text()='Longitude']/following-sibling::input[@id='formDocumentGeolocation']")
                
                # Uncheck the "Entire municipality" checkbox if it is checked
                entire_municipality_checkbox = driver.find_element(By.XPATH, "//input[@type='checkbox' and @class='form-check-input']")
                if entire_municipality_checkbox.is_selected():
                    entire_municipality_checkbox.click()
                    logging.getLogger().success("Unchecked 'Entire municipality' checkbox at line 175")

                latitude_input.clear()
                latitude_input.send_keys("60.1695")
                logging.getLogger().success("Updated latitude for new card at line 179")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not update latitude for new card at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

            try:
                longitude_input.clear()
                longitude_input.send_keys("24.9354")
                logging.getLogger().success("Updated longitude for new card at line 183")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not update longitude for new card at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

            # Update the description text box interaction
            try:
                description_textarea = driver.find_element(By.ID, "formDocumentDescription")
                description_textarea.clear()
                description_textarea.send_keys("Testing description")
                logging.getLogger().success("Inserted description at line 403")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not update description at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

            # Click the Save Changes button if it exists
            save_button = WebDriverWait(modal, 10).until(
                EC.element_to_be_clickable((By.XPATH, ".//button[@type='button' and contains(@class, 'btn-success') and contains(@class, 'bi-check2')]"))
            )
            save_button.click()
            logging.getLogger().success("Clicked Save Changes button at line 413")
            total_operations += 1
            successful_operations += 1

            # Check if the Save button is still present after clicking
            try:
                WebDriverWait(driver, 10).until(
                    EC.staleness_of(save_button)
                )
                logging.getLogger().success("Save button not present after clicking, indicating success at line 419")
                total_operations += 1
                successful_operations += 1
            except Exception:
                logging.error("Save button still present after clicking, indicating a failure at line 421")
                total_operations += 1
                error_count += 1
                # Click the Close button
                close_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, ".//button[contains(text(), 'Close')]"))
                )
                close_button.click()
                logging.getLogger().success("Clicked Close button at line 426")
                total_operations += 1
                successful_operations += 1

            if not check_card_preview(card, "Updated Title", "Updated Scale", "10/01/2022"):
                logging.error("Modified card preview information does not match expected values at line 430")
                continue  # Continue checking the next card
            card.click()

        except Exception as e:
            logging.error(f"Could not process card at line {e.__traceback__.tb_lineno}: {e}")
            total_operations += 1
            error_count += 1

    # Initialize a counter for the number of connected documents
    connected_documents_count = 0

    # Second section: Testing "Link to" functionality
    try:
        # Iterate over each card and click it
        for card in cards:
            if connected_documents_count >= 3:
                logging.info("Maximum number of connected documents reached.")
                break

            try:
                # Scroll the card into view
                driver.execute_script("arguments[0].scrollIntoView(true);", card)
            except Exception as e:
                logging.error(f"Could not scroll card into view at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1


            try:
                card.click()
                logging.getLogger().success(f"Clicked card: {card.text} at line 451")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not click card at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1


            try:
                # Wait for the modal to appear
                modal = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "modal-content"))
                )
                logging.getLogger().success("Modal found at line 461")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not find modal at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1


            try:
                # Click the "Link to" button
                link_to_button = modal.find_element(By.XPATH, ".//button[contains(text(), 'Link to')]")
                link_to_button.click()
                logging.getLogger().success("Clicked Link to button at line 471")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not click Link to button at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1


            try:
                # Wait for the card selection modal to appear
                card_selection_modal = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "card-selection-modal"))
                )
                logging.getLogger().success("Card selection modal found at line 481")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not find card selection modal at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1


            try:
                # Find all cards in the selection modal
                selectable_cards = card_selection_modal.find_elements(By.CLASS_NAME, "document-card")

                # Check if the same card is present in the selection
                for selectable_card in selectable_cards:
                    if selectable_card.text == card.text:
                        raise Exception("Cannot link to the same card")
            except Exception as e:
                logging.error(f"Error processing selectable cards at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1


            try:
                # Select the first card in the selection modal (assuming it's not the same card)
                selectable_cards[0].click()
                logging.getLogger().success("Selected a different card to link at line 497")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not select a different card at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1


            try:
                # Select the link type
                link_type_select = driver.find_element(By.ID, "formLinkType")
                link_type_select.send_keys("Direct consequence")
                logging.getLogger().success("Selected link type: Direct consequence at line 507")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not select link type at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1


            try:
                # Confirm the link
                confirm_button = driver.find_element(By.XPATH, ".//button[contains(text(), 'Confirm')]")
                confirm_button.click()
                logging.getLogger().success("Confirmed the link at line 517")
                total_operations += 1
                successful_operations += 1
                connected_documents_count += 1  # Increment the counter
            except Exception as e:
                logging.error(f"Could not confirm the link at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1


            try:
                # Press the final "Link" button (ignoring the number in brackets)
                link_button = driver.find_element(By.XPATH, ".//div[@class='col-auto']//button[contains(text(), 'Link')]")
                link_button.click()
                logging.getLogger().success("Pressed the final Link button at line 527")
                total_operations += 1
                successful_operations += 1
            except Exception as e:
                logging.error(f"Could not press the final Link button at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

                # Handle the browser notification
                alert = WebDriverWait(driver, 10).until(EC.alert_is_present())
                alert_text = alert.text
                logging.info(f"Alert text: {alert_text}")
                alert.accept()
                logging.getLogger().success("Accepted the alert at line 535")
            except Exception as e:
                logging.error(f"Could not press the final Link button or handle the alert at line {e.__traceback__.tb_lineno}: {e}")
                total_operations += 1
                error_count += 1

    except Exception as e:
        logging.error(f"Error in the linking section at line {e.__traceback__.tb_lineno}: {e}")
        total_operations += 1
        error_count += 1

finally:
    driver.quit()
    logging.getLogger().success("Browser closed")
    total_operations += 1
    successful_operations += 1

    # Calculate success percentage
    success_percentage = (successful_operations / total_operations) * 100

    # Log the summary
    logging.info(f"Summary: {successful_operations} successful operations out of {total_operations} ({success_percentage:.2f}% success rate)")
    logging.info(f"Number of errors: {error_count}")
    logging.info(f"Number of errors: {error_count}")