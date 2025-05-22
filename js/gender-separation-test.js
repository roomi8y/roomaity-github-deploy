// Enhanced gender separation testing script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gender separation test script loaded');
    
    // Test functions
    function testMaleSelection() {
        console.log('Testing male selection...');
        
        // Simulate clicking male button
        const maleButton = document.querySelector('[data-select-gender="male"]');
        if (maleButton) {
            console.log('Clicking male button');
            maleButton.click();
            
            // Verify male content is visible
            const maleContent = document.querySelectorAll('.male-content');
            let maleContentVisible = true;
            maleContent.forEach(content => {
                if (window.getComputedStyle(content).display === 'none') {
                    maleContentVisible = false;
                }
            });
            
            // Verify female content is hidden
            const femaleContent = document.querySelectorAll('.female-content');
            let femaleContentHidden = true;
            femaleContent.forEach(content => {
                if (window.getComputedStyle(content).display !== 'none') {
                    femaleContentHidden = false;
                }
            });
            
            // Log results
            console.log('Male content visible:', maleContentVisible);
            console.log('Female content hidden:', femaleContentHidden);
            
            if (maleContentVisible && femaleContentHidden) {
                console.log('✅ Male selection test PASSED');
                return true;
            } else {
                console.log('❌ Male selection test FAILED');
                return false;
            }
        } else {
            console.log('❌ Male button not found');
            return false;
        }
    }
    
    function testFemaleSelection() {
        console.log('Testing female selection...');
        
        // Simulate clicking female button
        const femaleButton = document.querySelector('[data-select-gender="female"]');
        if (femaleButton) {
            console.log('Clicking female button');
            femaleButton.click();
            
            // Verify female content is visible
            const femaleContent = document.querySelectorAll('.female-content');
            let femaleContentVisible = true;
            femaleContent.forEach(content => {
                if (window.getComputedStyle(content).display === 'none') {
                    femaleContentVisible = false;
                }
            });
            
            // Verify male content is hidden
            const maleContent = document.querySelectorAll('.male-content');
            let maleContentHidden = true;
            maleContent.forEach(content => {
                if (window.getComputedStyle(content).display !== 'none') {
                    maleContentHidden = false;
                }
            });
            
            // Log results
            console.log('Female content visible:', femaleContentVisible);
            console.log('Male content hidden:', maleContentHidden);
            
            if (femaleContentVisible && maleContentHidden) {
                console.log('✅ Female selection test PASSED');
                return true;
            } else {
                console.log('❌ Female selection test FAILED');
                return false;
            }
        } else {
            console.log('❌ Female button not found');
            return false;
        }
    }
    
    function testGenderIndicatorText() {
        console.log('Testing gender indicator text...');
        
        // Test male indicator
        const maleButton = document.querySelector('[data-select-gender="male"]');
        if (maleButton) {
            maleButton.click();
            const indicators = document.querySelectorAll('.gender-indicator');
            let maleTextCorrect = true;
            
            indicators.forEach(indicator => {
                const text = indicator.textContent.trim();
                if (text !== 'شريك السكن المثالي') {
                    maleTextCorrect = false;
                    console.log('Incorrect male indicator text:', text);
                }
            });
            
            // Test female indicator
            const femaleButton = document.querySelector('[data-select-gender="female"]');
            if (femaleButton) {
                femaleButton.click();
                let femaleTextCorrect = true;
                
                indicators.forEach(indicator => {
                    const text = indicator.textContent.trim();
                    if (text !== 'شريكة السكن المثالية') {
                        femaleTextCorrect = false;
                        console.log('Incorrect female indicator text:', text);
                    }
                });
                
                if (maleTextCorrect && femaleTextCorrect) {
                    console.log('✅ Gender indicator text test PASSED');
                    return true;
                } else {
                    console.log('❌ Gender indicator text test FAILED');
                    return false;
                }
            } else {
                console.log('❌ Female button not found');
                return false;
            }
        } else {
            console.log('❌ Male button not found');
            return false;
        }
    }
    
    function testLocalStoragePersistence() {
        console.log('Testing localStorage persistence...');
        
        // Clear any existing preference
        localStorage.removeItem('roomaityGenderPreference');
        
        // Set to male and reload
        const maleButton = document.querySelector('[data-select-gender="male"]');
        if (maleButton) {
            maleButton.click();
            const malePreference = localStorage.getItem('roomaityGenderPreference');
            
            if (malePreference !== 'male') {
                console.log('❌ Male preference not saved to localStorage');
                return false;
            }
            
            // Set to female and check
            const femaleButton = document.querySelector('[data-select-gender="female"]');
            if (femaleButton) {
                femaleButton.click();
                const femalePreference = localStorage.getItem('roomaityGenderPreference');
                
                if (femalePreference !== 'female') {
                    console.log('❌ Female preference not saved to localStorage');
                    return false;
                }
                
                console.log('✅ localStorage persistence test PASSED');
                return true;
            } else {
                console.log('❌ Female button not found');
                return false;
            }
        } else {
            console.log('❌ Male button not found');
            return false;
        }
    }
    
    function testMobileResponsiveness() {
        console.log('Testing mobile responsiveness...');
        console.log('This test requires manual verification on mobile devices');
        console.log('Please check that gender selection buttons stack vertically on small screens');
        return true; // This is a reminder for manual testing
    }
    
    // Run all tests
    function runAllTests() {
        console.log('Running all gender separation tests...');
        
        const tests = [
            { name: 'Male Selection', fn: testMaleSelection },
            { name: 'Female Selection', fn: testFemaleSelection },
            { name: 'Gender Indicator Text', fn: testGenderIndicatorText },
            { name: 'localStorage Persistence', fn: testLocalStoragePersistence },
            { name: 'Mobile Responsiveness', fn: testMobileResponsiveness }
        ];
        
        let passedTests = 0;
        let failedTests = 0;
        
        tests.forEach(test => {
            console.log(`\n📋 Running test: ${test.name}`);
            const result = test.fn();
            if (result) {
                passedTests++;
            } else {
                failedTests++;
            }
        });
        
        console.log(`\n📊 Test Results: ${passedTests} passed, ${failedTests} failed`);
        
        if (failedTests === 0) {
            console.log('🎉 All tests PASSED! Gender separation is working correctly.');
        } else {
            console.log('⚠️ Some tests FAILED. Please check the console for details.');
        }
    }
    
    // Add a test button only visible in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const testButton = document.createElement('button');
        testButton.textContent = 'Run Gender Separation Tests';
        testButton.style.position = 'fixed';
        testButton.style.bottom = '20px';
        testButton.style.right = '20px';
        testButton.style.zIndex = '9999';
        testButton.style.padding = '10px';
        testButton.style.backgroundColor = '#ff5a5f';
        testButton.style.color = 'white';
        testButton.style.border = 'none';
        testButton.style.borderRadius = '5px';
        testButton.style.cursor = 'pointer';
        
        testButton.addEventListener('click', runAllTests);
        document.body.appendChild(testButton);
    }
    
    // Automatically run tests if URL has test parameter
    if (window.location.search.includes('test=gender')) {
        setTimeout(runAllTests, 1000); // Delay to ensure page is fully loaded
    }
});
