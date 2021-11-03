// update book
update_book = async () => {
	enable_disable()
	_update_book.style.display = 'block'; 
	_isbn_original.style.display = 'block';
	
	try {
		await fetch("https://localhost:5001/api/Books")								
			.then(response => response.json()) // read response body and parse as JSON
			.then(data => {
				_update_books.innerHTML = "<table id='update_books' class='books'>" +
										  "<tr><th>Title</th><th>Author</th><th>Published" +
										  "</th><th>Pages</th></tr></table>";				
			
				const number_of_books = data.length;
				for ( i = 0; i < number_of_books; i++ ){
					_update_books.innerHTML += "<tr onClick='update_window(" + data[i].isbn + ")'><td>" + 
										data[i].title + "</td><td>" + 
										data[i].author + "</td><td>" + 
										data[i].published + "</td><td>" + 
										data[i].pages + "</td></tr>";
				}
			});		
	} catch {

	}		
}

update_window = async (isbn) => {
	    enable_disable() 
		_update_book_window.style.display = 'block';
		document.getElementById("isbn_original").value = isbn;
		
		let url = "https://localhost:5001/api/Books/" + isbn;
		try {
			await fetch(url)								
			  .then(response => response.json()) // read response body and parse as JSON
			  .then(data => {						
						document.getElementById("isbn_update").value = data[0].isbn;
						document.getElementById("title_update").value = data[0].title;
						document.getElementById("subtitle_update").value = data[0].subTitle;
						document.getElementById("author_update").value = data[0].author;
						document.getElementById("published_update").value = getDate(data[0].published);
						document.getElementById("publisher_update").value = data[0].publisher;
						document.getElementById("pages_update").value = data[0].pages;
						document.getElementById("description_update").value = data[0].description;
						document.getElementById("website_update").value = data[0].website; 						
				});				  			  
		} catch {

		}	
}

// update method
update = async () => {
	
	let isbn_original = document.getElementById("isbn_original").value;
	let isbn = document.getElementById("isbn_update").value;
	let title = document.getElementById("title_update").value;
	let subtitle = document.getElementById("subtitle_update").value;
	let author = document.getElementById("author_update").value;
	let published = document.getElementById("published_update").value;
	let publisher = document.getElementById("publisher_update").value;
	let pages = document.getElementById("pages_update").value;
	let description = document.getElementById("description_update").value;
	let website = document.getElementById("website_update").value;
			
	const book = {
		"isbn": isbn,
		"isbn_original": isbn_original,
		"title": title,
		"subTitle": subtitle,
		"author": author,
		"published": published,
		"publisher": publisher,
		"pages": pages,
		"description": description,
		"website": website
	};
	
	let url = "https://localhost:5001/api/Books";

	try {
		await fetch(url, {
			method: 'put',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(book)
		})
		  .then(res => {

			if ( res.status == 200 )
			  document.getElementById("alert").innerHTML = "Book updated..";
			else
			  document.getElementById("alert").innerHTML = "Error Updating Book..";
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		});
	} catch {
	}			
}