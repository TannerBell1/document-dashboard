
Setup Steps
------------------------------------------------

Backend Setup:
----------------
Setup Database Schema
Created 2 tables - Users and Documents.
Established a foreign key in Documents to connect Users to their uploads, creating a one to many relationship. 

Setup Authentication
Hardcoded a user ID in seed_user.js and then added that user to the database
Created an Authorization Controller to verify the entered username and password, and generate a token if the information is valid.
Created Middleware to verify the token of any request being put through.
Created a Route that triggers the login function when someone ‘POSTS’ 

Setup Doc Upload
Created Middleware to set the upload of the file to a specific destination, and create a unique filename for each upload to avoid collisions. Middleware also verifies file type and size are within the set parameters.
Created a processingDocument job that runs asynchronously, meaning it runs in the background and doesn’t hold up the request/response cycle; it simply begins once a document is uploaded. This functions to read the file, produce a word count, and preview, and update the database all the while updating status throughout the process. 
Created a document Controller to create 3 functions,
Handles file uploads and triggers document processing
Retrieves an array of all documents submitted to be displayed on the dashboard
Retrieves the metadata on an individual document for the results page
Created Routes for document authentication upon ‘POSTS’ and ‘GETS’

Setup Analytics Processing
Created 3 Controller functions using Queries: 
1 number of uploads per day
2 number processed per day
3 number of each status currently
Created 3 Routes for URL mapping
1 to GET the uploaded statistics
2 to GET the processed statistics
3 to GET the status statistics
Register the Routes in the App.js file

Frontend Setup:
----------------
Built Login Page
Setup useStates for username, password and error handling. 
Created async login logic that stores the JWT token in localStorage 
and redirects to the dashboard on success.

Built Status Badge Component
Reusable component that renders a color coded pill based on 
document status. Used across the dashboard and detail page.

Built Main Dashboard Page
Fetches documents and analytics data on load. Displays filterable 
document table, file upload button, and three analytics charts.

Built Document Detail Page
Fetches individual document by ID from the URL. Displays all 
metadata and processing results.


Design Decisions
------------------------------------------------
- Seperated backend concerns into controllers, routes, middleware and jobs for organization
- Documents are processed asynchronously so users receive an imediate response and multiple documents can be processed simulatneously
- Files are saves with a milisecond timestamp added to the filename to avoid collisions
- Only hashed passwords are saved to the database for extra security

Assumptions
------------------------------------------------
- A single hardcoded user is acceptable
- Accurate Text Extraction for files outside of raw TEXT is not necessary
- All documents should be visible to the user regardless of who uploaded them

Tech Stack used
------------------------------------------------
Backend:
- Node.js with Express
- PostgreSQL
- JWT for authentication
- bcryptjs for password hashing
- multer for file uploads
- dotenv for environment variables

Frontend:
- React
- React Router for navigation
- Axios for API calls
- Recharts for analytics charts
