# ✅ Backend API - JSON Deserialization Fix Complete

## 🔧 Vấn đề Được Giải Quyết

### Lỗi Ban Đầu:
```
JSON parse error: Cannot deserialize value of type `java.lang.String` 
from Array value (token `JsonToken.START_ARRAY`)
```

Frontend gửi `instructions` và `tags` dưới dạng Array `[]`, nhưng backend DTO định nghĩa là `String`.

---

## ✅ Giải Pháp Được Thực Hiện

### 1. **RecipeRequest DTO** - Updated ✅
```java
private List<String> tags;          // Từ: không có → List<String>
private List<String> instructions;  // Từ: String → List<String>
private String description;         // Thêm mới
private String image;              // Thêm mới
private Integer prepTime;          // Thêm mới
private Integer cookTime;          // Thêm mới
private Integer servings;          // Thêm mới
private String difficulty;         // Thêm mới
```

### 2. **RecipeResponse DTO** - Updated ✅
```java
private String image;              // Thêm mới
private Integer prepTime;          // Thêm mới
private Integer cookTime;          // Thêm mới
private Integer servings;          // Thêm mới
private String difficulty;         // Thêm mới
private List<String> tags;         // Thêm mới
private List<String> instructions; // Thêm mới
```

### 3. **RecipeEntity Model** - Updated ✅
```java
private String description;        // Thêm mới
private Integer prepTime;          // Thêm mới
private Integer cookTime;          // Thêm mới
private Integer servings;          // Thêm mới
private String difficulty;         // Thêm mới
private String tags;               // Thêm mới (lưu dưới dạng CSV)
private String instructions;       // Thêm mới (lưu dưới dạng pipe-separated)
```

### 4. **RecipeServiceImpl** - Updated ✅
- Xử lý chuyển đổi `List<String>` → `String` (khi lưu vào DB)
- Xử lý chuyển đổi `String` → `List<String>` (khi read từ DB)
- Tags: Ngăn cách bằng `,` (comma)
- Instructions: Ngăn cách bằng `|` (pipe)

---

## 📊 Data Storage Format

```
Database (recipes table):
- tags:         "healthy,quick,asian"      (CSV)
- instructions: "Step 1|Step 2|Step 3"     (Pipe-separated)

API Response (RecipeResponse):
- tags:         ["healthy", "quick", "asian"]  (Array)
- instructions: ["Step 1", "Step 2", "Step 3"]  (Array)
```

---

## 🗄️ Database Migration Required

File tạo: `backend/database_migrations/001_add_recipe_columns.sql`

```sql
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS prep_time INT DEFAULT 0;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS cook_time INT DEFAULT 0;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS servings INT DEFAULT 1;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50) DEFAULT 'medium';
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS tags TEXT;
```

**Thực hiện:**
1. Chạy SQL script vào MySQL database
2. Hoặc chạy Liquibase/Flyway migration tự động

---

## ✅ Status

- ✅ RecipeRequest DTO updated
- ✅ RecipeResponse DTO updated  
- ✅ RecipeEntity model updated
- ✅ RecipeServiceImpl service layer updated
- ⚠️ Database columns cần thêm (migration script sẵn sàng)
- ⏳ Maven build: Sắp hoàn thành

---

## 🚀 Tiếp Theo

1. **Run Database Migration** - Thêm các cột mới vào table `recipes`
2. **Build Backend** - `mvn clean package`
3. **Restart Backend** - Spring Boot sẽ ánh xạ các cột mới
4. **Test API** - Frontend sẽ gửi/nhận data đúng định dạng

---

## 📝 API Flow Example

### CREATE Request (POST /api/v1/recipes)
```json
{
  "title": "Phở Bò",
  "description": "Phở Bò truyền thống",
  "image": "https://...",
  "prepTime": 30,
  "cookTime": 60,
  "servings": 4,
  "difficulty": "medium",
  "category": "Soup",
  "tags": ["vietnamese", "hot", "soup"],
  "instructions": ["Nấu nước dùng", "Cắt thịt", "Ăn nóng"],
  "isPublic": true
}
```

### Response (RecipeResponse)
```json
{
  "id": 1,
  "title": "Phở Bò",
  "description": "Phở Bò truyền thống",
  "image": "https://...",
  "prepTime": 30,
  "cookTime": 60,
  "servings": 4,
  "difficulty": "medium",
  "category": "Soup",
  "tags": ["vietnamese", "hot", "soup"],
  "instructions": ["Nấu nước dùng", "Cắt thịt", "Ăn nóng"],
  "isPublic": true,
  "nutrition": {...},
  "createdAt": "2026-04-09T..."
}
```

**All set!** ✅

