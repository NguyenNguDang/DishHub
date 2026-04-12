# JWT Token Error - Nguyên nhân & Giải pháp

## ❌ Lỗi ban đầu:
```
Invalid compact JWT string: Compact JWSs must contain exactly 2 period characters, and compact JWEs must contain exactly 4. Found: 0
```

---

## 🔍 Nguyên nhân thực tế:

### **1. Frontend gửi token null/rỗng** ⚠️
```typescript
// ❌ TRƯỚC: Gửi "null" hoặc token rỗng
const token = localStorage.getItem('accessToken'); // có thể null
if (token) {  // ❌ Nếu token = "", điều kiện này vẫn true
  config.headers.Authorization = `Bearer ${token}`;
}

// ✅ SAU: Kiểm tra rỗng
if (token && token.trim() !== '') {
  config.headers.Authorization = `Bearer ${token}`;
}
```

### **2. JwtFilter cắt chuỗi không an toàn** ⚠️
```java
// ❌ TRƯỚC: Không check token rỗng
final String jwt = authHeader.substring(7);  // Nếu header = "Bearer ", thì jwt = ""
final String username = jwtUtil.extractUsername(jwt);  // ❌ Lỗi!

// ✅ SAU: Check trước khi cắt
final String jwt = authHeader.substring(7).trim();
if (jwt.isEmpty()) {
  chain.doFilter(request, response);
  return;
}
```

### **3. JwtUtil không validate token format** ⚠️
```java
// ❌ TRƯỚC: Trực tiếp parse token
public String extractUsername(String token) {
  return extractClaim(token, Claims::getSubject);  // Nếu token = "" → NullPointerException
}

// ✅ SAU: Validate format trước
public String extractUsername(String token) {
  try {
    // Token hợp lệ phải có 2 dấu chấm: xxxxx.xxxxx.xxxxx
    if (token == null || token.trim().isEmpty() || !token.contains(".")) {
      return null;
    }
    return extractClaim(token, Claims::getSubject);
  } catch (Exception e) {
    return null;  // Return null thay vì throw
  }
}
```

---

## ✅ Các file đã fix:

### **1. Backend - JwtFilter.java**
```java
// Thêm validation:
// ✓ Check header null/rỗng
// ✓ Check prefix "Bearer " 
// ✓ Check jwt rỗng sau substring(7)
// ✓ Try-catch để xử lý exception
```

### **2. Backend - JwtUtil.java**
```java
// extractUsername():
// ✓ Validate token == null
// ✓ Validate token.trim().isEmpty()
// ✓ Validate token.contains(".")
// ✓ Return null thay vì throw exception

// isTokenValid():
// ✓ Cùng validation
// ✓ Check username != null
// ✓ Return false thay vì throw
```

### **3. Frontend - api.ts**
```typescript
// Request interceptor:
// ✓ Check token && token.trim() !== ''
// Không gửi "Bearer null", "Bearer undefined", "Bearer "
```

---

## 🧪 Cách test:

### **Test 1: Login sau đó refresh page**
```bash
1. Đăng nhập → token được lưu
2. Refresh page → app load, kiểm tra localStorage.getItem('accessToken')
3. Gọi API → check Authorization header
4. Xác nhận token được gửi đúng format: "Bearer xxxxx.xxxxx.xxxxx"
```

### **Test 2: Kiểm tra console backend**
```bash
# Xem log JWT:
JWT validation error: ...
Error extracting username from token: ...
```

### **Test 3: Kiểm tra localStorage**
```javascript
// Chrome DevTools -> Application -> localStorage
accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ..."
```

---

## 🎯 Tóm tắt fix:

| Vấn đề | Giải pháp |
|--------|----------|
| Token null/rỗng từ FE | Validate `token.trim() !== ''` |
| Substring(7) trên chuỗi rỗng | Check `jwt.isEmpty()` |
| Parse token rỗng | Validate `!token.contains(".")` |
| Exception không được catch | Thêm try-catch, return null/false |

---

## 📝 Log để debug:

```bash
# Backend sẽ print:
2026-04-12 10:30:15 [WARN] JWT validation error: Invalid compact JWT string
2026-04-12 10:30:16 [WARN] Error extracting username from token: Compact JWSs must contain exactly 2 period characters

# Frontend DevTools Console sẽ show:
Authorization: Bearer xxx.xxx.xxx ✓
Authorization: Bearer (header gửi, không có token) ✗
```

---

## ✅ Status:
- ✓ JwtFilter.java - Fixed
- ✓ JwtUtil.java - Fixed
- ✓ api.ts (Frontend) - Fixed
- ✓ AuthProvider.tsx - Không cần fix (đã lưu token đúng)

