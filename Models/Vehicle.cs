using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class Vehicle
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
        public string Name { get; set; }
        public string Category { get; set; }
        public int MaxSpeed { get; set; }
        public double Length { get; set; }
        public DateTime LastService { get; set; }
        public DateTime NextService { get; set; }
        public string Image { get; set; }
    }
}
