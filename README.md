# book_library_services

# Description
Book Library Services is a REST API (also known as RESTful API)  
This is a Book Library Service  
The API uses JSON for communication with the clients.  
The API contains the model for books  
The API uses the Sqlite DB for storing book records; however the service keeps a copy of the book in memory for the rapid getting. For example, if the user requests same books several times, the API retrieves the record once.  
The API runs on a server and is in charge of handling a set of services, while listening for incoming requests concerning the said services. The responses, in turn, are delivered via the initiated connection by a client system requesting one of those services.  
The main point behind this development is to separate the front-end User Interface related processing of the book records from the server-side processes, which takes care of the storage and server side manipulation of records.  
The communication between server and client is stateless where by each given request coming from the client side have all the required information for the server-side instance to understand it.  
The API utilizes the Microsoft.Extensions.Caching.Memory/IMemoryCache for in-memory data storage. IMemoryCache acts as a key-value cache and database.   
# Folder Structure
Controllers  
--BookLiBraryController.js  
Models  
--Book.js
obj  
properties  
--launchSettings.json    
library.db  
Startup.js 
Program.js    
Appsettings.json   
This Book Library Service is an API which maintains the information about the user’s books present in the library. Users can add, update, delete, and view books. This API has been created to automate the activities performed in library, related to the members of the library. Furthermore, the API consists of the Weather update service.  
The API has a separate client user interface to demonstrate its usage.   
# How to Run the app
• Move to the api folder and execute "dotnet run".   
• In the project there are two folders, one is api and the other is ui  
• From the terminal, to run the server side API navigate to the api folder and run "dotnet run" command.  
• To run the client side code, navigate to the ui folder and double click index.html file.  
  
# The Scope of the API
The API provides service for adding, updating, deleting and getting books.  
The User Interface Part provides add, delete, update and list screen for the library services.  
The API gets the real time data from https://openweathermap.org/ and service to UI.  
This API caches the weather data for one hour.  
The API is flexible free for extensibility, able to handle the addition of new features.   
# Pre Requisites 
• .NET 5.0 SDK  
• ASP.NET Core     
• Sqlite3 database for storage of the book records 
 
# End Points
• GET https://localhost:5001/api/Books  
• GET https://localhost:5001/api/Books/isbn  
• PUT https://localhost:5001/api/Books/isbn  
• DELETE https://localhost:5001/api/Books/isbn  
• POST https://localhost:5001/api/Books  
These end points provide a set of general actions that any API which is resource based should be able to provide: create, retrieve, update, and delete (CRUD) actions.  
HTTP Verbs and Their Proposed Actions   
• GET - Access a book resource in a read-only mode   
• POST Used to add/create a new book to the server storage  
• PUT Used to update a given book   
• DELETE Used to delete a book  
The API responds with several status codes, numbers that represents the response related to it. These include 200 for “OK,” 404 for “Page not found,” 500 for “Internal server error,” 201 Created, that is the book was created and the API has approved it.   




