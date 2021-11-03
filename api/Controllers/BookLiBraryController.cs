using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Book_Library_Services.Models;
using Microsoft.Extensions.Configuration;
using Dapper;
using System.Data.SQLite;
using System.Net;
using System.IO;
using Microsoft.Extensions.Caching.Memory;
 
namespace Book_Library_Services.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : Controller
    {
        private readonly IConfiguration _configuration;
        private string conStr;
        DateTime now = DateTime.Now;
        private readonly IMemoryCache _cache;
        private string message = "Success";
        public BooksController(IConfiguration configuration, IMemoryCache memoryCache)
        {
            _configuration = configuration;
            conStr = _configuration.GetConnectionString("DBConnection");
            _cache = memoryCache;
        }
 
        [HttpGet]
        public ActionResult<IEnumerable<Book>> Get()
        {
            var cacheKey = "books";

            IEnumerable<Book> books = new List<Book>();
            if(!_cache.TryGetValue(cacheKey, out books)){
                using (var conn = new SQLiteConnection(conStr))
                {
                    conn.Open(); 
                    books = conn.Query<Book>("SELECT * FROM Books ORDER BY isbn");

                    var cacheExpirationOptions =
                    new MemoryCacheEntryOptions{
                        AbsoluteExpiration = DateTime.Now.AddHours(1),
                        Priority = CacheItemPriority.Normal,
                        SlidingExpiration = TimeSpan.FromMinutes(5)
                    };
                    _cache.Set(cacheKey, books, cacheExpirationOptions);    
                }
            }
            return new ActionResult<IEnumerable<Book>>(books);
        }
 
        [HttpGet("{isbn}")]
        public ActionResult<IEnumerable<Book>> GetByBook(string isbn)
        {
            var cacheKey = isbn;
            IEnumerable<Book> books = new List<Book>();
            if(!_cache.TryGetValue(cacheKey, out books)){
                using (var conn = new SQLiteConnection(conStr))
                {
                    conn.Open(); 
                    books = conn.Query<Book>("SELECT * FROM Books WHERE isbn = @BookIsbn", new { BookIsbn = isbn });

                    var cacheExpirationOptions =
                    new MemoryCacheEntryOptions{
                        AbsoluteExpiration = DateTime.Now.AddHours(1),
                        Priority = CacheItemPriority.Normal,
                        SlidingExpiration = TimeSpan.FromMinutes(5)
                    };
                    _cache.Set(cacheKey, books, cacheExpirationOptions);    
                }
            }
            return new ActionResult<IEnumerable<Book>>(books);
        }
 
        [HttpPost]
        public IActionResult Post([FromBody] Book payload)
        {            
            try
            {
                    using (var conn = new SQLiteConnection(conStr))
                    {                        
                        conn.Open();                     
                        conn.Execute(@"INSERT INTO Books (isbn, title, subTitle, author, published, publisher, pages, description, website, createdAt, updatedAt) VALUES (@Isbn, @Title, @SubTitle, @Author, @Published, @Publisher, @Pages, @Description, @Website, @CreatedAt, @UpdatedAt)", 
                            new
                            {
                                Isbn = payload.isbn,
                                Title = payload.title,
                                SubTitle = payload.subTitle,
                                Author = payload.author,
                                Published = payload.published,
                                Publisher = payload.publisher,
                                Pages = payload.pages,
                                Description = payload.description,
                                Website = payload.website, 
                                CreatedAt = now, 
                                UpdatedAt = now                         
                            });
                        resetCachedData();    
                        return Ok(payload);
                    } 
            }
            catch (SQLiteException e) 
            {
                return BadRequest(e); 
            }            
        }
 
        [HttpPut()]
        public IActionResult Put([FromBody] Book payload)
        {
            try
            {
                using (var conn = new SQLiteConnection(conStr))
                {
                    conn.Open(); 

                    var result = conn.Execute(@"UPDATE Books SET isbn=@NewIsbn, title=@Title, subTitle=@SubTitle, author=@Author, published=@Published, publisher=@Publisher, pages=@Pages, description=@Description, website=@Website WHERE isbn=@Isbn",
                        new
                        {
                            NewIsbn = payload.isbn,
                            Title = payload.title,
                            SubTitle = payload.subTitle,
                            Author = payload.author,
                            Published = payload.published,
                            Publisher = payload.publisher,
                            Pages = payload.pages,
                            Description = payload.description,
                            Website = payload.website, 
                            CreatedAt = now, 
                            UpdatedAt = now,
                            Isbn = payload.isbn                         
                        });                          
                    if (result == 1) {

                       resetCachedData();
                       return Ok(payload);
                    } 
                    else
                        return NotFound(); // HTTP 404
                }
            }
            catch (SQLiteException excp) 
            {
                return BadRequest(excp); // HTTP 400 
            }
        }
 
        [HttpDelete("{isbn}")]
        public IActionResult Delete(string isbn)
        {
            try {
                using (var conn = new SQLiteConnection(conStr))
                {
                    conn.Open(); 
                    
                    var result = conn.Execute(@"DELETE FROM Books WHERE isbn=@bookIsbn",new { bookIsbn = isbn }); 
                        IEnumerable<Book> books = new List<Book>();                            
                        if (result == 1) {
                        resetCachedData();
                        return Ok();                          
                    }                      
                    else return NotFound(); 
                }
            } catch { return NotFound(); }
        }

        // GET api/Books/latitude/longitude
        [HttpGet("{latitude}/{longitude}")]
        public string GetQuery(string latitude, string longitude)
        {
            try {
                var weatherApiURL = "https://api.openweathermap.org/data/2.5";
                var weatherApiKey = "958d4bfcf11e2ef676e52b61f59f126e";
                var url = $"{weatherApiURL}" + "/weather/?lat=" + $"{latitude}" + "&lon=" + $"{longitude}" + "&units=metric&APPID=" + $"{weatherApiKey}";
  
                var jsonString = "";
                var cacheKey = latitude + longitude;

                if(!_cache.TryGetValue(cacheKey, out jsonString)){
                    HttpWebRequest WebReq = (HttpWebRequest)WebRequest.Create(string.Format(url));

                    WebReq.Method = "GET";

                    HttpWebResponse WebResp = (HttpWebResponse)WebReq.GetResponse();
                    
                    using (Stream stream = WebResp.GetResponseStream())
                    {
                        StreamReader reader = new StreamReader(stream, System.Text.Encoding.UTF8);
                        jsonString = reader.ReadToEnd();
                        var cacheExpirationOptions =
                        new MemoryCacheEntryOptions{
                            AbsoluteExpiration = DateTime.Now.AddHours(1),
                            Priority = CacheItemPriority.Normal,
                            SlidingExpiration = TimeSpan.FromMinutes(5)
                        };
                        _cache.Set(cacheKey, jsonString, cacheExpirationOptions); 

                    }
                }

                return jsonString;
            } catch {
                message = "Network Error";
                return "{ \"message\":" + $"{message}" + "}";
            }            
        }

        public void resetCachedData(){
            var cacheKey = "books"; 
            IEnumerable<Book> books = new List<Book>();
            if (_cache != null && _cache.Get("books") != null)
            {
                var cacheExpirationOptions =
                new MemoryCacheEntryOptions{
                    AbsoluteExpiration = DateTime.Now.AddHours(0),
                    Priority = CacheItemPriority.Normal,
                    SlidingExpiration = TimeSpan.FromSeconds(1)
                };
                _cache.Set(cacheKey, books, cacheExpirationOptions);  
            }
        }  
    }
}