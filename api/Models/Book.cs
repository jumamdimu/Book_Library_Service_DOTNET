using System;

namespace Book_Library_Services.Models
{
    public class Book
    {
        public string isbn { get; set; }
        public string title { get; set; }
        public string subTitle { get; set; }
        public string author { get; set; }
        public DateTime published { get; set; }
        public string publisher { get; set; }
        public int pages { get; set; }
        public string description { get; set; }
        public string website { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }
}