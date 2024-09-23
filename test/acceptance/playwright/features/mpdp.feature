Feature: Example Playwright Test with Cucumber for MPDP

  Scenario: Search for an agreement holder using location
    Given I navigate to MPDP Search page
    When I search for an agreement holder using a location
    And I select the first result from the search results
    Then I should see summary details for the agreement holder
