// delete book
delete_book = async () => {
	enable_disable() 
	_delete_book.style.display = 'block';
	
	try {
		await fetch("https://localhost:5001/api/Books")								
			.then(response => response.json()) // read response body and parse as JSON
			.then(data => {
				const number_of_books = data.length;
				_delete_books.innerHTML = "<table id='delete_books' class='books'>" +
										  "<tr><th>Title</th><th>Author</th><th>Published" +
										  "</th><th>Delete</th></tr></table>";
		
				for ( i = 0; i < number_of_books; i++ ){
					_delete_books.innerHTML += "<tr><td>" + 
										data[i].title + "</td><td>" + 
										data[i].author + "</td><td>" + 
										data[i].pages + "</td>" +
										"<td class='delete_action' onClick='delete_window(" + data[i].isbn + ")'>Delete</td></tr>";
				}
			});		
	} catch {

	}		
}

delete_window = (isbn) => {
	
var answer = confirm("Removing a book with ISBN: " + isbn);
	if (answer == true) {
				
		let isbn_string = isbn.toString()
		let _isbn = {
			"isbn": isbn_string
		};
		
		let url = "https://localhost:5001/api/Books/" + isbn_string;

		try {
			fetch(url, {
				method: 'delete',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(_isbn)
			})
			  .then(res => {
				if ( res.status == 200 )
				{
					document.getElementById("alert").innerHTML = "Book removed..";
					delete_book();
				}
				else
				  document.getElementById("alert").innerHTML = "Error Removing Book..";
				document.body.scrollTop = document.documentElement.scrollTop = 0;
			});
			
		} catch {
			document.getElementById("alert").innerHTML = "Error Removing Book..";
		}
	} 
}