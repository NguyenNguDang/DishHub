# 🔧 Fix: Week Date Parse Error

## ❌ Lỗi Ban Đầu

```
Failed to parse week date: May 3 — May 9, 2026. 
Error: Text 'May 3, 2026' could not be parsed at index 4
```

## 🔍 Nguyên Nhân

**File:** `ShoppingListPage.tsx`

**Vấn đề:**
- Component tạo format date: `"May 3 — May 9, 2026"` (display format)
- Format này được gửi trực tiếp tới API thông qua `useGetShoppingList(currentWeek)`
- Backend không biết cách parse format này vì nó không phải là ISO format chuẩn
- Backend cố parse và báo lỗi: "Text 'May 3, 2026' could not be parsed at index 4"

## ✅ Giải Pháp

### 1. **Tách Display Format và API Format**

**Trước:**
```typescript
// Chỉ có một format
const getWeekDateRange = (index: number) => {
  // ...
  return `${format(startOfWeek)} — ${format(endOfWeek)}, ${endOfWeek.getFullYear()}`;
  // Return: "May 3 — May 9, 2026"
};
```

**Sau:**
```typescript
const getWeekDateRange = (index: number) => {
  // ...
  const isoStart = startOfWeek.toISOString().split('T')[0]; // YYYY-MM-DD
  
  return {
    display: `${format(startOfWeek)} — ${format(endOfWeek)}, ${endOfWeek.getFullYear()}`,
    iso: isoStart,
  };
};
```

### 2. **Sử dụng ISO Format Cho API**

**Trước:**
```typescript
// API nhận display format (sai)
const { data: shoppingList, isLoading, error } = useGetShoppingList(currentWeek);
// Gửi: "May 3 — May 9, 2026"
```

**Sau:**
```typescript
// API nhận ISO format (đúng)
const { data: shoppingList, isLoading, error } = useGetShoppingList(weekStartDate);
// Gửi: "2026-05-03"
```

### 3. **Thêm State Cho ISO Date**

```typescript
const [weekStartDate, setWeekStartDate] = useState<string>(() => {
  // Generate ISO format date for first call
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  return startOfWeek.toISOString().split('T')[0]; // Format: YYYY-MM-DD
});
```

### 4. **Update useEffect**

```typescript
useEffect(() => {
  const weekData = getWeekDateRange(weekIndex);
  setCurrentWeek(weekData.display);      // UI display: "May 3 — May 9, 2026"
  setWeekStartDate(weekData.iso);        // API call: "2026-05-03"
}, [weekIndex]);
```

## 📊 Format So Sánh

| Format | Sử Dụng | Ví Dụ |
|--------|---------|-------|
| **Display** | UI/Component | "May 3 — May 9, 2026" |
| **ISO** | API Backend | "2026-05-03" |

## 🎯 Luồng Hoạt Động Sau Fix

```
1. User click "Previous Week" / "Next Week"
   ↓
2. weekIndex state thay đổi
   ↓
3. useEffect được trigger
   ↓
4. getWeekDateRange(weekIndex) trả về object
   {
     display: "May 3 — May 9, 2026",
     iso: "2026-05-03"
   }
   ↓
5. setCurrentWeek(weekData.display)   // UI update
   setWeekStartDate(weekData.iso)     // API call
   ↓
6. useGetShoppingList(weekStartDate) gọi API
   - Gửi: GET /shopping-lists?startDate=2026-05-03
   - Backend parse "2026-05-03" thành date object
   ✅ Success!
```

## 📝 Files Thay Đổi

### `ShoppingListPage.tsx`

1. **State thêm mới:**
```typescript
const [weekStartDate, setWeekStartDate] = useState<string>(() => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  return startOfWeek.toISOString().split('T')[0];
});
```

2. **Hook update:**
```typescript
// Từ:
const { data: shoppingList } = useGetShoppingList(currentWeek);
// Tới:
const { data: shoppingList } = useGetShoppingList(weekStartDate);
```

3. **Function update:**
```typescript
// getWeekDateRange bây giờ trả về object với 2 format
// useEffect update để set cả display và iso format
```

## ✨ Kết Quả

- ✅ API nhận ISO format date hợp lệ (`2026-05-03`)
- ✅ Component vẫn hiển thị friendly format (`May 3 — May 9, 2026`)
- ✅ Không còn lỗi parse
- ✅ Week navigation hoạt động bình thường

## 🚀 Testing

### Kiểm tra:
1. Open browser DevTools → Network tab
2. Chọn "Previous Week" / "Next Week"
3. Kiểm tra request tới `/shopping-lists` API
4. Verify `startDate` parameter là ISO format: `2026-05-03`
5. Response nên trả về data thay vì error

## 📌 Best Practice

**Luôn sử dụng ISO format (YYYY-MM-DD) cho API communication:**
- Dễ parse ở backend
- Không bị lỗi locale
- Standard trong web development

**Sử dụng display format (May 3, 2026) cho UI:**
- Friendly cho user
- Dễ đọc
- Có thể custom theo locale


