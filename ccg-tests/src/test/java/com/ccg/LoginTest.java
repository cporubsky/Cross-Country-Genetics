package com.ccg;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class LoginTest {

    private WebDriver driver;

    @Before
    public void setup() {

        System.setProperty("webdriver.chrome.driver", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");
        driver = new ChromeDriver();

    }

    @Test
    public void test() throws InterruptedException {

        driver.get("https://www.google.com");

        WebElement googleLogo = driver.findElement(By.id("hpLogo"));
        Assert.assertNotNull(googleLogo);
    }

    @After
    public void tearDown() {
        driver.quit();
    }

}
