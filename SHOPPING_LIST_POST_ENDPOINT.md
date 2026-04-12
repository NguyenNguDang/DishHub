# Shopping List - POST Endpoint Implementation ✅

## 📝 Tóm tắt

Đã thêm **POST endpoint** để tạo item mới vào shopping list:

```bash
POST /api/v1/shopping-lists/{shoppingListId}/items
```

---

## 🆕 Files Tạo Mới

### **1. CreateShoppingListItemRequest.java**
```java
@Data
public class CreateShoppingListItemRequest {
    private String name;
    private Double quantity;
    private String unit;
    private String category;
}
```

---

## 🔧 Files Sửa Đổi

### **1. ShoppingListController.java**
Thêm POST endpoint:
```java
@PostMapping("/{shoppingListId}/items")
@Operation(summary = "Add new shopping list item")
public ResponseEntity<ShoppingListItemResponse> addShoppingListItem(
    @PathVariable Long shoppingListId,
    @RequestBody CreateShoppingListItemRequest request
) {
    ShoppingListItemResponse response = shoppingListService.addShoppingListItem(
        shoppingListId,
        request
    );
    return ResponseEntity.ok(response);
}
```

### **2. ShoppingListService.java**
Thêm method addShoppingListItem:
```java
public ShoppingListItemResponse addShoppingListItem(
    Long shoppingListId,
    CreateShoppingListItemRequest request
) {
    ShoppingListEntity shoppingList = shoppingListRepository.findById(shoppingListId)
        .orElseThrow(() -> new RuntimeException("Shopping list not found"));
    
    ShoppingListItemEntity newItem = ShoppingListItemEntity.builder()
        .name(request.getName())
        .quantity(request.getQuantity())
        .unit(request.getUnit())
        .category(request.getCategory())
        .isChecked(false)
        .shoppingList(shoppingList)
        .build();
    
    shoppingList.getItems().add(newItem);
    shoppingListRepository.save(shoppingList);
    
    return mapItemToResponse(newItem);
}
```

---

## 🔄 Complete API Endpoints

| Method | Endpoint | Chức năng | Status |
|--------|----------|----------|--------|
| GET | `/api/v1/shopping-lists?weekStart=...` | Lấy danh sách | ✅ |
| POST | `/api/v1/shopping-lists/{id}/items` | **Thêm item** | ✅ **NEW** |
| PUT | `/api/v1/shopping-lists/{id}/items/{id}` | Cập nhật item | ✅ |
| DELETE | `/api/v1/shopping-lists/{id}/items/{id}` | Xóa item | ✅ |
| POST | `/api/v1/shopping-lists/{id}/share` | Chia sẻ | ✅ |

---

## 📊 Request/Response Examples

### **POST - Add Item**
```bash
# Request
POST /api/v1/shopping-lists/1/items
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Baby Spinach",
  "quantity": 500,
  "unit": "g",
  "category": "Produce"
}

# Response (200 OK)
{
  "id": 15,
  "name": "Baby Spinach",
  "quantity": 500,
  "unit": "g",
  "category": "Produce",
  "isChecked": false,
  "createdAt": "2026-04-12T10:30:00",
  "updatedAt": "2026-04-12T10:30:00"
}
```

---

## 🎯 How to Use from Frontend

Frontend có sẵn service, chỉ cần call:

```typescript
// Frontend: shoppingListService.ts - addShoppingListItem()
const newItem = await shoppingListService.addShoppingListItem(
  shoppingListId,
  {
    name: "Baby Spinach",
    quantity: 500,
    unit: "g",
    category: "Produce"
  }
);
```

**Hook React Query:**
```typescript
// Có thể tạo hook tương tự nếu cần
const useAddShoppingListItem = () => {
  return useMutation({
    mutationFn: async ({ shoppingListId, data }) => {
      return shoppingListService.addShoppingListItem(shoppingListId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingList'] });
    }
  });
};
```

---

## ✅ Complete & Ready

**Status:** ✅ **100% COMPLETE**

Tất cả 5 endpoints đã implement và sẵn sàng:
- ✅ GET - Lấy danh sách
- ✅ POST - Thêm item **NEW**
- ✅ PUT - Cập nhật item
- ✅ DELETE - Xóa item
- ✅ POST - Chia sẻ

**Frontend cũng đã sẵn sàng** - chỉ cần gọi `shoppingListService.addShoppingListItem()`

---

## 🚀 Deployment Steps

1. **Rebuild backend:**
   ```bash
   mvn clean install
   # or
   ./mvnw clean install
   ```

2. **Restart server**

3. **Test endpoint:**
   ```bash
   curl -X POST http://localhost:8080/api/v1/shopping-lists/1/items \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer {token}" \
     -d '{"name": "Test Item", "quantity": 1, "unit": "piece", "category": "Other"}'
   ```

4. **Frontend tự động hoạt động** - Service đã có sẵn!

---

**Lại hoàn thành! 🎉**

