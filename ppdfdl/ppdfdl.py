from selenium import webdriver

def download(URL, QUALITY, OUTNAME):
    driver = webdriver.Firefox()

    driver.get(URL)
    with open(f'/scripts/dl_{QUALITY}.js') as f:
        script = f.read()
        driver.execute_script(script.format(OUTNAME))

    driver.quit()
    print("Downloaded .pdf file succesfully!")