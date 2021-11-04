// list all books method
list_books = async () => {
	enable_disable()
	_list_books.style.display = 'block';
		
	try {
		await fetch("https://localhost:5001/api/Books")								
			.then(response => response.json()) // read response body and parse as JSON
			.then(data => {
				_books.innerHTML = "<table id='books' class='books'>" +
										  "<tr><th>Title</th><th>Author</th><th>Published" +
										  "</th><th>Pages</th></tr></table>";				
				const number_of_books = data.length;
				for ( i = 0; i < number_of_books; i++ ){
					_books.innerHTML += "<tr onClick='display_window(" + data[i].isbn + ")'><td>" + data[i].title + "</td><td>" + 
										data[i].author + "</td><td>" + 
										getDate(data[0].published) + "</td><td>" + 
										data[i].pages + "</td></tr>";
				}
			});		
	} catch {

	}
}

display_window = async (isbn) => {
	enable_disable()
	_display_book_window.style.display = 'block';
	
	let url = "https://localhost:5001/api/Books/" + isbn;
	try {
		await fetch(url)								
		  .then(response => response.json()) // read response body and parse as JSON
		  .then(data => {			  
					document.getElementById("display_isbn").innerHTML = data[0].isbn;
					document.getElementById("display_title").innerHTML = data[0].title;
					document.getElementById("display_subtitle").innerHTML = data[0].subTitle;
					document.getElementById("display_author").innerHTML = data[0].author;
					document.getElementById("display_published").innerHTML = getDate(data[0].published);;
					document.getElementById("display_publisher").innerHTML = data[0].publisher;
					document.getElementById("display_pages").innerHTML = data[0].pages;
					document.getElementById("display_description").innerHTML = data[0].description;
					document.getElementById("display_website").innerHTML = data[0].website; 						
			});				  			  
	} catch {

	}	
}
