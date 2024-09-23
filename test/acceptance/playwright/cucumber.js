module.exports = {
  default: `--require features/hooks.js
   --require features/step_definitions/**/*.js
   --format progress-bar
   --format html:reports/cucumber-report.html
   --format json:reports/cucumber-report.json`
}
