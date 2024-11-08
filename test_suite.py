import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import os
import time
import random
import string

class PalyoplotTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--headless=new')
        chrome_options.add_argument('--window-size=1920,1080')
        
        try:
            cls.driver = webdriver.Chrome(
                service=Service(ChromeDriverManager().install()),
                options=chrome_options
            )
            cls.driver.implicitly_wait(10)
            cls.base_url = "http://localhost:5173"
            # Store credentials at class level for sharing between tests
            cls.test_credentials = None
        except WebDriverException as e:
            raise unittest.SkipTest(f"WebDriver could not be initialized: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        if hasattr(cls, 'driver'):
            cls.driver.quit()

    def setUp(self):
        self.driver.delete_all_cookies()
        try:
            self.driver.get(self.base_url)
            # Wait for page load
            WebDriverWait(self.driver, 10).until(
                lambda driver: driver.execute_script('return document.readyState') == 'complete'
            )
        except WebDriverException as e:
            self.skipTest(f"Could not load application: {str(e)}")

    def wait_for_element(self, by, value, timeout=10, condition=EC.presence_of_element_located):
        """Helper method to wait for an element"""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                condition((by, value))
            )
            return element
        except TimeoutException:
            # Take screenshot on failure
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            screenshot_path = f"test_failure_{timestamp}.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"\nScreenshot saved to: {screenshot_path}")
            print(f"\nCurrent URL: {self.driver.current_url}")
            print(f"Looking for element: {by} = {value}")
            self.fail(f"Element not found or condition not met: {value}")

    def generate_random_credentials(self):
        """Generate random username, email, and password for testing"""
        random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        return {
            'username': f"testuser_{random_string}",
            'email': f"test_{random_string}@example.com",
            'password': f"TestPass{random_string}!"
        }

    def test_homepage_load(self):
        """Test if homepage loads correctly"""
        try:
            title = self.wait_for_element(
                By.XPATH,
                "//h1[contains(text(), 'Data at Your Fingertips')]"
            )
            self.assertIsNotNone(title)
            self.assertEqual(
                title.text,
                "Data at Your Fingertips - Welcome to Palyoplot"
            )
        except Exception as e:
            self.fail(f"Homepage title test failed: {str(e)}")

    def test_navigation(self):
        """Test navigation bar functionality"""
        print("\nStarting navigation test...")
        
        try:
            # First, verify the nav menu is present
            nav_menu = self.wait_for_element(
                By.XPATH,
                "//nav//ul[contains(@class, 'navMenu')]"
            )
            print("Found nav menu")
            
            # Test each navigation link
            nav_links = {
                "Home": "/",
                "Tutorial": "/tutorial",
                "About": "/about"
            }
            
            for link_text, expected_path in nav_links.items():
                print(f"\nTesting navigation to: {link_text}")
                
                try:
                    link = self.wait_for_element(
                        By.XPATH,
                        f"//nav//ul//a[normalize-space()='{link_text}']",
                        condition=EC.element_to_be_clickable
                    )
                    
                    print(f"Found link for {link_text}")
                    self.driver.execute_script("arguments[0].scrollIntoView(true);", link)
                    time.sleep(1)
                    link.click()
                    print(f"Clicked {link_text} link")
                    
                    WebDriverWait(self.driver, 5).until(
                        lambda driver: expected_path in driver.current_url
                    )
                    
                    current_url = self.driver.current_url
                    print(f"Current URL: {current_url}")
                    self.assertTrue(
                        current_url.endswith(expected_path)
                    )
                    
                    self.driver.get(self.base_url)
                    print(f"Returned to homepage")
                    
                    WebDriverWait(self.driver, 5).until(
                        lambda driver: driver.execute_script('return document.readyState') == 'complete'
                    )
                    
                except Exception as e:
                    self.fail(f"Failed to navigate to {link_text}: {str(e)}")
                
        except Exception as e:
            self.fail(f"Navigation test failed: {str(e)}")

    def test_1_unauthorized_dashboard_access(self):
        """Test that unauthorized users are redirected from dashboard"""
        print("\nTesting unauthorized dashboard access...")
        try:
            # Attempt to access dashboard without login
            dashboard_link = self.wait_for_element(
                By.XPATH,
                "//a[contains(@href, '/dashboard')]",
                condition=EC.element_to_be_clickable
            )
            dashboard_link.click()
            
            # Verify redirect to login page
            self.wait_for_element(By.XPATH, "//h1[text()='Login']")
            current_url = self.driver.current_url
            self.assertTrue("login" in current_url, 
                          f"Expected redirect to login, but got: {current_url}")
            print("Successfully verified unauthorized access protection")
            
        except Exception as e:
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            screenshot_path = f"unauthorized_test_failure_{timestamp}.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"\nScreenshot saved to: {screenshot_path}")
            raise

    def test_2_register(self):
        """Test user registration process"""
        print("\nStarting registration test...")
        try:
            # Generate and store credentials for later tests
            self.__class__.test_credentials = self.generate_random_credentials()
            credentials = self.__class__.test_credentials
            
            # Navigate to Registration page
            register_button = self.wait_for_element(
                By.XPATH,
                "//a[.//button[contains(text(), 'Register')]]",
                condition=EC.element_to_be_clickable
            )
            register_button.click()
            
            # Wait for registration form
            self.wait_for_element(By.XPATH, "//h1[text()='Registration']")
            
            # Fill out registration form
            username_input = self.wait_for_element(By.XPATH, "//input[@type='text']")
            email_input = self.wait_for_element(By.XPATH, "//input[@type='email']")
            password_inputs = self.driver.find_elements(By.XPATH, "//input[@type='password']")
            
            username_input.send_keys(credentials['username'])
            email_input.send_keys(credentials['email'])
            password_inputs[0].send_keys(credentials['password'])
            password_inputs[1].send_keys(credentials['password'])
            
            # Submit registration
            register_submit = self.wait_for_element(
                By.XPATH,
                "//button[@type='submit'][contains(text(), 'Register')]",
                condition=EC.element_to_be_clickable
            )
            register_submit.click()
            
            # Verify redirect to login page
            self.wait_for_element(By.XPATH, "//h1[text()='Login']")
            print("Successfully registered and redirected to login")
            
        except Exception as e:
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            screenshot_path = f"register_test_failure_{timestamp}.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"\nScreenshot saved to: {screenshot_path}")
            raise

    def test_3_login_and_dashboard(self):
        """Test login and dashboard access"""
        print("\nTesting login and dashboard access...")
        try:
            # Verify we have credentials from registration
            self.assertIsNotNone(self.__class__.test_credentials, 
                            "No test credentials found. Run registration test first.")
            
            credentials = self.__class__.test_credentials
            
            # Navigate to login page if not already there
            if "login" not in self.driver.current_url:
                login_button = self.wait_for_element(
                    By.XPATH,
                    "//a[.//button[contains(text(), 'Login')]]",
                    condition=EC.element_to_be_clickable
                )
                login_button.click()
            
            # Fill login form
            username_input = self.wait_for_element(By.XPATH, "//input[@type='text']")
            password_input = self.wait_for_element(By.XPATH, "//input[@type='password']")
            
            username_input.send_keys(credentials['username'])
            password_input.send_keys(credentials['password'])
            
            # Submit login
            login_button = self.wait_for_element(
                By.XPATH,
                "//button[contains(text(), 'Login')][@type='submit']",  # More specific selector
                condition=EC.element_to_be_clickable
            )
            login_button.click()
            
            # Wait for login processing and redirect
            time.sleep(3)  # Increased wait time
            
            # Verify we're logged in by checking for the logout button
            self.wait_for_element(
                By.XPATH,
                "//button[contains(text(), 'Logout')]",
                timeout=15  # Increased timeout
            )
            
            # Click dashboard link with retry logic
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    dashboard_link = self.wait_for_element(
                        By.XPATH,
                        "//a[contains(@href, '/dashboard')]",
                        condition=EC.element_to_be_clickable,
                        timeout=5
                    )
                    dashboard_link.click()
                    break
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    print(f"Retry {attempt + 1} clicking dashboard link")
                    time.sleep(2)
            
            # Wait for dashboard to load
            time.sleep(2)
            
            # Try multiple possible selectors for the upload button
            upload_button_selectors = [
                "//button[contains(text(), 'Upload CSV File')]",
                "//button[contains(text(), 'Select CSV File')]",
                "//button[contains(@class, 'customFileButton')]",
                "//input[@type='file']/../button"
            ]
            
            upload_button_found = False
            for selector in upload_button_selectors:
                try:
                    self.wait_for_element(
                        By.XPATH,
                        selector,
                        timeout=5
                    )
                    upload_button_found = True
                    break
                except:
                    continue
            
            if not upload_button_found:
                # If button not found, log the page source and take a screenshot
                print("\nPage source:", self.driver.page_source)
                timestamp = time.strftime("%Y%m%d-%H%M%S")
                screenshot_path = f"dashboard_content_{timestamp}.png"
                self.driver.save_screenshot(screenshot_path)
                self.fail("Could not find upload button with any known selector")
            
            # Verify we're on the dashboard page
            current_url = self.driver.current_url
            self.assertTrue("dashboard" in current_url, 
                        f"Expected to be on dashboard, but got: {current_url}")
            
            print("Successfully logged in and accessed dashboard")
            
        except Exception as e:
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            screenshot_path = f"login_dashboard_test_failure_{timestamp}.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"\nScreenshot saved to: {screenshot_path}")
            print(f"\nCurrent URL: {self.driver.current_url}")
            print(f"Error details: {str(e)}")
            raise
    def test_4_csv_upload(self):
        """Test CSV file upload functionality"""
        print("\nTesting CSV file upload...")
        try:
            # First ensure we're logged in 
            if not self.ensure_logged_in():
                self.fail("Could not establish logged in state")
                
            # Navigate to dashboard explicitly
            self.driver.get(f"{self.base_url}/dashboard")
            time.sleep(2)  # Wait for navigation
            
            # Prepare test CSV file
            test_csv_path = os.path.abspath(os.path.join(
                os.path.dirname(__file__), 
                'test.csv'
            ))
            
            # Ensure test file exists
            self.assertTrue(os.path.exists(test_csv_path), 
                        f"Test CSV file not found at {test_csv_path}")
            
            # Try multiple selectors for file input
            file_input_selectors = [
                "//input[@type='file']",
                "//input[@accept='.csv']",
                "//input[@id='csvFileUpload']"
            ]
            
            file_input = None
            for selector in file_input_selectors:
                try:
                    file_input = self.wait_for_element(
                        By.XPATH,
                        selector,
                        timeout=5
                    )
                    if file_input:
                        break
                except:
                    continue
                    
            if not file_input:
                self.fail("Could not find file input element")
                
            # Send file path to input
            file_input.send_keys(test_csv_path)
            time.sleep(1)  # Wait for file to be processed
            
            # Click upload button - try multiple selectors
            upload_button_selectors = [
                "//button[contains(text(), 'Upload CSV File')]",
                "//button[contains(@class, 'customFileButton')][not(contains(@disabled, 'true'))]",
                "//button[contains(text(), 'Upload')]"
            ]
            
            upload_success = False
            for selector in upload_button_selectors:
                try:
                    upload_button = self.wait_for_element(
                        By.XPATH,
                        selector,
                        condition=EC.element_to_be_clickable,
                        timeout=5
                    )
                    upload_button.click()
                    upload_success = True
                    break
                except:
                    continue
                    
            if not upload_success:
                self.fail("Could not find or click upload button")
                
            # Wait for upload success indicators - try multiple options
            success_indicators = [
                "//div[contains(@class, 'js-plotly-plot')]",
                "//div[contains(@class, 'plotBox')]//canvas",
                "//div[contains(@class, 'alertMessage')][not(contains(text(), 'error'))]"
            ]
            
            success_found = False
            for indicator in success_indicators:
                try:
                    self.wait_for_element(
                        By.XPATH,
                        indicator,
                        timeout=10
                    )
                    success_found = True
                    break
                except:
                    continue
                    
            self.assertTrue(success_found, "Could not verify successful upload")
            print("Successfully uploaded CSV file")
            
        except Exception as e:
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            screenshot_path = f"csv_upload_test_failure_{timestamp}.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"\nCurrent URL: {self.driver.current_url}")
            print(f"\nPage source: {self.driver.page_source[:1000]}...")  # First 1000 chars
            print(f"\nScreenshot saved to: {screenshot_path}")
            raise

    def ensure_logged_in(self):
        """Helper method to ensure user is logged in"""
        try:
            # Check if already logged in
            try:
                logout_button = self.wait_for_element(
                    By.XPATH,
                    "//button[contains(text(), 'Logout')]",
                    timeout=3
                )
                return True
            except:
                pass
                
            # Navigate to login page
            self.driver.get(f"{self.base_url}/login")
            time.sleep(2)  # Wait for navigation
            
            # Verify we have credentials
            self.assertIsNotNone(self.test_credentials, 
                            "No test credentials found. Run registration test first.")
            
            # Wait for and fill login form
            username_input = self.wait_for_element(
                By.XPATH,
                "//input[@type='text' or @placeholder='Username']"
            )
            password_input = self.wait_for_element(
                By.XPATH,
                "//input[@type='password']"
            )
            
            username_input.send_keys(self.test_credentials['username'])
            password_input.send_keys(self.test_credentials['password'])
            
            # Find and click login button
            login_button = self.wait_for_element(
                By.XPATH,
                "//button[@type='submit'][contains(text(), 'Login')]",
                condition=EC.element_to_be_clickable
            )
            login_button.click()
            
            # Wait for login to complete
            time.sleep(3)
            
            # Verify login success
            try:
                logout_button = self.wait_for_element(
                    By.XPATH,
                    "//button[contains(text(), 'Logout')]",
                    timeout=5
                )
                return True
            except:
                return False
                
        except Exception as e:
            print(f"Login attempt failed: {str(e)}")
            return False

    def test_5_delete_history(self):
        """Test deleting data from history page"""
        print("\nTesting history deletion...")
        try:
            # Ensure logged in
            if not self.ensure_logged_in():
                self.fail("Could not establish logged in state")
                
            # Navigate directly to history page
            self.driver.get(f"{self.base_url}/history")
            time.sleep(2)  # Wait for page load
            
            # Function to get current row count
            def get_row_count():
                try:
                    table = WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'history-table-container')]//tbody"))
                    )
                    return len(table.find_elements(By.XPATH, "./tr"))
                except:
                    return 0

            # Get initial row count
            initial_count = get_row_count()
            if initial_count == 0:
                print("No entries found in history to delete")
                return
                
            print(f"Found {initial_count} history entries")
            
            # Find and click delete button
            delete_button = None
            delete_button_selectors = [
                "//button[contains(@class, 'delete-button')]",
                "//button[contains(text(), '❌')]",
                "//td[last()]//button"
            ]
            
            for selector in delete_button_selectors:
                try:
                    delete_button = WebDriverWait(self.driver, 5).until(
                        EC.element_to_be_clickable((By.XPATH, selector))
                    )
                    # Scroll the button into view
                    self.driver.execute_script("arguments[0].scrollIntoView(true);", delete_button)
                    time.sleep(0.5)  # Short pause after scrolling
                    break
                except:
                    continue
                    
            if not delete_button:
                self.fail("Could not find delete button")
                
            # Click delete button
            try:
                delete_button.click()
            except:
                # If regular click fails, try JavaScript click
                self.driver.execute_script("arguments[0].click();", delete_button)
                
            # Wait for deletion to complete with timeout
            max_wait = 10
            start_time = time.time()
            while time.time() - start_time < max_wait:
                current_count = get_row_count()
                if current_count == initial_count - 1:
                    print("Successfully verified row deletion")
                    break
                time.sleep(0.5)
            else:
                # If we exit the while loop normally, verification failed
                current_count = get_row_count()
                self.fail(f"Row count verification failed. Expected {initial_count - 1}, got {current_count}")
                
            print("Successfully deleted history entry")
            
        except Exception as e:
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            screenshot_path = f"history_delete_test_failure_{timestamp}.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"\nCurrent URL: {self.driver.current_url}")
            try:
                print(f"\nPage source: {self.driver.page_source[:1000]}...")
            except:
                print("\nCould not get page source")
            print(f"\nScreenshot saved to: {screenshot_path}")
            raise

    def test_6_change_password(self):
        """Test password change functionality"""
        print("\nTesting password change...")
        try:
            # Ensure logged in
            if not self.ensure_logged_in():
                self.fail("Could not establish logged in state")
                
            # Navigate directly to profile page
            self.driver.get(f"{self.base_url}/profile")
            time.sleep(2)
            
            # Wait for profile page to load
            form_selectors = [
                "//form[contains(@class, 'form')]",
                "//div[contains(@class, 'formCard')]",
                "//div[contains(text(), 'Update Password')]/.."
            ]
            
            form = None
            for selector in form_selectors:
                try:
                    form = self.wait_for_element(
                        By.XPATH,
                        selector,
                        timeout=5
                    )
                    if form:
                        break
                except:
                    continue
                    
            if not form:
                self.fail("Could not find password change form")
                
            # Fill out password change form
            current_password = self.test_credentials['password']
            new_password = current_password + "New1!"
            
            # Try different input selectors
            input_selectors = {
                'current': [
                    "//input[@id='currentPassword']",
                    "//input[contains(@placeholder, 'Current')]",
                    "//input[@name='currentPassword']"
                ],
                'new': [
                    "//input[@id='newPassword']",
                    "//input[contains(@placeholder, 'New')]",
                    "//input[@name='newPassword']"
                ],
                'confirm': [
                    "//input[@id='confirmPassword']",
                    "//input[contains(@placeholder, 'Confirm')]",
                    "//input[@name='confirmPassword']"
                ]
            }
            
            # Try to find and fill each input
            for field, selectors in input_selectors.items():
                input_found = False
                for selector in selectors:
                    try:
                        input_elem = self.wait_for_element(
                            By.XPATH,
                            selector,
                            timeout=5
                        )
                        input_elem.send_keys(new_password if field != 'current' else current_password)
                        input_found = True
                        break
                    except:
                        continue
                        
                if not input_found:
                    self.fail(f"Could not find {field} password input")
                    
            # Submit form
            submit_button_selectors = [
                "//button[contains(text(), 'Update Password')]",
                "//button[@type='submit']",
                "//button[contains(@class, 'submitButton')]"
            ]
            
            submit_success = False
            for selector in submit_button_selectors:
                try:
                    submit_button = self.wait_for_element(
                        By.XPATH,
                        selector,
                        condition=EC.element_to_be_clickable,
                        timeout=5
                    )
                    submit_button.click()
                    submit_success = True
                    break
                except:
                    continue
                    
            if not submit_success:
                self.fail("Could not find or click submit button")
                
            # Wait for success message
            success_message_selectors = [
                "//div[contains(@class, 'successMessage')]",
                "//div[contains(text(), 'updated successfully')]",
                "//div[contains(@class, 'message')][contains(@class, 'success')]"
            ]
            
            success_found = False
            for selector in success_message_selectors:
                try:
                    self.wait_for_element(
                        By.XPATH,
                        selector,
                        timeout=5
                    )
                    success_found = True
                    break
                except:
                    continue
                    
            self.assertTrue(success_found, "Could not verify password change success")
            
            # Update stored credentials
            self.test_credentials['password'] = new_password
            print("Successfully changed password")
            
        except Exception as e:
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            screenshot_path = f"password_change_test_failure_{timestamp}.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"\nCurrent URL: {self.driver.current_url}")
            print(f"\nPage source: {self.driver.page_source[:1000]}...")
            print(f"\nScreenshot saved to: {screenshot_path}")
            raise

if __name__ == "__main__":
    unittest.main(verbosity=2)