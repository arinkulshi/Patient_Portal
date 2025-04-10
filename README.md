 Build an API with a Frontend Component

Scenario:
Our company is building a patient portal where patients can view their recent reports. You need to build an API to fetch reports and display them in a simple frontend.


Requirements:
1. Backend
a. Implement an endpoint that returns a list of patient reports.
b. Each report has: id, patientName, date, summary.
c. The API should support filtering by patientName.
d. Implement a storage solution for reports data.
2. Frontend (Simple UI)
a. Create a small web page that fetches reports via API and displays them.
b. Allow filtering reports by patientName.
c. Visual alert if summary includes the words "tachycardia" or "arrhythmia".
3. Bonus
a. Use TypeScript for better type safety.
b. Include (passing) tests.
c. Add simple caching.
d. Dockerize the solution for easy setup.
4. Constraints:
a. The solution should take no more than 2 hours to complete.
b. Provide clear instructions on how to run the project.
c. Assume authentication is not required for simplicity.
5. Evaluation Criteria:
a. Code quality & readability
b. Basic frontend functionality & usability
c. Appropriate use of modern best practices
d. Performance considerations (e.g., filtering, efficient queries)
6. For Discussion:
a. Code review
b. Alternatives/Trade-offs Considered